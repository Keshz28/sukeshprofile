"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * LIGHT MODE — THE WHITE HOLE, raymarched (real gravitational lensing).
 *
 * A single flat accretion disk sits in the equatorial plane. For every pixel a
 * ray is cast and BENT toward the mass each step (an approximate photon
 * geodesic); wherever the bent ray crosses the disk plane it accumulates
 * emission. Because the ray curves, the far side of the disk is lifted up and
 * over the black sphere and the underside wraps below — producing the iconic
 * Gargantua ring, which flat geometry can never fake.
 *
 * It renders on a fullscreen quad (camera-independent) and composites with a
 * transparent left edge, so the cream page shows through where the text lives
 * while the brilliant ring blazes against deep space on the right.
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

// disk emission colour by normalised radius (0 inner/hot → 1 outer/cool)
vec3 diskColor(float t){
  vec3 hot  = vec3(1.00, 0.99, 0.96);
  vec3 mid  = vec3(0.86, 0.90, 1.00);
  vec3 cool = vec3(0.55, 0.70, 0.98);
  return mix(hot, mix(mid, cool, t), t);
}

void main(){
  // aspect-correct coords, hole pushed to the right of the viewport
  vec2 uv = (gl_FragCoord.xy - 0.5*uRes) / uRes.y;
  uv.x -= 0.26;

  // virtual camera — pulled back so the whole hole is a contained object,
  // nearly edge-on with a slight tilt above the disk plane
  vec3 ro = vec3(uPointer.x*0.6, 3.0 + uPointer.y*0.4, -30.0);
  vec3 ta = vec3(0.0, 0.0, 0.0);
  vec3 ww = normalize(ta - ro);
  vec3 uu = normalize(cross(vec3(0.0,1.0,0.0), ww));
  vec3 vv = cross(ww, uu);
  float fov = 1.7 + uWarp*0.8;                 // warp jump widens/streaks
  vec3 rd = normalize(uv.x*uu + uv.y*vv + fov*ww);

  const float Rs = 1.7;      // event-horizon radius
  const float dIn = 2.6;     // disk inner
  const float dOut = 8.5;    // disk outer
  const float G = 5.2;       // lensing strength

  vec3 pos = ro;
  vec3 dir = rd;
  vec3 acc = vec3(0.0);
  float transmit = 1.0;
  float minR = 1e9;
  bool captured = false;

  for(int i=0;i<100;i++){
    float r = length(pos);
    minR = min(minR, r);
    // bend the ray toward the hole (∝ 1/r²), stronger up close
    dir = normalize(dir - pos * (G / (r*r*r)) * 0.34);
    float step = 0.34 + r*0.05;                // coarser far away → cheaper
    vec3 npos = pos + dir*step;

    // accretion disk lives in the y = 0 plane
    if(pos.y * npos.y < 0.0){
      float f = pos.y / (pos.y - npos.y);
      vec3 hit = mix(pos, npos, f);
      float hr = length(hit.xz);
      if(hr > dIn && hr < dOut){
        float t = (hr - dIn) / (dOut - dIn);
        float ang = atan(hit.z, hit.x);
        float spir = 0.5 + 0.5*sin(ang*3.0 - uTime*1.1 + hr*0.9);
        float turb = fbm(vec2(ang*2.2, hr*1.3 - uTime*0.25));
        float dopp = 0.45 + 0.9*clamp(cos(ang - 1.1), 0.0, 1.0); // relativistic beaming
        float bright = (0.35 + 0.9*spir) * (0.5 + 0.9*turb) * dopp;
        float dens = smoothstep(0.0, 0.06, t) * smoothstep(1.0, 0.7, t);
        acc += transmit * diskColor(t) * bright * dens * 1.5;
        transmit *= (1.0 - dens*0.55);
      }
    }

    pos = npos;
    r = length(pos);
    if(r < Rs){ captured = true; break; }
    if(r > 70.0) break;
  }

  // deep-space background + faint stars where the ray escaped
  vec3 col = acc;
  if(!captured){
    vec3 dn = normalize(dir);
    float s = smoothstep(0.9975, 1.0, hash(floor(dn.xy*420.0)));
    col += transmit * vec3(s);
  }

  // photon ring — rays that grazed close to the horizon glow into a thin,
  // brilliant Einstein ring wrapping the shadow
  float photon = smoothstep(Rs*2.2, Rs*1.35, minR) * smoothstep(Rs*0.9, Rs*1.35, minR);
  col += vec3(0.85, 0.92, 1.0) * photon * 2.6;

  // gentle tone-map so the ring blooms to white without clipping harshly
  col = col / (col + vec3(0.9)) * 1.9;

  // composite: a soft dark disc around the hole is the only opaque region, so
  // the cream page (and the navbar / text everywhere else) shows through. The
  // bright ring itself always writes alpha via its luminance.
  vec2 sc = gl_FragCoord.xy / uRes;
  float dHole = distance(sc, vec2(0.70, 0.48));
  float base = smoothstep(0.62, 0.24, dHole);   // opaque near the hole → clear at edges
  float lum = dot(col, vec3(0.33));
  float alpha = clamp(max(base, lum*2.4), 0.0, 1.0);

  gl_FragColor = vec4(col, alpha);
}
`;

const VERT = /* glsl */ `
void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

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
    const p = mat.uniforms.uPointer.value as THREE.Vector2;
    p.lerp(pointer.current, 0.05);
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
      dpr={0.7}
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
