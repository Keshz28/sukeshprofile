"use client";

import { useState, type ReactNode } from "react";

const inputCls =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 font-body text-sm text-white/90 outline-none transition focus:border-blue-glow/50 focus:bg-white/[0.05] placeholder:text-white/25";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/50">
          {label}
        </span>
        {hint ? (
          <span className="font-mono text-[10px] text-white/30">{hint}</span>
        ) : null}
      </span>
      {children}
    </label>
  );
}

export function Text({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={inputCls}
    />
  );
}

export function Area({
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      rows={rows}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputCls} resize-y leading-[1.6]`}
    />
  );
}

export function Num({
  value,
  onChange,
  min = 0,
  max = 100,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <input
      type="number"
      value={Number.isFinite(value) ? value : 0}
      min={min}
      max={max}
      onChange={(e) => onChange(Number(e.target.value))}
      className={inputCls}
    />
  );
}

export function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputCls} cursor-pointer`}
    >
      {options.map((o) => (
        <option key={o} value={o} className="bg-ink text-white">
          {o}
        </option>
      ))}
    </select>
  );
}

/** Editable list of short strings shown as removable chips. */
export function Tags({
  value,
  onChange,
  placeholder = "Type and press Enter…",
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const v = draft.trim();
    if (v && !value.includes(v)) onChange([...value, v]);
    setDraft("");
  };

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2">
      {value.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {value.map((tag, i) => (
            <span
              key={`${tag}-${i}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.06] px-2.5 py-1 font-mono text-[11px] text-white/80"
            >
              {tag}
              <button
                type="button"
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                className="text-white/40 transition hover:text-red-glow"
                aria-label={`Remove ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <input
        type="text"
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add();
          }
        }}
        onBlur={add}
        className="w-full bg-transparent px-1 py-1 font-body text-sm text-white/90 outline-none placeholder:text-white/25"
      />
    </div>
  );
}

/** Editable vertical list of longer strings (paragraphs, bullet points). */
export function StringList({
  value,
  onChange,
  multiline,
  placeholder,
  addLabel = "Add line",
}: {
  value: string[];
  onChange: (v: string[]) => void;
  multiline?: boolean;
  placeholder?: string;
  addLabel?: string;
}) {
  return (
    <div className="space-y-2">
      {value.map((line, i) => (
        <div key={i} className="flex gap-2">
          {multiline ? (
            <textarea
              value={line}
              rows={2}
              placeholder={placeholder}
              onChange={(e) =>
                onChange(value.map((v, j) => (j === i ? e.target.value : v)))
              }
              className={`${inputCls} resize-y leading-[1.6]`}
            />
          ) : (
            <input
              type="text"
              value={line}
              placeholder={placeholder}
              onChange={(e) =>
                onChange(value.map((v, j) => (j === i ? e.target.value : v)))
              }
              className={inputCls}
            />
          )}
          <div className="shrink-0">
            <IconBtn
              title="Remove"
              danger
              onClick={() => onChange(value.filter((_, j) => j !== i))}
            >
              ✕
            </IconBtn>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, ""])}
        className="rounded-lg border border-dashed border-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/55 transition hover:border-blue-glow/40 hover:text-white"
      >
        + {addLabel}
      </button>
    </div>
  );
}

/** Small pill button used for row actions (move / delete / add). */
export function IconBtn({
  onClick,
  title,
  children,
  danger,
  disabled,
}: {
  onClick: () => void;
  title: string;
  children: ReactNode;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      disabled={disabled}
      className={`grid h-7 w-7 place-items-center rounded-md border text-sm transition disabled:cursor-not-allowed disabled:opacity-30 ${
        danger
          ? "border-red-glow/25 text-red-glow/80 hover:border-red-glow/60 hover:bg-red-glow/10"
          : "border-white/12 text-white/60 hover:border-white/30 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Generic add / remove / reorder editor for an array of objects.
 * `renderItem` receives an `update(patch)` fn to patch that item.
 */
export function ArrayEditor<T>({
  items,
  onChange,
  makeBlank,
  itemLabel,
  renderItem,
  addLabel = "Add item",
}: {
  items: T[];
  onChange: (next: T[]) => void;
  makeBlank: () => T;
  itemLabel: (item: T, i: number) => string;
  renderItem: (item: T, update: (patch: Partial<T>) => void) => ReactNode;
  addLabel?: string;
}) {
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const update = (i: number, patch: Partial<T>) =>
    onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="truncate font-display text-sm font-semibold text-white/90">
              <span className="mr-2 font-mono text-[11px] text-white/35">
                {String(i + 1).padStart(2, "0")}
              </span>
              {itemLabel(item, i) || "Untitled"}
            </span>
            <div className="flex shrink-0 gap-1.5">
              <IconBtn
                title="Move up"
                onClick={() => move(i, -1)}
                disabled={i === 0}
              >
                ↑
              </IconBtn>
              <IconBtn
                title="Move down"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
              >
                ↓
              </IconBtn>
              <IconBtn
                title="Delete"
                danger
                onClick={() => onChange(items.filter((_, j) => j !== i))}
              >
                ✕
              </IconBtn>
            </div>
          </div>
          <div className="space-y-3">
            {renderItem(item, (patch) => update(i, patch))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...items, makeBlank()])}
        className="w-full rounded-xl border border-dashed border-white/15 py-3 font-mono text-xs uppercase tracking-[0.12em] text-white/55 transition hover:border-blue-glow/40 hover:bg-white/[0.03] hover:text-white"
      >
        + {addLabel}
      </button>
    </div>
  );
}
