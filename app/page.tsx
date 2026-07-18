import SceneManager from "@/components/ui/SceneManager";
import BootSequence from "@/components/ui/BootSequence";
import WarpFlash from "@/components/ui/WarpFlash";
import SmoothScroll from "@/components/ui/SmoothScroll";
import PointerFX from "@/components/ui/PointerFX";
import Grain from "@/components/ui/Grain";
import SectionCounter from "@/components/ui/SectionCounter";
import ScrollProgress from "@/components/ScrollProgress";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Skills from "@/components/Skills";
import AiWorkflow from "@/components/AiWorkflow";
import Projects from "@/components/Projects";
import Certifications from "@/components/Certifications";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      {/* boot sequence — plays once per session, above everything */}
      <BootSequence />

      {/* momentum smooth-scroll + GSAP ticker bridge */}
      <SmoothScroll />

      {/* fixed background + overlay stack (theme-aware: space ↔ sun) */}
      <SceneManager />
      <PointerFX />
      <Grain />
      <WarpFlash />
      <ScrollProgress />
      <SectionCounter />

      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Skills />
        <AiWorkflow />
        <Projects />
        <Certifications />
        <Contact />
      </main>
    </>
  );
}
