"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Effect } from "postprocessing";
import * as THREE from "three";

/* ───────────────────────── black-hole position (tweakable) ──────────────── */
const BH = new THREE.Vector3(2.4, 0.55, -1);

/* ───────────────────────── shared noise GLSL ────────────────────────────── */
const NOISE = /* glsl */ `
float hash(vec3 p){ p=fract(p*0.3183099+0.1); p*=17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float noise(vec3 x){ vec3 i=floor(x); vec3 f=fract(x); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(hash(i+vec3(0,0,0)),hash(i+vec3(1,0,0)),f.x),
                 mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),
                 mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z); }
float fbm(vec3 p){ float v=0.0,a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.02; a*=0.5;} return v; }
`;

/* ───────────────────────── nebula sky sphere (W2) ───────────────────────── */
function Nebula() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: { uTime: { value: 0 } },
        vertexShader: /* glsl */ `
          varying vec3 vDir;
          void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
        `,
        fragmentShader: /* glsl */ `
          precision highp float;
          varying vec3 vDir; uniform float uTime;
          ${NOISE}
          void main(){
            vec3 d = normalize(vDir);
            float t = uTime*0.02;
            float n  = fbm(d*2.1 + vec3(t, t*0.5, 0.0));
            float n2 = fbm(d*4.7 - vec3(0.0, t*0.7, t));
            float clouds = smoothstep(0.42, 0.95, n)*0.85 + n2*0.15;
            vec3 c1 = vec3(0.03,0.05,0.18);   // deep blue
            vec3 c2 = vec3(0.24,0.09,0.42);   // violet
            vec3 c3 = vec3(0.55,0.12,0.34);   // magenta/pink
            vec3 col = mix(c1, c2, n);
            col = mix(col, c3, smoothstep(0.55,1.0,n2));
            col *= clouds;
            col += vec3(0.008,0.01,0.028);    // faint base
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    []
  );
  useFrame((_, dt) => {
    mat.uniforms.uTime.value += dt;
  });
  return (
    <mesh scale={60} frustumCulled={false}>
      <sphereGeometry args={[1, 64, 64]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

/* ───────────────────────── black hole (W1) ──────────────────────────────── */
function BlackHole() {
  const diskMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        uniforms: { uTime: { value: 0 }, uInner: { value: 1.25 }, uOuter: { value: 3.4 } },
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
          precision highp float;
          varying float vRad; varying float vAng; uniform float uTime;
          void main(){
            float r = clamp(vRad, 0.0, 1.0);
            float swirl = sin(vAng*7.0 + uTime*2.2 - r*12.0);
            float bands = 0.55 + 0.45*swirl;
            float doppler = 0.35 + 0.65*pow(0.5+0.5*cos(vAng-0.7), 2.0); // one side brighter
            vec3 cool = vec3(0.95,0.22,0.38);
            vec3 mid  = vec3(1.0,0.55,0.2);
            vec3 hot  = vec3(1.0,0.96,0.86);
            vec3 col = mix(cool, mid, r);
            col = mix(col, hot, smoothstep(0.4,0.0,r));
            float edges = smoothstep(0.0,0.12,r) * smoothstep(1.0,0.8,r);
            float alpha = edges * bands * doppler;
            gl_FragColor = vec4(col * alpha * 1.7, alpha);
          }
        `,
      }),
    []
  );

  const rimMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uColor: { value: new THREE.Color(0.6, 0.8, 1.0) } },
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
          precision highp float;
          varying vec3 vN; varying vec3 vView; uniform vec3 uColor;
          void main(){
            float f = pow(1.0 - abs(dot(normalize(vN), normalize(vView))), 3.5);
            gl_FragColor = vec4(uColor * f * 2.4, f);
          }
        `,
      }),
    []
  );

  useFrame((_, dt) => {
    diskMat.uniforms.uTime.value += dt;
  });

  return (
    <group position={BH}>
      {/* event horizon — opaque black silhouette (occludes the disk behind it) */}
      <mesh>
        <sphereGeometry args={[1, 48, 48]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* photon-ring rim glow */}
      <mesh scale={1.08}>
        <sphereGeometry args={[1, 48, 48]} />
        <primitive object={rimMat} attach="material" />
      </mesh>
      {/* accretion disk, tilted near edge-on */}
      <mesh rotation={[1.32, 0, 0.25]}>
        <ringGeometry args={[1.25, 3.4, 160, 1]} />
        <primitive object={diskMat} attach="material" />
      </mesh>
    </group>
  );
}

/* ───────────────────────── supernova bursts (W4) ────────────────────────── */
function Supernova() {
  const ref = useRef<THREE.Mesh>(null);
  const state = useRef({ next: 8, life: 0, dur: 2.6 });
  const clock = useRef(0);

  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(0.8, 0.9, 1.0),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  useFrame((_, dt) => {
    clock.current += dt;
    const s = state.current;
    const m = ref.current;
    if (!m) return;

    if (s.life <= 0 && clock.current > s.next) {
      // spawn a new burst at a random far point
      const dir = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 1.4,
        -Math.random() * 2 - 0.5
      ).normalize();
      m.position.copy(dir.multiplyScalar(14 + Math.random() * 10));
      s.life = s.dur;
    }

    if (s.life > 0) {
      s.life -= dt;
      const p = 1 - s.life / s.dur; // 0→1
      // gentle, far-off flare: eases in and out instead of popping
      const scale = 0.15 + p * p * 3.2;
      m.scale.setScalar(scale);
      mat.opacity = Math.sin(p * Math.PI) ** 2 * 0.32;
      if (s.life <= 0) {
        mat.opacity = 0;
        s.next = clock.current + 16 + Math.random() * 16;
      }
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, -20]}>
      <sphereGeometry args={[1, 24, 24]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

/* ───────────────────────── warp jump (TR1) ──────────────────────────────── */
// Listens for `kesh:warp` and briefly widens the FOV + kicks the camera back,
// so navigating to a section reads as a short hyperspace lurch.
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

/* ───────────────────────── camera parallax rig ──────────────────────────── */
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

/* ───────────────────────── gravitational lens post-effect (W1) ──────────── */
const lensFrag = /* glsl */ `
uniform vec2 uCenter; uniform float uAspect; uniform float uStrength; uniform float uRadius;
void mainUv(inout vec2 uv){
  vec2 p = uv - uCenter;
  p.x *= uAspect;
  float d = length(p);
  float pull = uStrength / (d*d + 0.02);
  float amt = clamp(pull * uRadius, 0.0, 0.45);
  vec2 dir = d > 0.0001 ? p / d : vec2(0.0);
  dir.x /= uAspect;
  uv -= dir * amt;
}
`;

class LensEffectImpl extends Effect {
  constructor() {
    super("BlackHoleLens", lensFrag, {
      uniforms: new Map<string, THREE.Uniform>([
        ["uCenter", new THREE.Uniform(new THREE.Vector2(0.7, 0.55))],
        ["uAspect", new THREE.Uniform(1)],
        ["uStrength", new THREE.Uniform(0.028)],
        ["uRadius", new THREE.Uniform(1.0)],
      ]),
    });
  }
}

function LensEffect() {
  const { camera, size } = useThree();
  const effect = useMemo(() => new LensEffectImpl(), []);
  useFrame(() => {
    const v = BH.clone().project(camera);
    const uni = (effect as unknown as { uniforms: Map<string, THREE.Uniform> })
      .uniforms;
    (uni.get("uCenter")!.value as THREE.Vector2).set(
      v.x * 0.5 + 0.5,
      v.y * 0.5 + 0.5
    );
    uni.get("uAspect")!.value = size.width / size.height;
  });
  return <primitive object={effect} dispose={null} />;
}

/* ───────────────────────── the scene ────────────────────────────────────── */
export default function SpaceGL() {
  // R3F's ResizeObserver can latch onto a 0×0 measurement on mount and stay
  // "stuck" at the default 300×150 until a resize fires. Kick it a few times
  // after mount so the canvas picks up the real viewport size.
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
      {/* Explicit viewport-unit sizing on the Canvas container so R3F's
          measure resolves immediately (percentage height can measure 0). */}
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
        <color attach="background" args={["#05060a"]} />
        <Nebula />
        <Stars radius={90} depth={60} count={5000} factor={4} saturation={0} fade speed={0.5} />
        <BlackHole />
        <Supernova />
        <CameraRig />
        <WarpRig />
        <EffectComposer>
          <LensEffect />
          <Bloom
            intensity={0.9}
            luminanceThreshold={0.22}
            luminanceSmoothing={0.35}
            radius={0.75}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
      {/* legibility wash over the WebGL so text stays readable */}
      <div
        className="pointer-events-none fixed inset-0 -z-[9]"
        style={{
          background:
            "linear-gradient(180deg, rgba(2,5,16,0.34), rgba(2,5,16,0.62)), radial-gradient(120% 90% at 15% 30%, rgba(2,5,16,0.5), transparent 55%)",
        }}
      />
    </>
  );
}
