"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Effect } from "postprocessing";
import * as THREE from "three";

/**
 * LIGHT MODE — THE WHITE HOLE (Gargantua, inverted).
 *
 * A bright object can't read on a bright page — additive glow only brightens
 * what's behind it, and there's nothing to brighten on cream. So the SKY opens
 * a dark warm "pocket" around the anomaly: deep space right where the hole is,
 * fading back to luminous cream toward the edges where the text lives. The
 * brilliant lensed ring then pops against the dark exactly like the reference,
 * while the page still reads as light.
 */
const WH = new THREE.Vector3(2.4, 0.4, -1);

const NOISE = /* glsl */ `
float hash(vec3 p){ p=fract(p*0.3183099+0.1); p*=17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float noise(vec3 x){ vec3 i=floor(x); vec3 f=fract(x); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(hash(i+vec3(0,0,0)),hash(i+vec3(1,0,0)),f.x),
                 mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),
                 mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z); }
float fbm(vec3 p){ float v=0.0,a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.02; a*=0.5;} return v; }
`;

/* ───────────────────────── luminous sky w/ dark pocket ──────────────────── */
function Sky() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: { uTime: { value: 0 }, uHole: { value: new THREE.Vector3() } },
        vertexShader: /* glsl */ `
          varying vec3 vDir;
          void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
        `,
        fragmentShader: /* glsl */ `
          precision highp float;
          varying vec3 vDir; uniform float uTime; uniform vec3 uHole;
          ${NOISE}
          void main(){
            vec3 d = normalize(vDir);
            float t = uTime*0.02;
            float n  = fbm(d*2.0 + vec3(t, t*0.5, 0.0));
            float n2 = fbm(d*4.3 - vec3(0.0, t*0.6, t));
            vec3 cream = vec3(1.00, 0.972, 0.925);
            vec3 gold  = vec3(0.99, 0.878, 0.706);
            vec3 peach = vec3(0.98, 0.808, 0.667);
            vec3 col = mix(cream, gold, smoothstep(0.35, 0.85, n));
            col = mix(col, peach, smoothstep(0.62, 1.0, n2) * 0.55);

            // dark warm pocket around the hole direction
            float toHole = dot(d, normalize(uHole));
            float dark = smoothstep(0.86, 0.996, toHole);
            // faint distant stars appear inside the dark
            float star = step(0.9975, hash(floor(d*260.0))) * dark;
            vec3 deep = vec3(0.03, 0.028, 0.05) + star*vec3(0.8,0.85,1.0);
            col = mix(col, deep, dark);
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    []
  );
  const { camera } = useThree();
  useFrame((_, dt) => {
    mat.uniforms.uTime.value += dt;
    mat.uniforms.uHole.value.copy(WH).sub(camera.position).normalize();
  });
  return (
    <mesh scale={60} frustumCulled={false}>
      <sphereGeometry args={[1, 64, 64]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

/* ───────────────────────── the white hole ───────────────────────────────── */
function WhiteHole() {
  const haloRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  // central dome — soft silver, darker toward the rim so it reads as a sphere
  const sphereMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        depthWrite: true,
        uniforms: {},
        vertexShader: /* glsl */ `
          varying vec3 vN; varying vec3 vView;
          void main(){
            vec4 mv = modelViewMatrix * vec4(position,1.0);
            vN = normalize(normalMatrix * normal);
            vView = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          precision highp float; varying vec3 vN; varying vec3 vView;
          void main(){
            float f = abs(dot(normalize(vN), normalize(vView))); // 1 centre → 0 rim
            vec3 core = vec3(0.82, 0.85, 0.92);
            vec3 rim  = vec3(0.16, 0.17, 0.24);
            vec3 col = mix(rim, core, pow(f, 0.9));
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    []
  );

  // equatorial accretion disk — additive, bands stream OUTWARD
  const diskMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        uniforms: { uTime: { value: 0 }, uInner: { value: 1.15 }, uOuter: { value: 3.6 } },
        vertexShader: /* glsl */ `
          varying float vRad; varying float vAng;
          uniform float uInner; uniform float uOuter;
          void main(){
            vRad = (length(position.xy) - uInner) / (uOuter - uInner);
            vAng = atan(position.y, position.x);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          precision highp float; varying float vRad; varying float vAng; uniform float uTime;
          ${NOISE}
          void main(){
            float r = clamp(vRad, 0.0, 1.0);
            float swirl = sin(vAng*8.0 - uTime*2.0 + r*14.0);
            float turb = fbm(vec3(vAng*2.0, r*4.0 - uTime*0.4, 0.0));
            float bands = (0.5 + 0.5*swirl) * (0.55 + 0.7*turb);
            vec3 core = vec3(1.0, 0.99, 0.95);
            vec3 mid  = vec3(1.0, 0.83, 0.45);
            vec3 far  = vec3(0.99, 0.55, 0.30);
            vec3 col = mix(core, mid, smoothstep(0.0, 0.5, r));
            col = mix(col, far, smoothstep(0.5, 1.0, r));
            float edges = smoothstep(0.0,0.08,r) * smoothstep(1.0,0.7,r);
            float alpha = edges * bands;
            gl_FragColor = vec4(col * alpha * 1.9, alpha);
          }
        `,
      }),
    []
  );

  // photon ring / lensed halo — camera-facing bright annulus
  const haloMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        uniforms: { uInner: { value: 1.02 }, uOuter: { value: 1.55 } },
        vertexShader: /* glsl */ `
          varying float vRad;
          uniform float uInner; uniform float uOuter;
          void main(){
            vRad = (length(position.xy) - uInner) / (uOuter - uInner);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          precision highp float; varying float vRad;
          void main(){
            float r = clamp(vRad, 0.0, 1.0);
            // brightest at the inner edge (the photon ring), falling outward
            float a = pow(1.0 - r, 1.6);
            vec3 col = mix(vec3(1.0,0.9,0.62), vec3(1.0,0.99,0.96), 1.0 - r);
            gl_FragColor = vec4(col * a * 2.6, a);
          }
        `,
      }),
    []
  );

  useFrame((_, dt) => {
    diskMat.uniforms.uTime.value += dt;
    if (haloRef.current) haloRef.current.lookAt(camera.position);
  });

  return (
    <group position={WH}>
      <mesh renderOrder={0}>
        <sphereGeometry args={[1, 48, 48]} />
        <primitive object={sphereMat} attach="material" />
      </mesh>
      <mesh rotation={[1.36, 0, 0.22]} renderOrder={1}>
        <ringGeometry args={[1.15, 3.6, 180, 1]} />
        <primitive object={diskMat} attach="material" />
      </mesh>
      <mesh ref={haloRef} renderOrder={2}>
        <ringGeometry args={[1.02, 1.55, 128, 1]} />
        <primitive object={haloMat} attach="material" />
      </mesh>
    </group>
  );
}

/* ───────────────────────── ejected debris ───────────────────────────────── */
function Ejecta({ count = 55 }: { count?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const bits = useMemo(
    () =>
      Array.from({ length: count }, () => {
        const dir = new THREE.Vector3(
          Math.random() - 0.5,
          (Math.random() - 0.5) * 0.7,
          Math.random() - 0.5
        ).normalize();
        return {
          dir,
          dist: 2 + Math.random() * 22,
          speed: 0.6 + Math.random() * 1.6,
          rot: new THREE.Euler(Math.random() * 6.28, Math.random() * 6.28, Math.random() * 6.28),
          spin: (Math.random() - 0.5) * 0.5,
          scale: 0.05 + Math.random() * 0.16,
        };
      }),
    [count]
  );

  useFrame((_, dt) => {
    const mesh = ref.current;
    if (!mesh) return;
    for (let i = 0; i < count; i++) {
      const b = bits[i];
      b.dist += b.speed * dt;
      if (b.dist > 26) b.dist = 2;
      b.rot.x += b.spin * dt;
      b.rot.y += b.spin * 0.7 * dt;
      dummy.position.copy(WH).addScaledVector(b.dir, b.dist);
      dummy.rotation.copy(b.rot);
      dummy.scale.setScalar(b.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#c79a5e" roughness={1} metalness={0} flatShading />
    </instancedMesh>
  );
}

/* ───────────────────────── inverse lens ─────────────────────────────────── */
const lensFrag = /* glsl */ `
uniform vec2 uCenter; uniform float uAspect; uniform float uStrength; uniform float uRadius;
void mainUv(inout vec2 uv){
  vec2 p = uv - uCenter;
  p.x *= uAspect;
  float d = length(p);
  float push = uStrength / (d*d + 0.02);
  float amt = clamp(push * uRadius, 0.0, 0.4);
  vec2 dir = d > 0.0001 ? p / d : vec2(0.0);
  dir.x /= uAspect;
  uv += dir * amt;
}
`;

class WhiteLensImpl extends Effect {
  constructor() {
    super("WhiteHoleLens", lensFrag, {
      uniforms: new Map<string, THREE.Uniform>([
        ["uCenter", new THREE.Uniform(new THREE.Vector2(0.7, 0.55))],
        ["uAspect", new THREE.Uniform(1)],
        ["uStrength", new THREE.Uniform(0.02)],
        ["uRadius", new THREE.Uniform(1.0)],
      ]),
    });
  }
}

function WhiteLens() {
  const { camera, size } = useThree();
  const effect = useMemo(() => new WhiteLensImpl(), []);
  useFrame(() => {
    const v = WH.clone().project(camera);
    const uni = (effect as unknown as { uniforms: Map<string, THREE.Uniform> }).uniforms;
    (uni.get("uCenter")!.value as THREE.Vector2).set(v.x * 0.5 + 0.5, v.y * 0.5 + 0.5);
    uni.get("uAspect")!.value = size.width / size.height;
  });
  return <primitive object={effect} dispose={null} />;
}

/* ───────────────────────── rigs ─────────────────────────────────────────── */
function CameraRig() {
  const { camera } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  useFrame(() => {
    camera.position.x += (pointer.current.x * 0.5 - camera.position.x) * 0.03;
    camera.position.y += (-pointer.current.y * 0.35 - camera.position.y) * 0.03;
    camera.lookAt(0.6, 0, 0);
  });
  return null;
}

function WarpRig() {
  const { camera } = useThree();
  const warp = useRef(0);
  const baseFov = useRef<number | null>(null);
  useEffect(() => {
    const onWarp = () => {
      warp.current = 1;
    };
    window.addEventListener("kesh:warp", onWarp);
    return () => window.removeEventListener("kesh:warp", onWarp);
  }, []);
  useFrame((_, dt) => {
    const cam = camera as THREE.PerspectiveCamera;
    if (baseFov.current === null) baseFov.current = cam.fov;
    if (warp.current > 0.001) {
      warp.current = Math.max(0, warp.current - dt * 1.5);
      const e = warp.current * warp.current;
      cam.fov = baseFov.current + e * 26;
      cam.position.z = 6 + e * 1.8;
      cam.updateProjectionMatrix();
    } else if (cam.fov !== baseFov.current) {
      cam.fov = baseFov.current;
      cam.updateProjectionMatrix();
    }
  });
  return null;
}

/* ───────────────────────── scene ───────────────────────────────────────── */
export default function WhiteHoleGL() {
  useEffect(() => {
    const kick = () => window.dispatchEvent(new Event("resize"));
    const r = requestAnimationFrame(kick);
    const t1 = setTimeout(kick, 120);
    const t2 = setTimeout(kick, 400);
    return () => {
      cancelAnimationFrame(r);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <>
      <Canvas
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 6], fov: 55 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -10,
          pointerEvents: "none",
        }}
      >
        <color attach="background" args={["#fff6e8"]} />
        <ambientLight intensity={1.1} />
        <pointLight position={WH} intensity={120} distance={70} decay={2} color="#fff2d0" />
        <Sky />
        <Ejecta />
        <WhiteHole />
        <CameraRig />
        <WarpRig />
        <EffectComposer>
          <WhiteLens />
          <Bloom intensity={0.85} luminanceThreshold={0.72} luminanceSmoothing={0.35} radius={0.8} mipmapBlur />
        </EffectComposer>
      </Canvas>

      {/* readability wash — kept off the right so it doesn't grey the hole */}
      <div
        className="pointer-events-none fixed inset-0 -z-[9]"
        style={{
          background:
            "radial-gradient(115% 90% at 8% 40%, rgba(255,248,235,0.5), transparent 55%)",
        }}
      />
    </>
  );
}
