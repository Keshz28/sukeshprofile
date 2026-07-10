/**
 * Save helpers for the local Content Studio.
 *
 * The site is a static export with NO server, so there is no API to save to.
 * Instead the editor writes `content.json` straight to your disk using the
 * browser's File System Access API (Chrome/Edge), with a plain download as a
 * universal fallback. Nothing here ever touches your live site.
 */

// Minimal shape of the parts of the File System Access API we use, so we don't
// need to pull in extra @types just for this local tool.
type Permission = "granted" | "denied" | "prompt";
export type FileHandle = {
  name?: string;
  createWritable: () => Promise<{
    write: (data: string) => Promise<void>;
    close: () => Promise<void>;
  }>;
  getFile: () => Promise<File>;
  queryPermission?: (o: { mode: "read" | "readwrite" }) => Promise<Permission>;
  requestPermission?: (o: { mode: "read" | "readwrite" }) => Promise<Permission>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const w = (typeof window !== "undefined" ? window : {}) as any;

export const supportsFileSystem = (): boolean =>
  typeof window !== "undefined" && "showSaveFilePicker" in window;

/** Pretty-print the draft the same way we want it committed. */
export const serialize = (data: unknown): string =>
  JSON.stringify(data, null, 2) + "\n";

async function ensurePermission(handle: FileHandle): Promise<boolean> {
  if (!handle.queryPermission || !handle.requestPermission) return true;
  const opts = { mode: "readwrite" as const };
  if ((await handle.queryPermission(opts)) === "granted") return true;
  return (await handle.requestPermission(opts)) === "granted";
}

/** Write JSON to an existing handle, or prompt for a location the first time. */
export async function saveToDisk(
  json: string,
  handle: FileHandle | null
): Promise<FileHandle> {
  let h = handle;
  if (!h) {
    h = (await w.showSaveFilePicker({
      suggestedName: "content.json",
      types: [
        {
          description: "JSON",
          accept: { "application/json": [".json"] },
        },
      ],
    })) as FileHandle;
  } else if (!(await ensurePermission(h))) {
    throw new Error("Permission to write the file was denied.");
  }

  const writable = await h.createWritable();
  await writable.write(json);
  await writable.close();
  void idbSet("contentHandle", h);
  return h;
}

/** Let the user pick an existing content.json to continue editing. */
export async function openFromDisk(): Promise<{
  data: unknown;
  handle: FileHandle;
}> {
  const [handle] = (await w.showOpenFilePicker({
    types: [{ description: "JSON", accept: { "application/json": [".json"] } }],
  })) as FileHandle[];
  const file = await handle.getFile();
  const data = JSON.parse(await file.text());
  void idbSet("contentHandle", handle);
  return { data, handle };
}

/** Universal fallback — trigger a normal browser download. */
export function downloadJson(json: string, filename = "content.json"): void {
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function copyJson(json: string): Promise<void> {
  await navigator.clipboard.writeText(json);
}

/* ── tiny IndexedDB store so the chosen file is remembered across reloads ── */

const DB_NAME = "kesh-studio";
const STORE = "handles";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function idbGet(key: string): Promise<FileHandle | null> {
  try {
    const db = await openDb();
    return await new Promise((resolve) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(key);
      req.onsuccess = () => resolve((req.result as FileHandle) ?? null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function idbSet(key: string, val: FileHandle): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(val, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    /* best-effort only */
  }
}
