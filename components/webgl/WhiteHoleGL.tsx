"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * LIGHT MODE — THE WHITE HOLE, raymarched at full scale.
 *
 * This is the immersive edge-on composition (the one that read as "large and
 * dangerous"): the lensed disk sweeps across the right side of the viewport,
 * bending over and under the shadow. Two artifacts from that version are
 * fixed surgically:
 *   · the vertical seam — the disk's turbulence sampled raw atan() angle,
 *     which jumps at ±π; noise now samples periodic (cos,sin) space instead
 *   · ring-shaped banding — steps were too coarse near the hole, quantising
 *     the plane crossings into circles; steps are finer close in
 * And the physics reads as a WHITE hole: band phases drift outward, so the
 * disk visibly ejects matter instead of swallowing it.
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

// silver-white → pale blue, like the reference stills
vec3 diskColor(float t){
  vec3 hot  = vec3(1.00, 1.00, 0.99);
  vec3 mid  = vec3(0.88, 0.93, 1.00);
  vec3 cool = vec3(0.62, 0.75, 0.98);
  return mix(hot, mix(mid, cool, t), t);
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*uRes) / uRes.y;
  uv.x -= 0.26;

  // nearly edge-on, just above the disk plane — the immersive framing
  vec3 ro = vec3(uPointer.x*0.7, 1.5 + uPointer.y*0.5, -17.0);
  vec3 ta = vec3(0.0);
  vec3 ww = normalize(ta - ro);
  vec3 uu = normalize(cross(vec3(0.0,1.0,0.0), ww));
  vec3 vv = cross(ww, uu);
  float fov = 1.7 + uWarp*0.8;
  vec3 rd = normalize(uv.x*uu + uv.y*vv + fov*ww);

  const float Rs  = 1.7;    // event horizon
  const float dIn = 2.9;    // disk inner edge
  const float dOut= 11.5;   // disk outer edge
  const float G   = 5.2;    // lensing strength

  vec3 pos = ro;
  vec3 dir = rd;
  vec3 acc = vec3(0.0);
  float transmit = 1.0;
  float minR = 1e9;
  bool captured = false;

  for(int i=0;i<130;i++){
    float r = length(pos);
    minR = min(minR, r);
    dir = normalize(dir - pos * (G / (r*r*r)) * 0.34);
    // fine steps near the hole (kills ring banding), coarser far away
    float step = 0.16 + r*0.05;
    vec3 npos = pos + dir*step;

    // disk lives in y = 0
    if(pos.y * npos.y < 0.0){
      float f = pos.y / (pos.y - npos.y);
      vec3 hit = mix(pos, npos, f);
      float hr = length(hit.xz);
      if(hr > dIn && hr < dOut){
        float t = (hr - dIn) / (dOut - dIn);
        float ang = atan(hit.z, hit.x);
        vec2 cs = vec2(cos(ang), sin(ang));            // periodic — no seam
        // spiral bands whose phase moves OUTWARD: ejection, not accretion
        float spir = 0.5 + 0.5*sin(ang*3.0 + hr*1.1 - uTime*1.6);
        // turbulence in periodic space, drifting outward too
        float turb = fbm(cs*2.3 + vec2(hr*0.9 - uTime*0.45, hr*0.7 - uTime*0.3));
        float dopp = 0.45 + 0.9*clamp(cos(ang - 1.1), 0.0, 1.0);
        float bright = (0.35 + 0.9*spir) * (0.45 + 0.95*turb) * dopp;
        float dens = smoothstep(0.0, 0.06, t) * smoothstep(1.0, 0.7, t);
        acc += transmit * diskColor(t) * bright * dens * 1.6;
        transmit *= (1.0 - dens*0.55);
      }
    }

    pos = npos;
    r = length(pos);
    if(r < Rs){ captured = true; break; }
    if(r > 70.0) break;
  }

  vec3 col = acc;

  // photon ring — rays grazing the horizon blaze into a thin Einstein ring
  float photon = smoothstep(Rs*2.1, Rs*1.35, minR) * smoothstep(Rs*0.95, Rs*1.3, minR);
  col += vec3(0.92, 0.96, 1.0) * photon * 2.2;

  // stars where the ray escaped to the sky
  if(!captured){
    vec3 dn = normalize(dir);
    float s = smoothstep(0.9975, 1.0, hash(floor(dn.xy*420.0)));
    col += transmit * vec3(s);
  }

  col = col / (col + vec3(0.9)) * 1.9;   // soft tone-map, blooms to white

  // composite: cream page on the left, deep space stage on the right
  float sx = gl_FragCoord.x / uRes.x;
  float base = smoothstep(0.16, 0.44, sx);
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
      dpr={0.72}
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
