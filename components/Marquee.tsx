const ITEMS = [
  "Full-Stack Dev",
  "UI/UX Design",
  "XR / VR",
  "Creative Media",
  "Copywriting",
  "Public Speaking",
];

function Track() {
  return (
    <span className="inline-flex items-center">
      {ITEMS.map((item, i) => (
        <span key={item} className="inline-flex items-center">
          {/* alternate solid / hollow for editorial rhythm */}
          <span className={i % 2 ? "text-stroke" : undefined}>{item}</span>
          <span className="mx-10 text-[0.6em] text-blue-glow/80">✦</span>
        </span>
      ))}
    </span>
  );
}

export default function Marquee() {
  return (
    <div className="relative z-[5] -my-2 -rotate-[1.3deg] scale-[1.01]">
      <div className="overflow-hidden whitespace-nowrap border-y border-white/10 bg-[var(--band)] py-6 backdrop-blur-sm">
        <div className="inline-block animate-marquee font-display text-[clamp(2rem,5vw,4rem)] font-bold uppercase tracking-[-0.01em] text-white/[0.92]">
          {/* duplicated track → seamless -50% loop */}
          <Track />
          <Track />
        </div>
      </div>
    </div>
  );
}
