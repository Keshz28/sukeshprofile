"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * LIGHT MODE — THE WHITE HOLE (Gargantua silhouette, screen-space).
 *
 * Drawn directly in 2-D rather than raymarched: a dark shadow, a crisp photon
 * ring, thick lensed arcs top & bottom (the disk wrapping over/under), and the
 * accretion disk streaking horizontally through — the iconic Ø shape. Every
 * feature is an explicit function of distance/angle from the hole centre, so
 * the result is fully predictable and cheap. Composited so the bright hole sits
 * in a soft dark pocket on the right while the cream page shows everywhere else.
 */

const FRAG = /* glsl */ `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;
uniform float uWarp;

float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
             mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
}
float fbm(vec2 p){ float v=0.0,a=0.5; for(int i=0;i<4;i++){ v+=a*noise(p); p*=2.03; a*=0.5; } return v; }

void main(){
  vec2 fc = gl_FragCoord.xy;
  vec2 center = vec2(0.70*uRes.x, 0.47*uRes.y) + uPointer*vec2(20.0,15.0);
  float R = 0.27 * uRes.y * (1.0 + uWarp*0.6);

  vec2 q = (fc - center) / R;
  float r = length(q);
  float ang = atan(q.y, q.x);

  // dark shadow inside the ring
  float shadow = smoothstep(1.00, 0.85, r);

  // crisp photon ring hugging the shadow
  float ring = exp(-pow((r - 1.0)/0.085, 2.0));

  // lensed disk halo — brighter at top & bottom, where the disk wraps over/under
  float tb = abs(sin(ang));
  float halo = exp(-pow((r - 1.34)/0.44, 2.0)) * (0.4 + 1.0*tb);

  // accretion disk seen edge-on: a thin horizontal streak crossing through,
  // extending well past the ring, with relativistic beaming on one side
  float turb = 0.55 + 0.6*fbm(q*2.6 + vec2(uTime*0.12, ang));
  float band = exp(-pow(q.y/0.12, 2.0)) * smoothstep(3.4, 0.9, r) * smoothstep(0.55, 1.0, r);
  float dopp = 0.4 + 0.9*clamp(-cos(ang), 0.0, 1.0);
  band *= (0.35 + dopp) * turb;

  float emit = ring*2.4 + halo*1.15 + band*1.6;

  // silver-white, hottest at the ring
  vec3 col = mix(vec3(0.70,0.82,1.0), vec3(1.0), clamp(emit*0.55, 0.0, 1.0)) * emit;
  col = col / (col + 0.85) * 1.85;              // soft tone-map

  // faint stars in the dark pocket
  float st = smoothstep(0.9983, 1.0, hash(floor(fc*0.22)));
  col += vec3(st) * smoothstep(1.15, 2.6, r) * 0.55;

  // composite: a soft dark stage disc around the hole; bright ring writes its
  // own alpha, everything else stays clear so the cream page shows through
  float dStage = distance(fc, center) / uRes.y;
  float base = smoothstep(0.52, 0.18, dStage);
  float lum = dot(col, vec3(0.33));
  float alpha = clamp(max(base, lum*2.2), 0.0, 1.0);

  gl_FragColor = vec4(col, alpha);
}
`;

const VERT = /* glsl */ `void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }`;

function Gargantua() {
  const { size } = useThree();
  const pointer = useRef(new THREE.Vector2(0, 0));
  const warp = useRef(0);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uRes: { value: new THREE.Vector2(1, 1) },
          uTime: { value: 0 },
          uPointer: { value: new THREE.Vector2(0, 0) },
          uWarp: { value: 0 },
        },
        vertexShader: VERT,
        fragmentShader: FRAG,
      }),
    []
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.set(
        (e.clientX / window.innerWidth - 0.5) * 2,
        -(e.clientY / window.innerHeight - 0.5) * 2
      );
    };
    const onWarp = () => {
      warp.current = 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("kesh:warp", onWarp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("kesh:warp", onWarp);
    };
  }, []);

  useFrame((_, dt) => {
    mat.uniforms.uTime.value += dt;
    mat.uniforms.uRes.value.set(size.width, size.height);
    (mat.uniforms.uPointer.value as THREE.Vector2).lerp(pointer.current, 0.05);
    warp.current = Math.max(0, warp.current - dt * 1.6);
    mat.uniforms.uWarp.value = warp.current * warp.current;
  });

  return (
    <mesh frustumCulled={false} renderOrder={-100}>
      <planeGeometry args={[2, 2]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

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
    <Canvas
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
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
      <Gargantua />
    </Canvas>
  );
}
