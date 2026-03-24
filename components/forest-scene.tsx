"use client";

import { useEffect, useState } from "react";
import type { TreeKey, TreeState } from "@/lib/types";

type Palette = {
  leaf1: string;
  leaf2: string;
  leaf3: string;
  leaf4: string;
  trunk: string;
  glow: string;
  grass1: string;
  grass2: string;
};

const POSITIONS = [
  { left: "33%", top: "77%" },
  { left: "39%", top: "79%" },
  { left: "45%", top: "73%" },
  { left: "50%", top: "81%" },
  { left: "55%", top: "73%" },
  { left: "61%", top: "79%" },
  { left: "67%", top: "77%" },
];

const PALETTES: Record<TreeKey, Palette> = {
  golden: {
    leaf1: "bg-amber-300/95",
    leaf2: "bg-yellow-200/95",
    leaf3: "bg-orange-200/90",
    leaf4: "bg-amber-500/80",
    trunk: "bg-[linear-gradient(to_top,_#71462a,_#9a623a,_#bf8854)]",
    glow: "bg-amber-100/35",
    grass1: "bg-lime-800/60",
    grass2: "bg-amber-700/60",
  },
  willow: {
    leaf1: "bg-emerald-700/90",
    leaf2: "bg-emerald-500/90",
    leaf3: "bg-teal-300/85",
    leaf4: "bg-emerald-900/70",
    trunk: "bg-[linear-gradient(to_top,_#5f3d26,_#7f5534,_#9b6a43)]",
    glow: "bg-emerald-100/25",
    grass1: "bg-emerald-900/60",
    grass2: "bg-teal-700/60",
  },
  blossom: {
    leaf1: "bg-pink-300/95",
    leaf2: "bg-rose-200/95",
    leaf3: "bg-fuchsia-100/95",
    leaf4: "bg-pink-400/80",
    trunk: "bg-[linear-gradient(to_top,_#68452d,_#8b6448,_#a87f62)]",
    glow: "bg-pink-100/35",
    grass1: "bg-emerald-800/55",
    grass2: "bg-pink-300/50",
  },
  moon: {
    leaf1: "bg-cyan-200/90",
    leaf2: "bg-sky-100/95",
    leaf3: "bg-blue-50/95",
    leaf4: "bg-cyan-300/75",
    trunk: "bg-[linear-gradient(to_top,_#5e4638,_#7b6357,_#a1887d)]",
    glow: "bg-cyan-50/35",
    grass1: "bg-sky-900/55",
    grass2: "bg-cyan-200/45",
  },
  oak: {
    leaf1: "bg-lime-700/90",
    leaf2: "bg-green-600/95",
    leaf3: "bg-lime-500/90",
    leaf4: "bg-green-900/70",
    trunk: "bg-[linear-gradient(to_top,_#5a3a23,_#7b4d2d,_#97613b)]",
    glow: "bg-lime-100/20",
    grass1: "bg-emerald-800/60",
    grass2: "bg-lime-700/50",
  },
  firefly: {
    leaf1: "bg-emerald-400/90",
    leaf2: "bg-yellow-200/95",
    leaf3: "bg-lime-200/90",
    leaf4: "bg-emerald-800/70",
    trunk: "bg-[linear-gradient(to_top,_#604028,_#7f5836,_#a57447)]",
    glow: "bg-yellow-100/30",
    grass1: "bg-emerald-900/60",
    grass2: "bg-yellow-300/45",
  },
  silver: {
    leaf1: "bg-slate-200/95",
    leaf2: "bg-zinc-100/95",
    leaf3: "bg-white/95",
    leaf4: "bg-slate-300/80",
    trunk: "bg-[linear-gradient(to_top,_#645246,_#887467,_#ab998d)]",
    glow: "bg-white/35",
    grass1: "bg-slate-700/55",
    grass2: "bg-white/35",
  },
};

const DAY_BIRDS = [
  ["7%", "scale-125", "-rotate-1", "opacity-85", "-14s", "19s", "high"],
  ["8%", "scale-110", "rotate-6", "opacity-75", "0s", "20s", "high"],
  ["10%", "scale-95", "rotate-3", "opacity-70", "-16s", "22s", "high"],
  ["11%", "scale-90", "-rotate-3", "opacity-70", "-3s", "24s", "high"],
  ["13%", "scale-75", "rotate-2", "opacity-60", "-7s", "23s", "high"],
  ["15%", "scale-80", "-rotate-6", "opacity-60", "-13s", "26s", "mid"],
  ["17%", "scale-70", "rotate-1", "opacity-55", "-5s", "25s", "mid"],
  ["18%", "scale-60", "rotate-5", "opacity-45", "-18s", "29s", "mid"],
  ["41%", "scale-95", "-rotate-2", "opacity-65", "-8s", "18s", "low"],
  ["47%", "scale-110", "rotate-4", "opacity-72", "-2s", "17s", "low"],
  ["52%", "scale-85", "-rotate-5", "opacity-58", "-11s", "16s", "low"],
  ["58%", "scale-70", "rotate-3", "opacity-50", "-15s", "19s", "low"],
].map(([top, scale, rotate, opacity, delay, duration, depth]) => ({
  top,
  scale,
  rotate,
  opacity,
  delay,
  duration,
  depth,
}));

const BAT_GROUPS = [
  ["58%", "-8s", "20s", "scale-95", "opacity-68"],
  ["66%", "-2s", "18s", "scale-105", "opacity-66"],
  ["74%", "-12s", "19s", "scale-85", "opacity-54"],
].map(([top, delay, duration, scale, opacity]) => ({
  top,
  delay,
  duration,
  scale,
  opacity,
}));

export function ForestScene({
  trees,
  admin = false,
}: {
  trees: TreeState[];
  admin?: boolean;
}) {
  const [cyclePhase, setCyclePhase] = useState(0.25);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6f0de] text-slate-800">
      <SkyLighting cyclePhase={cyclePhase} />

      <div className="absolute inset-0 overflow-hidden">
        <SkySunMoon onPhaseChange={setCyclePhase} />
        <SkyBirdsAndBats cyclePhase={cyclePhase} />
        <div className="absolute -top-16 left-[-10%] h-64 w-64 rounded-full bg-white/35 blur-3xl" />
        <div className="absolute top-24 right-[10%] h-40 w-40 rounded-full bg-yellow-100/70 blur-2xl" />
        <div className="absolute bottom-0 left-0 right-0 h-[34%] bg-[linear-gradient(to_top,_rgba(58,89,67,0.95),_rgba(103,145,96,0.8)_30%,_rgba(165,196,134,0.18)_70%,_transparent)]" />
        <ForestFloor />
        <div className="absolute left-[7%] top-[20%] h-24 w-52 rounded-full bg-emerald-950/10 blur-3xl" />
        <div className="absolute left-[38%] top-[14%] h-24 w-64 rounded-full bg-emerald-950/10 blur-3xl" />
        <div className="absolute right-[6%] top-[22%] h-28 w-56 rounded-full bg-emerald-950/10 blur-3xl" />
      </div>

      <div className={`relative z-10 min-h-screen ${admin ? "pr-[340px]" : ""}`}>
        {trees.map((tree, index) => (
          <div
            key={tree.tree_key}
            className="absolute"
            style={{
              left: POSITIONS[index].left,
              top: POSITIONS[index].top,
              transform: "translate(-50%, -50%)",
            }}
          >
            <ForestSpot stage={tree.stage} variant={tree.tree_key} />
          </div>
        ))}
      </div>
    </div>
  );
}

function SkyLighting({ cyclePhase }: { cyclePhase: number }) {
  const blend = (v: number, a: number, b: number) =>
    Math.min(1, Math.max(0, (v - a) / (b - a)));

  const sunrise = 1 - blend(cyclePhase, 0.12, 0.3);
  const sunset = blend(cyclePhase, 0.32, 0.52);
  const night = blend(cyclePhase, 0.38, 0.62);
  const moonHigh = Math.max(0, 1 - Math.abs(cyclePhase - 0.75) / 0.2);
  const midnight = Math.max(0, 1 - Math.abs(cyclePhase - 0.75) / 0.12);
  const preDawn = blend(cyclePhase, 0.76, 0.98);
  const day = Math.max(0, 1 - night);

  const top = [
    Math.round(255 * day + 22 * night - 78 * sunset + 18 * preDawn),
    Math.round(228 * day + 26 * night - 92 * sunset + 16 * preDawn),
    Math.round(180 * day + 96 * night - 34 * sunset + 62 * preDawn),
  ];
  const mid = [
    Math.round(244 * day + 44 * night - 78 * sunset + 12 * preDawn),
    Math.round(214 * day + 52 * night - 96 * sunset + 18 * preDawn),
    Math.round(188 * day + 166 * night + 24 * moonHigh - 24 * sunset + 54 * preDawn),
  ];
  const low = [
    Math.round(122 * day + 18 * night - 34 * sunset),
    Math.round(172 * day + 34 * night - 54 * sunset),
    Math.round(126 * day + 104 * night + 18 * moonHigh - 26 * sunset),
  ];

  return (
    <>
      <div
        className="absolute inset-0 transition-all duration-[3500ms]"
        style={{
          background: `linear-gradient(to bottom,rgb(${top.join(",")}) 0%,rgb(${mid.join(
            ","
          )}) 24%,rgb(${Math.round((mid[0] + low[0]) / 2)},${Math.round(
            (mid[1] + low[1]) / 2
          )},${Math.round((mid[2] + low[2]) / 2)}) 56%,rgb(${low.join(
            ","
          )}) 82%,rgb(${Math.round(low[0] * 0.62)},${Math.round(
            low[1] * 0.62
          )},${Math.round(low[2] * 0.7)}) 100%)`,
        }}
      />
      <div
        className="absolute inset-0 transition-all duration-[3500ms]"
        style={{
          background: `radial-gradient(circle at 16% 80%, rgba(255,188,118,${
            0.62 * sunrise
          }), transparent 34%), radial-gradient(circle at 50% 11%, rgba(255,248,220,${
            0.16 + 0.34 * day
          }), transparent 28%), radial-gradient(circle at 82% 78%, rgba(255,112,72,${
            0.82 * sunset
          }), transparent 35%), radial-gradient(circle at 22% 22%, rgba(168,122,255,${
            0.26 * night
          }), transparent 24%), radial-gradient(circle at 78% 18%, rgba(88,196,255,${
            0.26 * moonHigh
          }), transparent 24%), radial-gradient(circle at 54% 16%, rgba(220,238,255,${
            0.12 + 0.24 * night
          }), transparent 24%)`,
        }}
      />
      <div
        className="absolute inset-0 transition-all duration-[3500ms]"
        style={{
          background: `linear-gradient(to top, rgba(5,8,18,${
            0.06 + 0.26 * sunset + 0.48 * night
          }), rgba(8,12,24,${0.02 + 0.18 * night}) 24%, transparent 52%)`,
        }}
      />
      <div
        className="absolute inset-0 mix-blend-screen transition-all duration-[3500ms]"
        style={{
          opacity: 0.12 + 0.2 * day + 0.18 * moonHigh,
          background: `radial-gradient(circle at 50% 14%, rgba(255,255,255,${
            0.12 + 0.18 * day + 0.16 * moonHigh
          }), transparent 24%)`,
        }}
      />
      <div
        className="absolute inset-0 transition-all duration-[3500ms]"
        style={{
          opacity: 0.1 + 0.48 * night,
          background: `radial-gradient(circle at 24% 22%, rgba(255,255,255,${
            0.02 + 0.07 * moonHigh
          }) 0 1px, transparent 1.6px), radial-gradient(circle at 62% 18%, rgba(255,255,255,${
            0.02 + 0.08 * moonHigh
          }) 0 1px, transparent 1.6px), radial-gradient(circle at 78% 30%, rgba(220,235,255,${
            0.02 + 0.08 * moonHigh
          }) 0 1px, transparent 1.6px), radial-gradient(circle at 36% 10%, rgba(255,255,255,${
            0.02 + 0.07 * moonHigh
          }) 0 1px, transparent 1.6px), radial-gradient(circle at 14% 34%, rgba(220,235,255,${
            0.02 + 0.06 * moonHigh
          }) 0 1px, transparent 1.6px), radial-gradient(circle at 86% 12%, rgba(255,255,255,${
            0.02 + 0.07 * midnight
          }) 0 1px, transparent 1.6px)`,
        }}
      />
      <div
        className="absolute inset-0 transition-all duration-[3500ms]"
        style={{
          opacity: 0.16 + 0.5 * night,
          background: `radial-gradient(circle at 28% 24%, rgba(170,132,255,${
            0.08 + 0.18 * moonHigh
          }), transparent 18%), radial-gradient(circle at 72% 26%, rgba(120,198,255,${
            0.06 + 0.16 * moonHigh
          }), transparent 22%), radial-gradient(circle at 52% 62%, rgba(78,94,190,${
            0.04 + 0.2 * midnight
          }), transparent 30%)`,
        }}
      />
    </>
  );
}

function SkySunMoon({
  onPhaseChange,
}: {
  onPhaseChange: (phase: number) => void;
}) {
  return (
    <>
      <style>{`
        @keyframes celestialArc{0%{transform:translate(-16vw,72vh)}50%{transform:translate(46vw,2vh)}100%{transform:translate(108vw,74vh)}}
        @keyframes sunVisibility{0%,49.999%{opacity:1}50%,100%{opacity:0}}
        @keyframes moonVisibility{0%,49.999%{opacity:0}50%,100%{opacity:1}}
        @keyframes birdDrift{0%{transform:translateX(-12vw)}100%{transform:translateX(112vw)}}
        @keyframes swoopDrift{0%{transform:translate(-12vw,0vh)}35%{transform:translate(25vw,6vh)}65%{transform:translate(68vw,16vh)}100%{transform:translate(112vw,8vh)}}
        @keyframes batIntoTreesLeft{0%{transform:translateX(-10vw) translateY(1vh) scale(1);opacity:0}20%{transform:translateX(10vw) translateY(-1vh) scale(1.05);opacity:1}45%{transform:translateX(28vw) translateY(2vh) scale(1.08);opacity:1}70%{transform:translateX(44vw) translateY(5vh) scale(0.98);opacity:.8}100%{transform:translateX(52vw) translateY(8vh) scale(.9);opacity:0}}
        @keyframes batIntoTreesRight{0%{transform:translateX(10vw) translateY(1vh) scale(1);opacity:0}20%{transform:translateX(-10vw) translateY(-1vh) scale(1.05);opacity:1}45%{transform:translateX(-28vw) translateY(2vh) scale(1.08);opacity:1}70%{transform:translateX(-44vw) translateY(5vh) scale(0.98);opacity:.8}100%{transform:translateX(-52vw) translateY(8vh) scale(.9);opacity:0}}
        @keyframes cloudDrift{0%{transform:translateX(-18vw)}100%{transform:translateX(112vw)}}
        @keyframes starTwinkle{0%,100%{opacity:.15;transform:scale(1)}50%{opacity:.8;transform:scale(1.15)}}
      `}</style>

      <div className="absolute left-0 top-0" style={{ animation: "celestialArc 90s linear infinite" }}>
        <div className="relative h-28 w-28 animate-[sunVisibility_180s_linear_infinite] md:h-32 md:w-32">
          <div className="absolute inset-0 rounded-full bg-yellow-100/35 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,_#fff7d6,_#ffe38a_45%,_#f7c948_72%,_#e9a91d_100%)] shadow-[0_0_50px_rgba(255,224,120,0.55)]" />
          <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow-100/25 bg-yellow-100/10" />
        </div>
      </div>

      <div
        className="absolute left-0 top-0"
        style={{ animation: "celestialArc 90s linear infinite", animationDelay: "90s" }}
      >
        <div className="relative h-28 w-28 animate-[moonVisibility_180s_linear_infinite] md:h-32 md:w-32">
          <div className="absolute inset-0 rounded-full bg-cyan-100/16 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,_#ffffff,_#ebf6ff_58%,_#bfdcff_100%)] shadow-[0_0_38px_rgba(200,228,255,0.42)]" />
        </div>
      </div>

      <DayPhaseTracker onPhaseChange={onPhaseChange} />
    </>
  );
}

function DayPhaseTracker({
  onPhaseChange,
}: {
  onPhaseChange: (phase: number) => void;
}) {
  useEffect(() => {
    let frame: number;
    const duration = 180000;
    const start = performance.now();

    const tick = (now: number) => {
      onPhaseChange(((now - start) % duration) / duration);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onPhaseChange]);

  return null;
}

function SkyBirdsAndBats({ cyclePhase }: { cyclePhase: number }) {
  const isNight = cyclePhase >= 0.5;
  const dayStrength = isNight ? 0 : 1;
  const nightStrength = isNight ? 1 : 0;

  const clouds = [
    { top: "10%", width: "22rem", height: "5.5rem", delay: "0s", duration: "70s", opacity: 0.62 },
    { top: "18%", width: "18rem", height: "4.4rem", delay: "-20s", duration: "80s", opacity: 0.52 },
    { top: "28%", width: "20rem", height: "4.8rem", delay: "-40s", duration: "76s", opacity: 0.46 },
  ];

  const dayBlend = 1 - Math.min(1, Math.max(0, (cyclePhase - 0.38) / 0.2));
  const cloudTone = `rgba(${Math.round(255 - (1 - dayBlend) * 14)}, ${Math.round(
    252 - (1 - dayBlend) * 12
  )}, ${Math.round(246 - (1 - dayBlend) * 6)}, 0.72)`;
  const cloudShade = `rgba(${Math.round(248 - (1 - dayBlend) * 16)}, ${Math.round(
    242 - (1 - dayBlend) * 14
  )}, ${Math.round(236 - (1 - dayBlend) * 8)}, 0.54)`;
  const cloudEdge = `rgba(${Math.round(255 - (1 - dayBlend) * 8)}, ${Math.round(
    255 - (1 - dayBlend) * 8
  )}, ${Math.round(252 - (1 - dayBlend) * 4)}, 0.38)`;

  const stars = [
    { left: "8%", top: "10%", size: "0.18rem", delay: "0s" },
    { left: "12%", top: "11%", size: "0.22rem", delay: "-0.4s" },
    { left: "18%", top: "22%", size: "0.14rem", delay: "-2.2s" },
    { left: "22%", top: "18%", size: "0.18rem", delay: "-1.2s" },
    { left: "27%", top: "14%", size: "0.16rem", delay: "-1.8s" },
    { left: "31%", top: "9%", size: "0.24rem", delay: "-2.4s" },
    { left: "37%", top: "24%", size: "0.14rem", delay: "-0.9s" },
    { left: "44%", top: "16%", size: "0.16rem", delay: "-0.7s" },
    { left: "49%", top: "8%", size: "0.2rem", delay: "-2.7s" },
    { left: "56%", top: "8%", size: "0.22rem", delay: "-2.1s" },
    { left: "63%", top: "28%", size: "0.2rem", delay: "-1.1s" },
    { left: "68%", top: "19%", size: "0.18rem", delay: "-1.7s" },
    { left: "72%", top: "11%", size: "0.14rem", delay: "-0.5s" },
    { left: "79%", top: "12%", size: "0.24rem", delay: "-2.8s" },
    { left: "86%", top: "23%", size: "0.16rem", delay: "-0.3s" },
    { left: "90%", top: "14%", size: "0.14rem", delay: "-1.4s" },
  ];

  return (
    <>
      {clouds.map((cloud, i) => (
        <div
          key={`cloud-${i}`}
          className="absolute left-0"
          style={{
            top: cloud.top,
            opacity: cloud.opacity * dayStrength,
            animation: `cloudDrift ${cloud.duration} linear infinite`,
            animationDelay: cloud.delay,
          }}
        >
          <Cloud width={cloud.width} height={cloud.height} tone={cloudTone} shade={cloudShade} edge={cloudEdge} />
        </div>
      ))}

      {stars.map((star, i) => (
        <div
          key={`star-${i}`}
          className="absolute rounded-full bg-white"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            opacity: 0.75 * nightStrength,
            boxShadow: "0 0 8px rgba(255,255,255,0.45)",
            animation: `starTwinkle ${2.8 + (i % 3) * 0.9}s ease-in-out infinite`,
            animationDelay: star.delay,
          }}
        />
      ))}

      {DAY_BIRDS.map((bird, i) => (
        <div
          key={`bird-${i}`}
          className={`absolute left-0 ${bird.scale} ${bird.rotate}`}
          style={{
            top: bird.top,
            opacity: (parseInt(bird.opacity.replace("opacity-", "")) / 100) * dayStrength,
            animation: `${bird.depth === "low" ? "swoopDrift" : "birdDrift"} ${bird.duration} linear infinite`,
            animationDelay: bird.delay,
          }}
        >
          <Bird />
        </div>
      ))}

      {isNight &&
        BAT_GROUPS.map((g, i) => (
          <FragmentBats key={`bat-${i}`} group={g} nightStrength={nightStrength} />
        ))}
    </>
  );
}

function FragmentBats({
  group,
  nightStrength,
}: {
  group: { top: string; delay: string; duration: string; scale: string; opacity: string };
  nightStrength: number;
}) {
  const opacity = (parseInt(group.opacity.replace("opacity-", "")) / 100) * nightStrength;

  return (
    <>
      <div
        className={`absolute left-0 ${group.scale}`}
        style={{
          top: group.top,
          opacity,
          animation: `batIntoTreesLeft ${group.duration} ease-in infinite`,
          animationDelay: group.delay,
        }}
      >
        <div className="relative h-12 w-20">
          <Bat left="2%" top="30%" size="scale-125" />
          <Bat left="34%" top="8%" size="scale-145" />
          <Bat left="66%" top="26%" size="scale-110" />
        </div>
      </div>

      <div
        className={`absolute right-0 ${group.scale}`}
        style={{
          top: group.top,
          opacity,
          animation: `batIntoTreesRight ${group.duration} ease-in infinite`,
          animationDelay: group.delay,
        }}
      >
        <div className="relative h-12 w-20">
          <Bat left="2%" top="30%" size="scale-125" />
          <Bat left="34%" top="8%" size="scale-145" />
          <Bat left="66%" top="26%" size="scale-110" />
        </div>
      </div>
    </>
  );
}

function Cloud({
  width,
  height,
  tone,
  shade,
  edge,
}: {
  width: string;
  height: string;
  tone: string;
  shade: string;
  edge: string;
}) {
  return (
    <div className="relative" style={{ width, height }}>
      <div
        className="absolute inset-x-[8%] bottom-0 h-[56%] rounded-[999px] blur-md"
        style={{ background: shade, boxShadow: `0 0 24px ${edge}` }}
      />
      <div
        className="absolute left-[8%] bottom-[18%] h-[46%] w-[28%] rounded-full blur-md"
        style={{ background: tone, boxShadow: `0 0 20px ${edge}` }}
      />
      <div
        className="absolute left-[32%] bottom-[30%] h-[56%] w-[32%] rounded-full blur-md"
        style={{ background: tone, boxShadow: `0 0 20px ${edge}` }}
      />
      <div
        className="absolute right-[12%] bottom-[22%] h-[44%] w-[26%] rounded-full blur-md"
        style={{ background: shade, boxShadow: `0 0 18px ${edge}` }}
      />
      <div
        className="absolute inset-x-[20%] bottom-[10%] h-[18%] rounded-[999px] opacity-70 blur-md"
        style={{ background: edge }}
      />
    </div>
  );
}

function Bird() {
  return (
    <div className="relative h-6 w-10">
      <div className="absolute left-0 top-1 h-4 w-5 rounded-full border-t-2 border-slate-700/70" />
      <div className="absolute right-0 top-1 h-4 w-5 rounded-full border-t-2 border-slate-700/70" />
    </div>
  );
}

function Bat({
  left,
  top,
  size,
}: {
  left: string;
  top: string;
  size: string;
}) {
  return (
    <div className={`absolute ${size}`} style={{ left, top }}>
      <div className="relative h-5 w-9">
        <div className="absolute left-0 top-[5px] h-[6px] w-[8px] rounded-t-full border-t-2 border-l-2 border-slate-950/85 rotate-[-18deg]" />
        <div className="absolute right-0 top-[5px] h-[6px] w-[8px] rounded-t-full border-t-2 border-r-2 border-slate-950/85 rotate-[18deg]" />
        <div className="absolute left-[11px] top-[4px] h-[7px] w-[3px] rounded-b-full bg-slate-950/85" />
        <div className="absolute left-[12px] top-[3px] h-[1px] w-[1px] rounded-full bg-slate-950/85" />
      </div>
    </div>
  );
}

function ForestFloor() {
  const trees = [
    { left: "-4%", w: "18%", h: "22%", o: "0.9" },
    { left: "8%", w: "16%", h: "18%", o: "0.82" },
    { left: "19%", w: "20%", h: "24%", o: "0.9" },
    { left: "34%", w: "18%", h: "19%", o: "0.78" },
    { left: "47%", w: "22%", h: "25%", o: "0.88" },
    { left: "63%", w: "18%", h: "20%", o: "0.8" },
    { left: "76%", w: "20%", h: "23%", o: "0.88" },
    { left: "90%", w: "16%", h: "18%", o: "0.76" },
  ];

  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 h-[32%] bg-[linear-gradient(to_top,_rgba(4,8,6,1),_rgba(10,18,12,0.99)_18%,_rgba(18,30,20,0.98)_38%,_rgba(34,54,36,0.94)_58%,_rgba(58,86,58,0.78)_76%,_rgba(84,116,78,0.18)_88%,_transparent)]" />
      <div className="absolute bottom-[22%] left-0 right-0 h-[12%] bg-[linear-gradient(to_top,_rgba(255,255,255,0.02),_rgba(220,236,220,0.1)_30%,_rgba(245,250,245,0.22)_55%,_rgba(255,255,255,0.28)_70%,_transparent)] blur-xl" />
      <div className="absolute bottom-[24%] left-0 right-0 h-[18%] opacity-95">
        {trees.map((t, i) => (
          <div key={i} className="absolute bottom-0" style={{ left: t.left, width: t.w, height: t.h, opacity: Number(t.o) }}>
            <div className="absolute bottom-0 left-[46%] h-[48%] w-[5%] -translate-x-1/2 rounded-full bg-[#17271a]" />
            <div className="absolute bottom-[18%] left-1/2 h-[58%] w-[88%] -translate-x-1/2 rounded-[999px] bg-[#203524] blur-[1px]" />
            <div className="absolute bottom-[36%] left-[22%] h-[42%] w-[40%] rounded-[999px] bg-[#16251a]" />
            <div className="absolute bottom-[38%] right-[18%] h-[40%] w-[38%] rounded-[999px] bg-[#16251a]" />
            <div className="absolute bottom-[52%] left-1/2 h-[34%] w-[42%] -translate-x-1/2 rounded-[999px] bg-[#2a4530]" />
          </div>
        ))}
      </div>
      <div className="absolute bottom-[23%] left-0 right-0 h-[2px] bg-[linear-gradient(to_right,_transparent,_rgba(255,255,255,0.16),_transparent)]" />
      <div className="absolute bottom-[10%] left-[-8%] h-28 w-[42%] rounded-full bg-[#0f1b11]/72 blur-2xl" />
      <div className="absolute bottom-[9%] left-[18%] h-24 w-[30%] rounded-full bg-[#1b2d1d]/58 blur-2xl" />
      <div className="absolute bottom-[8%] left-[42%] h-28 w-[32%] rounded-full bg-[#102012]/68 blur-2xl" />
      <div className="absolute bottom-[9%] right-[-6%] h-28 w-[38%] rounded-full bg-[#122014]/72 blur-2xl" />
      <div className="absolute bottom-0 left-0 right-0 h-[18%] bg-[linear-gradient(to_top,_rgba(2,4,3,0.96),_rgba(5,9,6,0.9)_22%,_rgba(10,18,12,0.74)_48%,_transparent)]" />
    </>
  );
}

function ForestSpot({ stage, variant }: { stage: number; variant: TreeKey }) {
  return (
    <div className="relative flex flex-col items-center">
      <div className="relative h-64 w-40 md:h-72 md:w-44">
        <div className="absolute bottom-0 left-1/2 h-6 w-24 -translate-x-1/2 rounded-full bg-slate-900/20 blur-md" />
        <GroundPatch variant={variant} />
        <Stump />
        <TreeGrowth stage={stage} variant={variant} />
      </div>
    </div>
  );
}

function GroundPatch({ variant }: { variant: TreeKey }) {
  const p = PALETTES[variant];
  return (
    <>
      <div className="absolute bottom-2 left-1/2 h-10 w-32 -translate-x-1/2 rounded-[999px] bg-[radial-gradient(circle_at_center,_rgba(170,120,76,0.9),_rgba(121,85,56,0.92)_55%,_rgba(82,56,40,0.98)_100%)] shadow-[0_12px_40px_rgba(61,35,16,0.35)]" />
      <div className="absolute bottom-6 left-1/2 h-3 w-24 -translate-x-1/2 rounded-full bg-white/20 blur-sm" />
      <div className={`absolute bottom-3 left-[26%] h-6 w-3 rounded-full ${p.grass1} rotate-[-20deg]`} />
      <div className={`absolute bottom-5 left-[28%] h-4 w-5 rounded-full ${p.grass2}`} />
      <div className={`absolute bottom-2 right-[24%] h-7 w-3 rounded-full ${p.grass1} rotate-[14deg]`} />
      <div className={`absolute bottom-4 right-[22%] h-4 w-5 rounded-full ${p.grass2}`} />
    </>
  );
}

function Stump() {
  return (
    <>
      <div className="absolute bottom-8 left-1/2 h-12 w-16 -translate-x-1/2 rounded-b-[1.3rem] rounded-t-[1rem] bg-[linear-gradient(to_bottom,_#9a6a42,_#7c5333_55%,_#654127_100%)] shadow-lg" />
      <div className="absolute bottom-[3.7rem] left-1/2 h-4 w-16 -translate-x-1/2 rounded-full border border-[#7f5737]/50 bg-[radial-gradient(circle_at_center,_#c08e60,_#8c623d_68%,_#71492a_100%)]" />
      <div className="absolute bottom-10 left-[47%] h-7 w-[2px] bg-[#5e3a24]/35" />
      <div className="absolute bottom-10 left-[52%] h-6 w-[2px] bg-[#5e3a24]/35" />
    </>
  );
}

function TreeGrowth({ stage, variant }: { stage: number; variant: TreeKey }) {
  return (
    <div className="absolute inset-0">
      {stage >= 1 && <Bud variant={variant} />}
      {stage >= 2 && <Sprout variant={variant} />}
      {stage >= 3 && <Sapling variant={variant} />}
      {stage >= 4 && <YoungTree variant={variant} />}
      {stage >= 5 && <GrandTree variant={variant} />}
      {stage >= 6 && <AncientTree variant={variant} />}
      {stage >= 7 && <MythicTree variant={variant} />}
      {stage >= 8 && <WorldTree variant={variant} />}
    </div>
  );
}

function Bud({ variant }: { variant: TreeKey }) {
  const p = PALETTES[variant];
  return (
    <>
      <div className={`absolute bottom-[4.6rem] left-1/2 h-7 w-1 -translate-x-1/2 rounded-full ${p.trunk}`} />
      <div className={`absolute bottom-[6rem] left-[46%] h-4 w-6 rounded-full ${p.leaf1} rotate-[-22deg] shadow-sm`} />
      <div className={`absolute bottom-[6rem] left-[51%] h-4 w-6 rounded-full ${p.leaf2} rotate-[24deg] shadow-sm`} />
    </>
  );
}

function Sprout({ variant }: { variant: TreeKey }) {
  const p = PALETTES[variant];
  return (
    <>
      <div className={`absolute bottom-[4.5rem] left-1/2 h-12 w-1.5 -translate-x-1/2 rounded-full ${p.trunk}`} />
      <div className={`absolute bottom-[6.2rem] left-[43%] h-5 w-8 rounded-full ${p.leaf1} rotate-[-28deg] shadow-md`} />
      <div className={`absolute bottom-[7rem] left-[51%] h-5 w-8 rounded-full ${p.leaf2} rotate-[30deg] shadow-md`} />
      <div className={`absolute bottom-[7.9rem] left-[47.5%] h-5 w-7 rounded-full ${p.leaf3} shadow-md`} />
    </>
  );
}

function Sapling({ variant }: { variant: TreeKey }) {
  const p = PALETTES[variant];
  const drape = variant === "willow";
  return (
    <>
      <div className={`absolute bottom-[4.3rem] left-1/2 h-20 w-2 -translate-x-1/2 rounded-full ${p.trunk} shadow-sm`} />
      <div className={`absolute bottom-[8.5rem] left-[39%] h-7 w-11 rounded-full ${p.leaf1} rotate-[-20deg] shadow-lg`} />
      <div className={`absolute bottom-[10rem] left-[51%] h-7 w-11 rounded-full ${p.leaf2} rotate-[18deg] shadow-lg`} />
      <div className={`absolute bottom-[11rem] left-[44%] h-8 w-12 rounded-full ${p.leaf3} shadow-lg`} />
      <div className="absolute bottom-[8.7rem] left-[48.5%] h-8 w-[2px] bg-[#6f472b]/80 rotate-[35deg]" />
      <div className="absolute bottom-[9rem] left-[48.2%] h-8 w-[2px] bg-[#6f472b]/80 -rotate-[30deg]" />
      {drape && <div className={`absolute bottom-[8.7rem] left-[39%] h-10 w-2 rounded-full ${p.leaf2} opacity-80`} />}
      {drape && <div className={`absolute bottom-[9rem] left-[58%] h-11 w-2 rounded-full ${p.leaf1} opacity-80`} />}
    </>
  );
}

function YoungTree({ variant }: { variant: TreeKey }) {
  const p = PALETTES[variant];
  const blossom = variant === "blossom";
  const willow = variant === "willow";
  const moon = variant === "moon";
  return (
    <>
      <div className={`absolute bottom-[4rem] left-1/2 h-28 w-3 -translate-x-1/2 rounded-full ${p.trunk} shadow-md`} />
      <div className="absolute bottom-[10rem] left-[47.7%] h-10 w-[3px] bg-[#765032] rotate-[30deg]" />
      <div className="absolute bottom-[11rem] left-[48.2%] h-10 w-[3px] bg-[#765032] -rotate-[26deg]" />
      <div className={`absolute bottom-[11.5rem] left-[31%] h-14 w-16 rounded-full ${p.leaf1} blur-[1px] shadow-2xl`} />
      <div className={`absolute bottom-[13rem] left-[44%] h-16 w-16 rounded-full ${p.leaf2} blur-[1px] shadow-2xl`} />
      <div className={`absolute bottom-[11rem] left-[53%] h-14 w-16 rounded-full ${p.leaf3} blur-[1px] shadow-2xl`} />
      <div className={`absolute bottom-[9.8rem] left-[40%] h-12 w-20 rounded-full ${p.leaf4} blur-[1px] shadow-xl`} />
      <div className={`absolute bottom-[10.8rem] left-[37%] h-12 w-12 rounded-full ${p.glow} blur-xl`} />
      {blossom && (
        <>
          <div className="absolute bottom-[13.8rem] left-[39%] h-2 w-2 rounded-full bg-white/90" />
          <div className="absolute bottom-[12.6rem] left-[59%] h-2 w-2 rounded-full bg-rose-50/95" />
          <div className="absolute bottom-[11.8rem] left-[49%] h-2 w-2 rounded-full bg-pink-50/95" />
        </>
      )}
      {willow && (
        <>
          <div className={`absolute bottom-[9.8rem] left-[34%] h-14 w-2 rounded-full ${p.leaf2} opacity-80`} />
          <div className={`absolute bottom-[10.2rem] left-[62%] h-16 w-2 rounded-full ${p.leaf1} opacity-80`} />
        </>
      )}
      {moon && <div className="absolute bottom-[14.2rem] left-[56%] h-4 w-4 rounded-full bg-white/35 blur-sm" />}
    </>
  );
}

function GrandTree({ variant }: { variant: TreeKey }) {
  const p = PALETTES[variant];
  const blossom = variant === "blossom";
  const willow = variant === "willow";
  const firefly = variant === "firefly";
  const moon = variant === "moon";
  const silver = variant === "silver";
  const oak = variant === "oak";

  return (
    <>
      <div className={`absolute bottom-[4rem] left-1/2 h-36 w-4 -translate-x-1/2 rounded-full ${p.trunk} shadow-lg`} />
      <div className="absolute bottom-[12rem] left-[48%] h-12 w-[3px] bg-[#725033] rotate-[38deg]" />
      <div className="absolute bottom-[12.4rem] left-[48.1%] h-12 w-[3px] bg-[#725033] -rotate-[34deg]" />
      <div className={`absolute bottom-[14.5rem] left-[20%] h-16 w-20 rounded-full ${p.leaf4} shadow-2xl blur-[1px]`} />
      <div className={`absolute bottom-[16rem] left-[31%] h-20 w-24 rounded-full ${p.leaf1} shadow-2xl blur-[1px]`} />
      <div className={`absolute bottom-[17rem] left-[45%] h-20 w-22 rounded-full ${p.leaf2} shadow-2xl blur-[1px]`} />
      <div className={`absolute bottom-[15.8rem] left-[57%] h-18 w-22 rounded-full ${p.leaf3} shadow-2xl blur-[1px]`} />
      <div className={`absolute bottom-[13.3rem] left-[35%] h-15 w-24 rounded-full ${p.glow} blur-2xl`} />

      {willow && (
        <>
          <div className={`absolute bottom-[10.2rem] left-[27%] h-24 w-2 rounded-full ${p.leaf2} opacity-80`} />
          <div className={`absolute bottom-[11rem] left-[35%] h-20 w-2 rounded-full ${p.leaf1} opacity-80`} />
          <div className={`absolute bottom-[11rem] left-[65%] h-24 w-2 rounded-full ${p.leaf2} opacity-80`} />
          <div className={`absolute bottom-[10rem] left-[73%] h-18 w-2 rounded-full ${p.leaf1} opacity-80`} />
        </>
      )}

      {blossom && (
        <>
          <div className="absolute bottom-[17rem] left-[30%] h-2.5 w-2.5 rounded-full bg-white/90" />
          <div className="absolute bottom-[18rem] left-[46%] h-2.5 w-2.5 rounded-full bg-rose-50/95" />
          <div className="absolute bottom-[16.2rem] left-[61%] h-2.5 w-2.5 rounded-full bg-pink-50/95" />
        </>
      )}

      {firefly && (
        <>
          <div className="absolute bottom-[17rem] left-[35%] h-2.5 w-2.5 rounded-full bg-yellow-100 shadow-[0_0_18px_rgba(255,245,170,0.9)]" />
          <div className="absolute bottom-[15rem] left-[58%] h-2.5 w-2.5 rounded-full bg-yellow-100 shadow-[0_0_18px_rgba(255,245,170,0.9)]" />
        </>
      )}

      {moon && (
        <div className="absolute bottom-[18.9rem] left-[57%] h-8 w-8 rounded-full border border-white/60 bg-white/20 shadow-[0_0_24px_rgba(255,255,255,0.45)]" />
      )}

      {silver && <div className="absolute bottom-[19rem] left-[41%] h-8 w-10 rounded-full bg-white/30 blur-md" />}
      {oak && <div className={`absolute bottom-[13rem] left-[49%] h-16 w-24 rounded-full ${p.leaf2} shadow-xl blur-[1px]`} />}
    </>
  );
}

function AncientTree({ variant }: { variant: TreeKey }) {
  const p = PALETTES[variant];
  return (
    <>
      <GrandTree variant={variant} />
      <div className={`absolute bottom-[18rem] left-[14%] h-16 w-20 rounded-full ${p.leaf1} shadow-2xl blur-[1px]`} />
      <div className={`absolute bottom-[19.5rem] left-[28%] h-18 w-24 rounded-full ${p.leaf2} shadow-2xl blur-[1px]`} />
      <div className={`absolute bottom-[20.4rem] left-[44%] h-18 w-24 rounded-full ${p.leaf3} shadow-2xl blur-[1px]`} />
      <div className={`absolute bottom-[19.2rem] left-[60%] h-16 w-20 rounded-full ${p.leaf1} shadow-2xl blur-[1px]`} />
      <div className={`absolute bottom-[17rem] left-[36%] h-20 w-24 rounded-full ${p.glow} blur-3xl`} />
    </>
  );
}

function MythicTree({ variant }: { variant: TreeKey }) {
  const p = PALETTES[variant];
  return (
    <>
      <AncientTree variant={variant} />
      <div className={`absolute bottom-[21.5rem] left-[8%] h-18 w-24 rounded-full ${p.leaf4} shadow-2xl blur-[1px]`} />
      <div className={`absolute bottom-[23rem] left-[22%] h-20 w-26 rounded-full ${p.leaf1} shadow-2xl blur-[1px]`} />
      <div className={`absolute bottom-[24rem] left-[40%] h-20 w-28 rounded-full ${p.leaf2} shadow-2xl blur-[1px]`} />
      <div className={`absolute bottom-[22.8rem] left-[60%] h-18 w-24 rounded-full ${p.leaf3} shadow-2xl blur-[1px]`} />
      <div className={`absolute bottom-[20.5rem] left-[30%] h-22 w-28 rounded-full ${p.glow} blur-3xl`} />
    </>
  );
}

function WorldTree({ variant }: { variant: TreeKey }) {
  const p = PALETTES[variant];
  return (
    <>
      <MythicTree variant={variant} />
      <div className={`absolute bottom-[25.5rem] left-[2%] h-20 w-24 rounded-full ${p.leaf4} shadow-2xl blur-[1px]`} />
      <div className={`absolute bottom-[27rem] left-[16%] h-22 w-28 rounded-full ${p.leaf1} shadow-2xl blur-[1px]`} />
      <div className={`absolute bottom-[28.2rem] left-[36%] h-22 w-30 rounded-full ${p.leaf2} shadow-2xl blur-[1px]`} />
      <div className={`absolute bottom-[27rem] left-[58%] h-20 w-26 rounded-full ${p.leaf3} shadow-2xl blur-[1px]`} />
      <div className={`absolute bottom-[24rem] left-[24%] h-24 w-32 rounded-full ${p.glow} blur-3xl`} />
    </>
  );
}