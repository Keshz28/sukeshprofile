import AnimatedBackground from "@/components/ui/AnimatedBackground";
import Starfield from "@/components/ui/Starfield";
import PointerFX from "@/components/ui/PointerFX";
import Grain from "@/components/ui/Grain";
import SectionCounter from "@/components/ui/SectionCounter";
import ScrollProgress from "@/components/ScrollProgress";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Certifications from "@/components/Certifications";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      {/* fixed background + overlay stack */}
      <AnimatedBackground />
      <Starfield />
      <PointerFX />
      <Grain />
      <ScrollProgress />
      <SectionCounter />

      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Skills />
        <Projects />
        <Certifications />
        <Contact />
      </main>
    </>
  );
}
