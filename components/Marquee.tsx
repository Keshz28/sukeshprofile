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
      {ITEMS.map((item) => (
        <span key={item} className="inline-flex items-center">
          {item}
          <span className="mx-8 text-blue-glow/80">✦</span>
        </span>
      ))}
    </span>
  );
}

export default function Marquee() {
  return (
    <div className="relative z-[5] overflow-hidden whitespace-nowrap border-y border-white/10 bg-[rgba(2,5,16,0.35)] py-5">
      <div className="inline-block animate-marquee font-display text-[clamp(1.6rem,4vw,3.2rem)] font-semibold text-white/[0.92]">
        {/* duplicated track → seamless -50% loop */}
        <Track />
        <Track />
      </div>
    </div>
  );
}
