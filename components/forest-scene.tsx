"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { type TreeKey, type TreeState } from "@/lib/types";

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

const TREE_DEPTH_PHASES = [0.2, 1.15, 2.35, 3.1, 4.0, 5.05, 5.9];

const CLUSTER_POSITIONS = [
  { left: 37, top: 72 },
  { left: 42, top: 73 },
  { left: 45, top: 69 },
  { left: 50, top: 74 },
  { left: 55, top: 69 },
  { left: 58, top: 73 },
  { left: 62, top: 72 },
];

const FULL_POSITIONS = [
  { left: 33, top: 71 },
  { left: 39, top: 73 },
  { left: 45, top: 67 },
  { left: 50, top: 75 },
  { left: 55, top: 67 },
  { left: 61, top: 73 },
  { left: 67, top: 71 },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function getTreePosition(index: number, stage: number) {
  const from = CLUSTER_POSITIONS[index];
  const to = FULL_POSITIONS[index];

  // stage 1–3 stay fairly clustered, then spread from 4 upward
  const t = Math.max(0, Math.min(1, (stage - 3) / 5));

  return {
    left: `${lerp(from.left, to.left, t)}%`,
    top: `${lerp(from.top, to.top, t)}%`,
  };
}

const TRUNK_NAMES = [
  "Emily",
  "Daisy",
  "Rose",
  "Anushka",
  "Annabel",
  "Joanna",
  "Bea",
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

function animationStyle(
  name: string,
  duration: string,
  timingFunction: CSSProperties["animationTimingFunction"] = "linear",
  delay?: string
): CSSProperties {
  return {
    animationName: name,
    animationDuration: duration,
    animationTimingFunction: timingFunction,
    animationIterationCount: "infinite",
    ...(delay ? { animationDelay: delay } : {}),
  };
}

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
      <ForestMotionStyles />
      <SkyLighting cyclePhase={cyclePhase} />

      <div className="absolute inset-0 overflow-hidden">
        <SkySunMoon onPhaseChange={setCyclePhase} />
        <SkyBirdsAndBats cyclePhase={cyclePhase} />
        <div className="absolute -top-16 left-[-10%] h-64 w-64 rounded-full bg-white/35 blur-3xl" />
        <div className="absolute top-24 right-[10%] h-40 w-40 rounded-full bg-yellow-100/70 blur-2xl" />
        <div className="absolute left-[7%] top-[20%] h-24 w-52 rounded-full bg-emerald-950/10 blur-3xl" />
        <div className="absolute left-[38%] top-[14%] h-24 w-64 rounded-full bg-emerald-950/10 blur-3xl" />
        <div className="absolute right-[6%] top-[22%] h-28 w-56 rounded-full bg-emerald-950/10 blur-3xl" />

        <SkyStars trees={trees} cyclePhase={cyclePhase} />

        <div className="absolute bottom-0 left-0 right-0 h-[34%] bg-[linear-gradient(to_top,_rgba(58,89,67,0.95),_rgba(103,145,96,0.8)_30%,_rgba(165,196,134,0.18)_70%,_transparent)]" />
        <ForestFloor />
        <ForegroundForest />
      </div>

      <div className={`relative z-10 min-h-screen ${admin ? "pr-[340px]" : ""}`}>
        {trees.map((tree, index) => {
          const phase = cyclePhase * Math.PI * 2 * 2 + TREE_DEPTH_PHASES[index];
          const depth = Math.sin(phase);
          const side = Math.cos(phase);

          const xOffset = side * 10;
          const yOffset = Math.max(0, depth) * -4;
          const scale = 1 + Math.max(0, depth) * 0.025;

          const depthBand = depth < -0.35 ? 0 : depth < 0.35 ? 1 : 2;

          const stageFrontBonus =
            tree.stage <= 2 ? 40 : tree.stage === 3 ? 28 : tree.stage === 4 ? 12 : 0;

          const zIndex = depthBand * 100 + stageFrontBonus + index;

          const pos = getTreePosition(index, tree.stage);
          const label = TRUNK_NAMES[index] ?? "";

          return (
            <div
              key={tree.tree_key}
              className="absolute"
              style={{
                left: pos.left,
                top: pos.top,
                zIndex,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                style={{
                  transform: `translate(${xOffset.toFixed(3)}px, ${yOffset.toFixed(
                    3
                  )}px) scale(${scale.toFixed(4)})`,
                  transition: "transform 180ms linear",
                }}
              >
                <ForestSpot stage={tree.stage} variant={tree.tree_key} label={label} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SkyStars({
  trees,
  cyclePhase,
}: {
  trees: TreeState[];
  cyclePhase: number;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true">
      {trees.map((tree) => {
        const position = SKY_STAR_LAYOUT[tree.tree_key];
        if (!position) return null;

        return (
          <TreeStar
            key={`sky-star-${tree.tree_key}`}
            stage={clampStarStage(tree.star_stage ?? 0)}
            variant={tree.tree_key}
            cyclePhase={cyclePhase}
            left={position.left}
            bottom={position.bottom}
          />
        );
      })}
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
    Math.round(
      188 * day + 166 * night + 24 * moonHigh - 24 * sunset + 54 * preDawn
    ),
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
      `}</style>

      <div
        className="absolute left-0 top-0"
        style={animationStyle("celestialArc", "90s", "linear")}
      >
        <div className="relative h-28 w-28 animate-[sunVisibility_180s_linear_infinite] md:h-32 md:w-32">
          <div className="absolute inset-0 rounded-full bg-yellow-100/35 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,_#fff7d6,_#ffe38a_45%,_#f7c948_72%,_#e9a91d_100%)] shadow-[0_0_50px_rgba(255,224,120,0.55)]" />
          <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow-100/25 bg-yellow-100/10" />
        </div>
      </div>

      <div
        className="absolute left-0 top-0"
        style={animationStyle("celestialArc", "90s", "linear", "90s")}
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
    {
      top: "10%",
      width: "22rem",
      height: "5.5rem",
      delay: "0s",
      duration: "70s",
      opacity: 0.62,
    },
    {
      top: "18%",
      width: "18rem",
      height: "4.4rem",
      delay: "-20s",
      duration: "80s",
      opacity: 0.52,
    },
    {
      top: "28%",
      width: "20rem",
      height: "4.8rem",
      delay: "-40s",
      duration: "76s",
      opacity: 0.46,
    },
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

  return (
    <>
      {clouds.map((cloud, i) => (
        <div
          key={`cloud-${i}`}
          className="absolute left-0"
          style={{
            top: cloud.top,
            opacity: cloud.opacity * dayStrength,
            ...animationStyle("cloudDrift", cloud.duration, "linear", cloud.delay),
          }}
        >
          <Cloud
            width={cloud.width}
            height={cloud.height}
            tone={cloudTone}
            shade={cloudShade}
            edge={cloudEdge}
          />
        </div>
      ))}

      {DAY_BIRDS.map((bird, i) => (
        <div
          key={`bird-${i}`}
          className={`absolute left-0 ${bird.scale} ${bird.rotate}`}
          style={{
            top: bird.top,
            opacity:
              (parseInt(bird.opacity.replace("opacity-", "")) / 100) * dayStrength,
            ...animationStyle(
              bird.depth === "low" ? "swoopDrift" : "birdDrift",
              bird.duration,
              "linear",
              bird.delay
            ),
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
  group: {
    top: string;
    delay: string;
    duration: string;
    scale: string;
    opacity: string;
  };
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
          ...animationStyle("batIntoTreesLeft", group.duration, "ease-in", group.delay),
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
          ...animationStyle("batIntoTreesRight", group.duration, "ease-in", group.delay),
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
          <div
            key={i}
            className="absolute bottom-0"
            style={{ left: t.left, width: t.w, height: t.h, opacity: Number(t.o) }}
          >
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

function ForegroundForest() {
  const backRow = [
    { left: "-14%", scale: 0.74, kind: "pine", opacity: 0.56 },
    { left: "-8%", scale: 0.68, kind: "round", opacity: 0.52 },
    { left: "-2%", scale: 0.78, kind: "tall", opacity: 0.57 },
    { left: "4%", scale: 0.72, kind: "wide", opacity: 0.54 },
    { left: "9%", scale: 0.76, kind: "pine", opacity: 0.56 },
    { left: "14%", scale: 0.7, kind: "round", opacity: 0.53 },
    { left: "19%", scale: 0.8, kind: "tall", opacity: 0.58 },
    { left: "25%", scale: 0.72, kind: "wide", opacity: 0.54 },
    { left: "31%", scale: 0.76, kind: "pine", opacity: 0.56 },
    { left: "37%", scale: 0.7, kind: "round", opacity: 0.52 },
    { left: "43%", scale: 0.8, kind: "tall", opacity: 0.58 },
    { left: "49%", scale: 0.72, kind: "wide", opacity: 0.54 },
    { left: "55%", scale: 0.76, kind: "pine", opacity: 0.56 },
    { left: "61%", scale: 0.7, kind: "round", opacity: 0.52 },
    { left: "67%", scale: 0.8, kind: "tall", opacity: 0.58 },
    { left: "73%", scale: 0.72, kind: "wide", opacity: 0.54 },
    { left: "79%", scale: 0.76, kind: "pine", opacity: 0.56 },
    { left: "85%", scale: 0.7, kind: "round", opacity: 0.52 },
    { left: "91%", scale: 0.8, kind: "tall", opacity: 0.58 },
    { left: "97%", scale: 0.72, kind: "wide", opacity: 0.54 },
    { left: "103%", scale: 0.76, kind: "pine", opacity: 0.56 },
  ] as const;

  const frontRow = [
    { left: "-16%", scale: 1.12, kind: "pine", opacity: 0.84 },
    { left: "-10%", scale: 1.02, kind: "round", opacity: 0.78 },
    { left: "-4%", scale: 1.18, kind: "tall", opacity: 0.86 },
    { left: "1%", scale: 1.08, kind: "wide", opacity: 0.82 },
    { left: "6%", scale: 1.14, kind: "pine", opacity: 0.85 },
    { left: "11%", scale: 1.0, kind: "round", opacity: 0.78 },
    { left: "16%", scale: 1.12, kind: "tall", opacity: 0.84 },
    { left: "21%", scale: 1.04, kind: "wide", opacity: 0.8 },
    { left: "26%", scale: 1.1, kind: "pine", opacity: 0.83 },

    { left: "64%", scale: 1.08, kind: "pine", opacity: 0.82 },
    { left: "69%", scale: 1.0, kind: "round", opacity: 0.78 },
    { left: "74%", scale: 1.16, kind: "wide", opacity: 0.85 },
    { left: "79%", scale: 1.06, kind: "tall", opacity: 0.82 },
    { left: "84%", scale: 1.18, kind: "pine", opacity: 0.86 },
    { left: "89%", scale: 1.0, kind: "round", opacity: 0.78 },
    { left: "94%", scale: 1.12, kind: "tall", opacity: 0.84 },
    { left: "99%", scale: 1.04, kind: "wide", opacity: 0.8 },
    { left: "104%", scale: 1.1, kind: "pine", opacity: 0.83 },
  ] as const;

  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[70%] overflow-visible">
      <div className="absolute bottom-[30%] left-0 right-0 h-[12%] bg-[linear-gradient(to_top,_rgba(255,255,255,0.02),_rgba(255,255,255,0.05)_45%,_transparent)] blur-xl" />

      <div className="absolute inset-0">
        {backRow.map((tree, i) => (
          <div
            key={`back-tree-${i}`}
            className="absolute inset-0"
            style={{ filter: "blur(0.8px)" }}
          >
            <RegularForestTree
              left={tree.left}
              bottom="24%"
              scale={tree.scale * 1.2}
              kind={tree.kind}
              opacity={tree.opacity * 1.5}
              depth="back"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0">
        {frontRow.map((tree, i) => (
          <RegularForestTree
            key={`front-tree-${i}`}
            left={tree.left}
            bottom="10%"
            scale={tree.scale}
            kind={tree.kind}
            opacity={tree.opacity}
            depth="front"
          />
        ))}
      </div>
    </div>
  );
}

function RegularForestTree({
  left,
  bottom,
  scale,
  kind,
  opacity,
  depth,
}: {
  left: string;
  bottom: string;
  scale: number;
  kind: "round" | "pine" | "tall" | "wide";
  opacity: number;
  depth: "front" | "back";
}) {
  const s = scale * 1.2;
  const height = 320 * s;
  const width = 170 * s;

  const trunk =
    depth === "front"
      ? "bg-[linear-gradient(to_top,_#101612,_#1a241d,_#243127)]"
      : "bg-[linear-gradient(to_top,_#1a241c,_#253228,_#314236)]";

  const leafA = depth === "front" ? "bg-[#162019]" : "bg-[#243126]";
  const leafB = depth === "front" ? "bg-[#1d281f]" : "bg-[#2b392d]";
  const leafC = depth === "front" ? "bg-[#243224]" : "bg-[#334537]";
  const leafD = depth === "front" ? "bg-[#2c3b2f]" : "bg-[#3b5040]";

  return (
    <div
      className="absolute"
      style={{
        left,
        bottom,
        width: `${width}px`,
        height: `${height}px`,
        opacity,
      }}
    >
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-black/28 blur-xl"
        style={{
          width: `${92 * s}px`,
          height: `${18 * s}px`,
        }}
      />

      <div
        className={`absolute bottom-[4%] left-1/2 -translate-x-1/2 ${trunk}`}
        style={{
          width: `${14 * s}px`,
          height: `${108 * s}px`,
          clipPath: "polygon(22% 100%, 10% 52%, 26% 8%, 74% 8%, 90% 52%, 78% 100%)",
        }}
      />

      {kind === "pine" && (
        <>
          <div
            className={`absolute left-1/2 -translate-x-1/2 ${leafC}`}
            style={{
              bottom: `${72 * s}px`,
              width: `${136 * s}px`,
              height: `${80 * s}px`,
              clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
            }}
          />
          <div
            className={`absolute left-1/2 -translate-x-1/2 ${leafB}`}
            style={{
              bottom: `${118 * s}px`,
              width: `${110 * s}px`,
              height: `${76 * s}px`,
              clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
            }}
          />
          <div
            className={`absolute left-1/2 -translate-x-1/2 ${leafA}`}
            style={{
              bottom: `${160 * s}px`,
              width: `${82 * s}px`,
              height: `${64 * s}px`,
              clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
            }}
          />
          <div
            className={`absolute left-1/2 -translate-x-1/2 ${leafD}`}
            style={{
              bottom: `${198 * s}px`,
              width: `${58 * s}px`,
              height: `${48 * s}px`,
              clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
            }}
          />
        </>
      )}

      {kind === "round" && (
        <>
          <div
            className={`absolute ${leafA}`}
            style={{
              left: `${18 * s}px`,
              bottom: `${88 * s}px`,
              width: `${62 * s}px`,
              height: `${62 * s}px`,
              clipPath:
                "polygon(8% 74%, 16% 28%, 42% 6%, 78% 14%, 96% 42%, 88% 82%, 58% 98%, 20% 92%)",
            }}
          />
          <div
            className={`absolute ${leafB}`}
            style={{
              left: `${48 * s}px`,
              bottom: `${122 * s}px`,
              width: `${72 * s}px`,
              height: `${72 * s}px`,
              clipPath:
                "polygon(8% 74%, 16% 28%, 42% 6%, 78% 14%, 96% 42%, 88% 82%, 58% 98%, 20% 92%)",
            }}
          />
          <div
            className={`absolute ${leafC}`}
            style={{
              left: `${82 * s}px`,
              bottom: `${90 * s}px`,
              width: `${60 * s}px`,
              height: `${60 * s}px`,
              clipPath:
                "polygon(8% 74%, 16% 28%, 42% 6%, 78% 14%, 96% 42%, 88% 82%, 58% 98%, 20% 92%)",
            }}
          />
          <div
            className={`absolute ${leafD}`}
            style={{
              left: `${44 * s}px`,
              bottom: `${164 * s}px`,
              width: `${78 * s}px`,
              height: `${78 * s}px`,
              clipPath:
                "polygon(8% 74%, 16% 28%, 42% 6%, 78% 14%, 96% 42%, 88% 82%, 58% 98%, 20% 92%)",
            }}
          />
        </>
      )}

      {kind === "tall" && (
        <>
          <div
            className={`absolute left-1/2 -translate-x-1/2 ${leafC}`}
            style={{
              bottom: `${86 * s}px`,
              width: `${96 * s}px`,
              height: `${90 * s}px`,
              clipPath:
                "polygon(18% 100%, 8% 62%, 16% 26%, 36% 8%, 50% 0, 64% 8%, 84% 26%, 92% 62%, 82% 100%)",
            }}
          />
          <div
            className={`absolute left-1/2 -translate-x-1/2 ${leafB}`}
            style={{
              bottom: `${142 * s}px`,
              width: `${82 * s}px`,
              height: `${86 * s}px`,
              clipPath:
                "polygon(18% 100%, 8% 62%, 16% 26%, 36% 8%, 50% 0, 64% 8%, 84% 26%, 92% 62%, 82% 100%)",
            }}
          />
          <div
            className={`absolute left-1/2 -translate-x-1/2 ${leafA}`}
            style={{
              bottom: `${194 * s}px`,
              width: `${64 * s}px`,
              height: `${76 * s}px`,
              clipPath:
                "polygon(18% 100%, 8% 62%, 16% 26%, 36% 8%, 50% 0, 64% 8%, 84% 26%, 92% 62%, 82% 100%)",
            }}
          />
        </>
      )}

      {kind === "wide" && (
        <>
          <div
            className={`absolute left-1/2 -translate-x-1/2 ${leafC}`}
            style={{
              bottom: `${84 * s}px`,
              width: `${156 * s}px`,
              height: `${58 * s}px`,
              clipPath:
                "polygon(4% 78%, 8% 28%, 24% 8%, 52% 0, 80% 8%, 94% 26%, 96% 70%, 82% 94%, 48% 100%, 14% 92%)",
            }}
          />
          <div
            className={`absolute left-1/2 -translate-x-1/2 ${leafB}`}
            style={{
              bottom: `${126 * s}px`,
              width: `${132 * s}px`,
              height: `${54 * s}px`,
              clipPath:
                "polygon(4% 78%, 8% 28%, 24% 8%, 52% 0, 80% 8%, 94% 26%, 96% 70%, 82% 94%, 48% 100%, 14% 92%)",
            }}
          />
          <div
            className={`absolute left-1/2 -translate-x-1/2 ${leafA}`}
            style={{
              bottom: `${164 * s}px`,
              width: `${102 * s}px`,
              height: `${48 * s}px`,
              clipPath:
                "polygon(4% 78%, 8% 28%, 24% 8%, 52% 0, 80% 8%, 94% 26%, 96% 70%, 82% 94%, 48% 100%, 14% 92%)",
            }}
          />
          <div
            className={`absolute left-1/2 -translate-x-1/2 ${leafD}`}
            style={{
              bottom: `${198 * s}px`,
              width: `${74 * s}px`,
              height: `${40 * s}px`,
              clipPath:
                "polygon(4% 78%, 8% 28%, 24% 8%, 52% 0, 80% 8%, 94% 26%, 96% 70%, 82% 94%, 48% 100%, 14% 92%)",
            }}
          />
        </>
      )}
    </div>
  );
}

type GrowthStage = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type StarStage = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

const clampStage = (stage: number): GrowthStage => {
  return Math.max(1, Math.min(8, stage)) as GrowthStage;
};

const clampStarStage = (stage: number): StarStage => {
  return Math.max(0, Math.min(7, stage)) as StarStage;
};

const PAPER_STAGE: Record<
  number,
  {
    scale: number;
    trunkHeight: number;
    trunkWidth: number;
    layerCount: number;
    particleCount: number;
  }
> = {
  1: { scale: 0.38, trunkHeight: 34, trunkWidth: 5, layerCount: 1, particleCount: 0 },
  2: { scale: 0.48, trunkHeight: 48, trunkWidth: 6, layerCount: 1, particleCount: 1 },
  3: { scale: 0.58, trunkHeight: 70, trunkWidth: 8, layerCount: 2, particleCount: 2 },
  4: { scale: 0.72, trunkHeight: 112, trunkWidth: 12, layerCount: 3, particleCount: 4 },
  5: { scale: 0.86, trunkHeight: 142, trunkWidth: 15, layerCount: 4, particleCount: 6 },
  6: { scale: 1.0, trunkHeight: 172, trunkWidth: 18, layerCount: 4, particleCount: 8 },
  7: { scale: 1.12, trunkHeight: 198, trunkWidth: 20, layerCount: 5, particleCount: 10 },
  8: { scale: 1.24, trunkHeight: 226, trunkWidth: 22, layerCount: 5, particleCount: 12 },
};

const PAPER_PARTICLES = [
  { left: "30%", bottom: "47%", size: 5, opacity: 0.42, delay: "0s" },
  { left: "38%", bottom: "56%", size: 4, opacity: 0.55, delay: "-0.5s" },
  { left: "46%", bottom: "63%", size: 5, opacity: 0.58, delay: "-1.2s" },
  { left: "56%", bottom: "54%", size: 6, opacity: 0.48, delay: "-1.8s" },
  { left: "63%", bottom: "66%", size: 4, opacity: 0.46, delay: "-0.8s" },
  { left: "70%", bottom: "51%", size: 5, opacity: 0.4, delay: "-2.4s" },
  { left: "43%", bottom: "73%", size: 4, opacity: 0.44, delay: "-2.1s" },
  { left: "52%", bottom: "76%", size: 5, opacity: 0.42, delay: "-0.2s" },
  { left: "61%", bottom: "71%", size: 4, opacity: 0.38, delay: "-1.5s" },
  { left: "33%", bottom: "66%", size: 4, opacity: 0.42, delay: "-2.8s" },
  { left: "49%", bottom: "49%", size: 3, opacity: 0.5, delay: "-0.9s" },
  { left: "58%", bottom: "60%", size: 4, opacity: 0.46, delay: "-1.9s" },
];

const PAPER_CLOUD =
  "polygon(6% 72%, 14% 32%, 28% 14%, 52% 6%, 76% 14%, 92% 34%, 96% 64%, 84% 88%, 58% 98%, 26% 94%)";
const PAPER_SHELF =
  "polygon(4% 78%, 8% 28%, 24% 8%, 52% 0, 80% 8%, 94% 26%, 96% 70%, 82% 94%, 48% 100%, 14% 92%)";
const PAPER_SPIRE =
  "polygon(24% 100%, 8% 64%, 14% 26%, 34% 8%, 50% 0, 66% 8%, 86% 26%, 92% 64%, 76% 100%)";
const PAPER_FLAME =
  "polygon(18% 100%, 10% 72%, 18% 36%, 34% 10%, 50% 0, 66% 12%, 82% 38%, 90% 74%, 82% 100%, 54% 88%, 34% 96%)";
const PAPER_DRAPE =
  "polygon(28% 0, 72% 0, 100% 20%, 86% 100%, 14% 100%, 0 20%)";
const PAPER_CRYSTAL =
  "polygon(50% 0, 82% 18%, 100% 52%, 78% 100%, 22% 100%, 0 52%, 18% 18%)";
const PAPER_FAN =
  "polygon(6% 82%, 12% 36%, 30% 12%, 52% 4%, 74% 10%, 90% 30%, 96% 74%, 84% 96%, 48% 100%, 16% 94%)";
const PAPER_SEED =
  "polygon(50% 0, 82% 18%, 100% 54%, 74% 100%, 26% 100%, 0 54%, 18% 18%)";

function scalePx(value: number, scale: number) {
  return Math.round(value * scale);
}

type PaperLayer = {
  x: number;
  bottom: number;
  width: number;
  height: number;
  rotate: number;
  tone: string;
  shape: string;
  opacity: number;
};

type PaperBranch = {
  x: number;
  bottom: number;
  width: number;
  height: number;
  rotate: number;
};

type SpeciesProfile = {
  glow: { width: number; height: number; bottom: number; opacity: number };
  shadow: { width: number; height: number; bottom: number; shape: string };
  branches: PaperBranch[];
  layers: PaperLayer[];
};

function getSpeciesProfile(variant: TreeKey, p: Palette): SpeciesProfile {
  switch (variant) {
    case "oak":
      return {
        glow: { width: 120, height: 70, bottom: 164, opacity: 0.68 },
        shadow: { width: 214, height: 104, bottom: 142, shape: PAPER_SHELF },
        branches: [
          { x: 0, bottom: 68, width: 10, height: 58, rotate: 0 },
          { x: -8, bottom: 106, width: 8, height: 40, rotate: -26 },
          { x: 8, bottom: 108, width: 8, height: 42, rotate: 28 },
        ],
        layers: [
          {
            x: 0,
            bottom: 132,
            width: 212,
            height: 62,
            rotate: 0,
            tone: p.leaf4,
            shape: PAPER_SHELF,
            opacity: 0.94,
          },
          {
            x: -46,
            bottom: 166,
            width: 170,
            height: 78,
            rotate: -8,
            tone: p.leaf1,
            shape: PAPER_SHELF,
            opacity: 0.96,
          },
          {
            x: 48,
            bottom: 166,
            width: 170,
            height: 76,
            rotate: 8,
            tone: p.leaf2,
            shape: PAPER_SHELF,
            opacity: 0.96,
          },
          {
            x: 0,
            bottom: 204,
            width: 188,
            height: 72,
            rotate: 0,
            tone: p.leaf3,
            shape: PAPER_FAN,
            opacity: 0.95,
          },
          {
            x: 0,
            bottom: 238,
            width: 130,
            height: 56,
            rotate: 0,
            tone: p.leaf2,
            shape: PAPER_CLOUD,
            opacity: 0.9,
          },
        ],
      };

    case "willow":
      return {
        glow: { width: 126, height: 78, bottom: 170, opacity: 0.72 },
        shadow: { width: 170, height: 122, bottom: 148, shape: PAPER_CLOUD },
        branches: [
          { x: 0, bottom: 66, width: 10, height: 72, rotate: 0 },
          { x: -6, bottom: 112, width: 6, height: 42, rotate: -18 },
          { x: 6, bottom: 112, width: 6, height: 42, rotate: 18 },
        ],
        layers: [
          {
            x: 0,
            bottom: 146,
            width: 168,
            height: 72,
            rotate: 0,
            tone: p.leaf4,
            shape: PAPER_CLOUD,
            opacity: 0.9,
          },
          {
            x: -36,
            bottom: 176,
            width: 150,
            height: 124,
            rotate: -12,
            tone: p.leaf1,
            shape: PAPER_DRAPE,
            opacity: 0.96,
          },
          {
            x: 38,
            bottom: 176,
            width: 150,
            height: 124,
            rotate: 12,
            tone: p.leaf2,
            shape: PAPER_DRAPE,
            opacity: 0.96,
          },
          {
            x: 0,
            bottom: 206,
            width: 162,
            height: 92,
            rotate: 0,
            tone: p.leaf3,
            shape: PAPER_FAN,
            opacity: 0.94,
          },
          {
            x: 0,
            bottom: 244,
            width: 106,
            height: 56,
            rotate: 0,
            tone: p.leaf2,
            shape: PAPER_CLOUD,
            opacity: 0.88,
          },
        ],
      };

    case "blossom":
      return {
        glow: { width: 140, height: 84, bottom: 176, opacity: 0.84 },
        shadow: { width: 204, height: 116, bottom: 154, shape: PAPER_CLOUD },
        branches: [
          { x: 0, bottom: 66, width: 9, height: 64, rotate: 0 },
          { x: -10, bottom: 110, width: 6, height: 34, rotate: -30 },
          { x: 10, bottom: 110, width: 6, height: 34, rotate: 30 },
        ],
        layers: [
          {
            x: 0,
            bottom: 138,
            width: 150,
            height: 72,
            rotate: 0,
            tone: p.leaf4,
            shape: PAPER_CLOUD,
            opacity: 0.9,
          },
          {
            x: -44,
            bottom: 176,
            width: 142,
            height: 92,
            rotate: -10,
            tone: p.leaf1,
            shape: PAPER_CLOUD,
            opacity: 0.96,
          },
          {
            x: 44,
            bottom: 176,
            width: 142,
            height: 92,
            rotate: 10,
            tone: p.leaf2,
            shape: PAPER_CLOUD,
            opacity: 0.96,
          },
          {
            x: 0,
            bottom: 212,
            width: 176,
            height: 106,
            rotate: 0,
            tone: p.leaf3,
            shape: PAPER_CLOUD,
            opacity: 0.95,
          },
          {
            x: 0,
            bottom: 252,
            width: 120,
            height: 68,
            rotate: 0,
            tone: p.leaf2,
            shape: PAPER_CLOUD,
            opacity: 0.88,
          },
        ],
      };

    case "moon":
      return {
        glow: { width: 116, height: 92, bottom: 188, opacity: 0.92 },
        shadow: { width: 150, height: 132, bottom: 162, shape: PAPER_SPIRE },
        branches: [
          { x: 0, bottom: 68, width: 9, height: 76, rotate: 0 },
          { x: -8, bottom: 118, width: 5, height: 34, rotate: -22 },
          { x: 8, bottom: 118, width: 5, height: 34, rotate: 22 },
        ],
        layers: [
          {
            x: 0,
            bottom: 144,
            width: 134,
            height: 70,
            rotate: 0,
            tone: p.leaf4,
            shape: PAPER_SPIRE,
            opacity: 0.9,
          },
          {
            x: -30,
            bottom: 182,
            width: 106,
            height: 106,
            rotate: -6,
            tone: p.leaf1,
            shape: PAPER_SPIRE,
            opacity: 0.95,
          },
          {
            x: 30,
            bottom: 182,
            width: 106,
            height: 106,
            rotate: 6,
            tone: p.leaf2,
            shape: PAPER_SPIRE,
            opacity: 0.95,
          },
          {
            x: 0,
            bottom: 220,
            width: 138,
            height: 134,
            rotate: 0,
            tone: p.leaf3,
            shape: PAPER_SPIRE,
            opacity: 0.95,
          },
          {
            x: 0,
            bottom: 270,
            width: 84,
            height: 74,
            rotate: 0,
            tone: p.leaf2,
            shape: PAPER_CRYSTAL,
            opacity: 0.88,
          },
        ],
      };

    case "firefly":
      return {
        glow: { width: 132, height: 84, bottom: 172, opacity: 0.82 },
        shadow: { width: 196, height: 112, bottom: 150, shape: PAPER_FAN },
        branches: [
          { x: 0, bottom: 66, width: 9, height: 64, rotate: 0 },
          { x: -10, bottom: 106, width: 6, height: 40, rotate: -28 },
          { x: 12, bottom: 112, width: 6, height: 48, rotate: 34 },
        ],
        layers: [
          {
            x: -8,
            bottom: 136,
            width: 140,
            height: 74,
            rotate: -4,
            tone: p.leaf4,
            shape: PAPER_FAN,
            opacity: 0.9,
          },
          {
            x: -42,
            bottom: 174,
            width: 132,
            height: 94,
            rotate: -14,
            tone: p.leaf1,
            shape: PAPER_FLAME,
            opacity: 0.96,
          },
          {
            x: 52,
            bottom: 180,
            width: 150,
            height: 104,
            rotate: 12,
            tone: p.leaf2,
            shape: PAPER_FLAME,
            opacity: 0.96,
          },
          {
            x: 8,
            bottom: 216,
            width: 160,
            height: 110,
            rotate: 4,
            tone: p.leaf3,
            shape: PAPER_CLOUD,
            opacity: 0.94,
          },
          {
            x: 18,
            bottom: 254,
            width: 102,
            height: 66,
            rotate: 8,
            tone: p.leaf2,
            shape: PAPER_FLAME,
            opacity: 0.88,
          },
        ],
      };

    case "silver":
      return {
        glow: { width: 122, height: 88, bottom: 182, opacity: 0.88 },
        shadow: { width: 176, height: 116, bottom: 156, shape: PAPER_CRYSTAL },
        branches: [
          { x: 0, bottom: 68, width: 9, height: 70, rotate: 0 },
          { x: -8, bottom: 114, width: 5, height: 34, rotate: -24 },
          { x: 8, bottom: 114, width: 5, height: 34, rotate: 24 },
        ],
        layers: [
          {
            x: 0,
            bottom: 142,
            width: 144,
            height: 66,
            rotate: 0,
            tone: p.leaf4,
            shape: PAPER_CRYSTAL,
            opacity: 0.9,
          },
          {
            x: -34,
            bottom: 180,
            width: 122,
            height: 90,
            rotate: -8,
            tone: p.leaf1,
            shape: PAPER_CRYSTAL,
            opacity: 0.96,
          },
          {
            x: 34,
            bottom: 182,
            width: 122,
            height: 90,
            rotate: 8,
            tone: p.leaf2,
            shape: PAPER_CRYSTAL,
            opacity: 0.96,
          },
          {
            x: 0,
            bottom: 220,
            width: 150,
            height: 108,
            rotate: 0,
            tone: p.leaf3,
            shape: PAPER_FAN,
            opacity: 0.94,
          },
          {
            x: 0,
            bottom: 264,
            width: 90,
            height: 72,
            rotate: 0,
            tone: p.leaf2,
            shape: PAPER_CRYSTAL,
            opacity: 0.88,
          },
        ],
      };

    case "golden":
    default:
      return {
        glow: { width: 132, height: 84, bottom: 174, opacity: 0.8 },
        shadow: { width: 192, height: 114, bottom: 150, shape: PAPER_FLAME },
        branches: [
          { x: 0, bottom: 68, width: 9, height: 64, rotate: 0 },
          { x: -9, bottom: 108, width: 6, height: 40, rotate: -30 },
          { x: 10, bottom: 112, width: 6, height: 44, rotate: 32 },
        ],
        layers: [
          {
            x: 0,
            bottom: 138,
            width: 150,
            height: 72,
            rotate: -2,
            tone: p.leaf4,
            shape: PAPER_FLAME,
            opacity: 0.9,
          },
          {
            x: -42,
            bottom: 176,
            width: 138,
            height: 94,
            rotate: -12,
            tone: p.leaf1,
            shape: PAPER_FLAME,
            opacity: 0.96,
          },
          {
            x: 36,
            bottom: 182,
            width: 126,
            height: 88,
            rotate: 10,
            tone: p.leaf2,
            shape: PAPER_FLAME,
            opacity: 0.96,
          },
          {
            x: 2,
            bottom: 220,
            width: 158,
            height: 108,
            rotate: 2,
            tone: p.leaf3,
            shape: PAPER_FLAME,
            opacity: 0.94,
          },
          {
            x: 8,
            bottom: 262,
            width: 92,
            height: 70,
            rotate: 6,
            tone: p.leaf2,
            shape: PAPER_FLAME,
            opacity: 0.88,
          },
        ],
      };
  }
}

type HeroEffectProfile = {
  sway: number;
  glow: number;
  particles: number;
  parallax: number;
};

const HERO_EFFECTS: Record<TreeKey, HeroEffectProfile> = {
  golden: {
    sway: 2,
    glow: 0.9,
    particles: 0.4,
    parallax: 1,
  },
  oak: {
    sway: 2,
    glow: 0.12,
    particles: 0,
    parallax: 0.08,
  },
  blossom: {
    sway: 8,
    glow: 0.4,
    particles: 1,
    parallax: 3,
  },
  firefly: {
    sway: 2,
    glow: 0,
    particles: 1,
    parallax: 0.14,
  },
  moon: {
    sway: 0,
    glow: 0,
    particles: 0.2,
    parallax: 10,
  },
  silver: {
    sway: 6,
    glow: 0.2,
    particles: 0.18,
    parallax: 0.1,
  },
  willow: {
    sway: 2,
    glow: 2,
    particles: 0.4,
    parallax: 1,
  },
};

const TREE_MOTION: Record<
  GrowthStage,
  {
    sway: number;
    bob: number;
    duration: number;
    glow: number;
    layer: number;
    particle: number;
  }
> = {
  1: { sway: 0.15, bob: 0.4, duration: 8.2, glow: 0.03, layer: 0.08, particle: 1.0 },
  2: { sway: 0.2, bob: 0.5, duration: 8.0, glow: 0.04, layer: 0.1, particle: 1.2 },
  3: { sway: 0.25, bob: 0.7, duration: 7.8, glow: 0.05, layer: 0.14, particle: 1.4 },
  4: { sway: 0.35, bob: 0.9, duration: 7.5, glow: 0.06, layer: 0.18, particle: 1.8 },
  5: { sway: 0.5, bob: 1.2, duration: 7.2, glow: 0.08, layer: 0.24, particle: 2.2 },
  6: { sway: 0.65, bob: 1.5, duration: 7.0, glow: 0.1, layer: 0.3, particle: 2.6 },
  7: { sway: 0.8, bob: 1.8, duration: 6.8, glow: 0.12, layer: 0.36, particle: 3.0 },
  8: { sway: 1.0, bob: 2.2, duration: 6.6, glow: 0.14, layer: 0.42, particle: 3.4 },
};

const TREE_PHASE_DELAY: Record<TreeKey, string> = {
  golden: "-0.4s",
  willow: "-1.3s",
  blossom: "-2.1s",
  moon: "-0.9s",
  oak: "-1.8s",
  firefly: "-2.8s",
  silver: "-1.1s",
};

type StarRayMode =
  | "regal"
  | "soft"
  | "petal"
  | "crystal"
  | "sturdy"
  | "ember"
  | "frost";

type StarSatelliteMode =
  | "crown"
  | "droplet"
  | "petals"
  | "orbit"
  | "acorns"
  | "fireflies"
  | "shards";

type StarProfile = {
  initials: string;
  rotate: number;
  twinkleDuration: number;
  delay: string;
  coreColor: string;
  glowColor: string;
  rayColor: string;
  rayMode: StarRayMode;
  satelliteMode: StarSatelliteMode;
  satellites: { left: string; bottom: string; size: number }[];
};

type SkyStarPosition = {
  left: string;
  bottom: string;
};

const STAR_STAGE_STYLE: Record<
  StarStage,
  {
    size: number;
    halo: number;
    ray: number;
    glowOpacity: number;
    satellites: number;
  }
> = {
  0: { size: 0, halo: 0, ray: 0, glowOpacity: 0, satellites: 0 },
  1: { size: 20, halo: 18, ray: 24, glowOpacity: 0.34, satellites: 0 },
  2: { size: 30, halo: 22, ray: 30, glowOpacity: 0.44, satellites: 0 },
  3: { size: 40, halo: 28, ray: 36, glowOpacity: 0.56, satellites: 1 },
  4: { size: 50, halo: 34, ray: 44, glowOpacity: 0.68, satellites: 2 },
  5: { size: 60, halo: 42, ray: 54, glowOpacity: 0.78, satellites: 3 },
  6: { size: 70, halo: 50, ray: 64, glowOpacity: 0.88, satellites: 4 },
  7: { size: 80, halo: 60, ray: 76, glowOpacity: 0.98, satellites: 5 },
};

const SKY_STAR_LAYOUT: Record<TreeKey, SkyStarPosition> = {
  golden: { left: "56%", bottom: "80%" },
  willow: { left: "72%", bottom: "90%" },
  blossom: { left: "80%", bottom: "76%" },
  moon: { left: "20%", bottom: "94%" },
  oak: { left: "32%", bottom: "80%" },
  firefly: { left: "15%", bottom: "74%" },
  silver: { left: "42%", bottom: "88%" },
};

const STAR_PROFILES: Record<TreeKey, StarProfile> = {
  golden: {
    initials: "EB",
    rotate: 8,
    twinkleDuration: 4.6,
    delay: "-0.3s",
    coreColor: "rgba(255, 232, 162, 1)",
    glowColor: "rgba(255, 191, 92, 0.9)",
    rayColor: "rgba(255, 225, 146, 0.82)",
    rayMode: "regal",
    satelliteMode: "crown",
    satellites: [
      { left: "18%", bottom: "74%", size: 9 },
      { left: "34%", bottom: "84%", size: 3 },
      { left: "50%", bottom: "90%", size: 7 },
      { left: "66%", bottom: "84%", size: 1 },
      { left: "82%", bottom: "74%", size: 12 },
    ],
  },
  willow: {
    initials: "DM",
    rotate: -10,
    twinkleDuration: 5.2,
    delay: "-1.1s",
    coreColor: "rgb(14, 126, 68)",
    glowColor: "rgba(146, 252, 204, 0.82)",
    rayColor: "rgba(180, 255, 220, 0.72)",
    rayMode: "soft",
    satelliteMode: "droplet",
    satellites: [
      { left: "26%", bottom: "34%", size: 2 },
      { left: "38%", bottom: "22%", size: 10 },

    ],
  },
  blossom: {
    initials: "RT",
    rotate: 16,
    twinkleDuration: 4.1,
    delay: "-0.8s",
    coreColor: "rgb(229, 160, 197)",
    glowColor: "rgba(255, 170, 214, 0.88)",
    rayColor: "rgba(255, 216, 234, 0.82)",
    rayMode: "petal",
    satelliteMode: "petals",
    satellites: [
      { left: "24%", bottom: "62%", size: 3 },
      { left: "34%", bottom: "80%", size: 2 },
      { left: "50%", bottom: "72%", size: 3 },
      { left: "68%", bottom: "58%", size: 2 },
      { left: "76%", bottom: "42%", size: 3 },
    ],
  },
  moon: {
    initials: "AR",
    rotate: 0,
    twinkleDuration: 5.6,
    delay: "-0.4s",
    coreColor: "rgba(246, 252, 255, 1)",
    glowColor: "rgba(166, 220, 255, 0.92)",
    rayColor: "rgba(214, 240, 255, 0.82)",
    rayMode: "crystal",
    satelliteMode: "orbit",
    satellites: [
      { left: "18%", bottom: "56%", size: 4 },
      { left: "34%", bottom: "82%", size: 6 },
      { left: "76%", bottom: "82%", size: 9 },
      { left: "84%", bottom: "52%", size: 9 },

    ],
  },
  oak: {
    initials: "AM",
    rotate: -6,
    twinkleDuration: 5.0,
    delay: "-1.4s",
    coreColor: "rgba(245, 255, 206, 1)",
    glowColor: "rgba(188, 228, 98, 0.84)",
    rayColor: "rgba(220, 248, 156, 0.76)",
    rayMode: "sturdy",
    satelliteMode: "orbit",
    satellites: [
      { left: "26%", bottom: "24%", size: 1 },
      { left: "40%", bottom: "14%", size: 12 },
      { left: "58%", bottom: "14%", size: 5 },

    ],
  },
  firefly: {
    initials: "JC",
    rotate: 12,
    twinkleDuration: 3.7,
    delay: "-1.9s",
    coreColor: "rgba(255, 252, 196, 1)",
    glowColor: "rgba(241, 255, 108, 0.96)",
    rayColor: "rgba(248, 255, 170, 0.82)",
    rayMode: "ember",
    satelliteMode: "fireflies",
    satellites: [
      { left: "14%", bottom: "62%", size: 1 },
      { left: "32%", bottom: "84%", size: 3 },
      { left: "68%", bottom: "78%", size: 8 },
      { left: "84%", bottom: "48%", size: 5 },
    ],
  },
  silver: {
    initials: "BC",
    rotate: -14,
    twinkleDuration: 5.3,
    delay: "-0.6s",
    coreColor: "rgba(255, 255, 255, 1)",
    glowColor: "rgba(224, 232, 248, 0.92)",
    rayColor: "rgba(240, 246, 255, 0.84)",
    rayMode: "frost",
    satelliteMode: "shards",
    satellites: [
      { left: "24%", bottom: "72%", size: 4 },
      { left: "50%", bottom: "88%", size: 3 },
      { left: "76%", bottom: "72%", size: 11 },
      { left: "30%", bottom: "24%", size: 4 },
      { left: "70%", bottom: "24%", size: 4 },
    ],
  },
};

function ForestMotionStyles() {
  return (
    <style>{`
      @keyframes heroTreeSway {
        0%, 100% {
          transform: rotate(calc(var(--hero-sway) * -1)) translateY(0px);
        }
        25% {
          transform: rotate(calc(var(--hero-sway) * -0.35)) translateY(calc(var(--hero-bob) * -0.35));
        }
        50% {
          transform: rotate(var(--hero-sway)) translateY(calc(var(--hero-bob) * -1));
        }
        75% {
          transform: rotate(calc(var(--hero-sway) * 0.2)) translateY(calc(var(--hero-bob) * -0.45));
        }
      }

      @keyframes heroGlowPulse {
        0%, 100% {
          transform: translateX(-50%) scale(0.96);
          opacity: var(--glow-opacity);
        }
        50% {
          transform: translateX(-50%) scale(calc(1 + var(--glow-grow)));
          opacity: calc(var(--glow-opacity) + 0.08);
        }
      }

      @keyframes paperLayerSway {
        0%, 100% {
          transform: translateX(-50%) rotate(calc(var(--layer-rotate) - var(--layer-sway)));
        }
        50% {
          transform:
            translateX(-50%)
            translateY(calc(var(--layer-lift) * -1))
            rotate(calc(var(--layer-rotate) + var(--layer-sway)));
        }
      }

      @keyframes heroParticleFloat {
        0%, 100% {
          transform: translateY(0px) translateX(0px) scale(0.96);
          opacity: calc(var(--particle-opacity) * 0.88);
        }
        50% {
          transform:
            translateY(calc(var(--particle-rise) * -1))
            translateX(var(--particle-drift))
            scale(1.08);
          opacity: var(--particle-opacity);
        }
      }

      @keyframes heroStarPulse {
        0%, 100% {
          transform: translate(-50%, -50%) scale(0.92);
          opacity: 0.78;
        }
        50% {
          transform: translate(-50%, -50%) scale(1.08);
          opacity: 1;
        }
      }

      @keyframes heroStarFlicker {
        0%, 100% {
          filter: brightness(0.94);
        }
        50% {
          filter: brightness(1.22);
        }
      }

      @keyframes heroStarSparkle {
        0%, 100% {
          transform: scale(0.88);
          opacity: 0.5;
        }
        50% {
          transform: scale(1.16);
          opacity: 1;
        }
      }

      @keyframes heroStarRayPulse {
        0%, 100% {
          opacity: 0.36;
        }
        50% {
          opacity: 0.82;
        }
      }
    `}</style>
  );
}

function getHeroGlow(variant: TreeKey) {
  switch (variant) {
    case "golden":
      return {
        backdrop:
          "radial-gradient(circle at 50% 55%, rgba(18,10,4,0.34) 0%, rgba(18,10,4,0.2) 42%, transparent 76%)",
        outer:
          "radial-gradient(circle at 50% 52%, rgba(255,248,214,0.96) 0%, rgba(255,208,116,0.72) 22%, rgba(255,144,56,0.34) 48%, rgba(255,96,24,0.12) 66%, transparent 82%)",
        inner:
          "radial-gradient(circle at 50% 48%, rgba(255,255,240,0.95) 0%, rgba(255,239,186,0.78) 42%, transparent 78%)",
      };

    case "willow":
      return {
        backdrop:
          "radial-gradient(circle at 50% 55%, rgba(4,14,10,0.3) 0%, rgba(4,14,10,0.18) 44%, transparent 76%)",
        outer:
          "radial-gradient(circle at 50% 52%, rgba(218,255,240,0.72) 0%, rgba(92,214,170,0.42) 24%, rgba(24,122,92,0.22) 52%, transparent 82%)",
        inner:
          "radial-gradient(circle at 50% 48%, rgba(235,255,245,0.7) 0%, rgba(180,255,220,0.4) 42%, transparent 78%)",
      };

    case "blossom":
      return {
        backdrop:
          "radial-gradient(circle at 50% 55%, rgba(22,8,14,0.26) 0%, rgba(22,8,14,0.16) 42%, transparent 76%)",
        outer:
          "radial-gradient(circle at 50% 52%, rgba(255,248,252,0.94) 0%, rgba(255,201,228,0.62) 22%, rgba(255,144,196,0.28) 48%, rgba(255,110,182,0.1) 68%, transparent 82%)",
        inner:
          "radial-gradient(circle at 50% 48%, rgba(255,255,255,0.92) 0%, rgba(255,233,244,0.72) 46%, transparent 78%)",
      };

    case "moon":
      return {
        backdrop:
          "radial-gradient(circle at 50% 55%, rgba(6,10,22,0.34) 0%, rgba(6,10,22,0.2) 44%, transparent 78%)",
        outer:
          "radial-gradient(circle at 50% 52%, rgba(255,255,255,0.96) 0%, rgba(199,236,255,0.62) 24%, rgba(110,196,255,0.3) 48%, rgba(90,120,255,0.1) 68%, transparent 84%)",
        inner:
          "radial-gradient(circle at 50% 48%, rgba(255,255,255,0.98) 0%, rgba(240,249,255,0.82) 42%, transparent 76%)",
      };

    case "oak":
      return {
        backdrop:
          "radial-gradient(circle at 50% 55%, rgba(10,12,6,0.3) 0%, rgba(10,12,6,0.18) 42%, transparent 76%)",
        outer:
          "radial-gradient(circle at 50% 52%, rgba(244,255,214,0.58) 0%, rgba(168,214,88,0.34) 24%, rgba(88,132,36,0.18) 52%, transparent 82%)",
        inner:
          "radial-gradient(circle at 50% 48%, rgba(245,255,224,0.54) 0%, rgba(212,255,168,0.26) 42%, transparent 76%)",
      };

    case "firefly":
      return {
        backdrop:
          "radial-gradient(circle at 50% 55%, rgba(14,12,4,0.34) 0%, rgba(14,12,4,0.2) 44%, transparent 78%)",
        outer:
          "radial-gradient(circle at 50% 52%, rgba(255,252,204,0.94) 0%, rgba(249,255,122,0.68) 22%, rgba(169,255,76,0.3) 48%, rgba(74,160,54,0.1) 68%, transparent 84%)",
        inner:
          "radial-gradient(circle at 50% 48%, rgba(255,255,236,0.98) 0%, rgba(255,249,186,0.82) 42%, transparent 76%)",
      };

    case "silver":
      return {
        backdrop:
          "radial-gradient(circle at 50% 55%, rgba(8,12,18,0.3) 0%, rgba(8,12,18,0.18) 44%, transparent 78%)",
        outer:
          "radial-gradient(circle at 50% 52%, rgba(255,255,255,0.92) 0%, rgba(226,236,246,0.56) 22%, rgba(174,190,214,0.26) 48%, rgba(130,146,172,0.1) 68%, transparent 84%)",
        inner:
          "radial-gradient(circle at 50% 48%, rgba(255,255,255,0.98) 0%, rgba(248,251,255,0.78) 40%, transparent 74%)",
      };
  }
}

function TrunkName({
  label,
  bottom,
  height,
  width,
}: {
  label?: string;
  bottom: string | number;
  height: number;
  width: number;
}) {
  if (!label) return null;

  const usableHeight = Math.max(16, height - 8);
  const sizeFromTrunk = width * 1.15 + height * 0.03;
  const sizeFromLength = usableHeight / Math.max(2.4, label.length * 0.9);
  const fontSize = Math.max(5, Math.min(18, sizeFromTrunk, sizeFromLength));
  const letterSpacing = Math.max(0, Math.min(1.2, fontSize * 0.05));
  const labelWidth = Math.max(width + 6, fontSize + 2);

  return (
    <div
      className="pointer-events-none absolute left-1/2 flex items-center justify-center font-semibold text-white/80"
      style={{
        bottom,
        width: `${labelWidth}px`,
        height: `${height}px`,
        transform: "translateX(-50%) rotate(180deg)",
        writingMode: "vertical-rl",
        textOrientation: "mixed",
        fontSize: `${fontSize}px`,
        letterSpacing: `${letterSpacing}px`,
        lineHeight: 1,
        textShadow: "0 1px 2px rgba(0,0,0,0.55)",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
      aria-hidden="true"
    >
      {label}
    </div>
  );
}

const TREE_SIZE_MULTIPLIER = 1.35;

function ForestSpot({
  stage,
  variant,
  label,
}: {
  stage: number;
  variant: TreeKey;
  label?: string;
}) {
  const motion = TREE_MOTION[clampStage(stage)];
  const effects = HERO_EFFECTS[variant];

  const swayAmount = motion.sway * effects.sway;
  const bobAmount = motion.bob * effects.sway;

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative h-[28rem] w-[16rem] overflow-visible md:h-[32rem] md:w-[18rem]">
        <div
          className="absolute bottom-0 left-1/2 origin-bottom"
          style={{
            transform: `translateX(-50%) scale(${TREE_SIZE_MULTIPLIER})`,
          }}
        >
          <div className="relative h-[28rem] w-[16rem] md:h-[32rem] md:w-[18rem]">
            <div className="absolute bottom-[1.25rem] left-1/2 h-8 w-28 -translate-x-1/2 rounded-full bg-slate-950/25 blur-lg" />
            {stage >= 4 && <GroundPatch variant={variant} />}

            <div
              className="absolute inset-0 origin-bottom"
              style={
                swayAmount > 0.02
                  ? ({
                      ...animationStyle(
                        "heroTreeSway",
                        `${motion.duration}s`,
                        "ease-in-out",
                        TREE_PHASE_DELAY[variant]
                      ),
                      transformOrigin: "center bottom",
                      ["--hero-sway" as any]: `${swayAmount}deg`,
                      ["--hero-bob" as any]: `${bobAmount}px`,
                    } as CSSProperties)
                  : undefined
              }
            >
              <TreeGrowth stage={stage} variant={variant} label={label} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getStarRayLayers(
  profile: StarProfile,
  cfg: { ray: number },
  rayThickness: number
) {
  const base = profile.rotate;

  switch (profile.rayMode) {
    case "regal":
      return [
        {
          width: Math.round(cfg.ray * 1.18),
          height: rayThickness,
          angle: base,
          opacity: 0.94,
          blur: 0.55,
          duration: Math.max(2.6, profile.twinkleDuration - 0.9),
        },
        {
          width: rayThickness,
          height: Math.round(cfg.ray * 1.18),
          angle: base,
          opacity: 0.94,
          blur: 0.55,
          duration: Math.max(2.6, profile.twinkleDuration - 0.9),
        },
        {
          width: Math.round(cfg.ray * 0.9),
          height: Math.max(1, rayThickness - 1),
          angle: 45 + base,
          opacity: 0.72,
          blur: 0.75,
          duration: Math.max(3.1, profile.twinkleDuration),
        },
        {
          width: Math.max(1, rayThickness - 1),
          height: Math.round(cfg.ray * 0.9),
          angle: 45 + base,
          opacity: 0.72,
          blur: 0.75,
          duration: Math.max(3.1, profile.twinkleDuration),
        },
      ];

    case "soft":
      return [
        {
          width: Math.round(cfg.ray * 0.68),
          height: rayThickness + 1,
          angle: base + 10,
          opacity: 0.26,
          blur: 1.2,
          duration: Math.max(3.6, profile.twinkleDuration + 0.4),
        },
        {
          width: rayThickness + 1,
          height: Math.round(cfg.ray * 0.68),
          angle: base - 6,
          opacity: 0.26,
          blur: 1.2,
          duration: Math.max(3.6, profile.twinkleDuration + 0.4),
        },
      ];

    case "petal":
      return [
        {
          width: Math.round(cfg.ray * 0.72),
          height: rayThickness,
          angle: base,
          opacity: 0.52,
          blur: 0.95,
          duration: Math.max(3.0, profile.twinkleDuration - 0.2),
        },
        {
          width: rayThickness,
          height: Math.round(cfg.ray * 0.72),
          angle: base,
          opacity: 0.52,
          blur: 0.95,
          duration: Math.max(3.0, profile.twinkleDuration - 0.2),
        },
        {
          width: Math.round(cfg.ray * 0.62),
          height: Math.max(1, rayThickness - 1),
          angle: 30 + base,
          opacity: 0.42,
          blur: 1.0,
          duration: Math.max(3.3, profile.twinkleDuration + 0.3),
        },
        {
          width: Math.max(1, rayThickness - 1),
          height: Math.round(cfg.ray * 0.62),
          angle: 60 + base,
          opacity: 0.42,
          blur: 1.0,
          duration: Math.max(3.3, profile.twinkleDuration + 0.3),
        },
      ];

    case "crystal":
      return [
        {
          width: Math.round(cfg.ray * 1.06),
          height: Math.max(1, rayThickness - 1),
          angle: base,
          opacity: 0.84,
          blur: 0.45,
          duration: Math.max(2.8, profile.twinkleDuration - 0.7),
        },
        {
          width: Math.max(1, rayThickness - 1),
          height: Math.round(cfg.ray * 1.06),
          angle: base,
          opacity: 0.84,
          blur: 0.45,
          duration: Math.max(2.8, profile.twinkleDuration - 0.7),
        },
        {
          width: Math.round(cfg.ray * 0.84),
          height: Math.max(1, rayThickness - 1),
          angle: 45 + base,
          opacity: 0.7,
          blur: 0.55,
          duration: Math.max(3.1, profile.twinkleDuration),
        },
        {
          width: Math.max(1, rayThickness - 1),
          height: Math.round(cfg.ray * 0.84),
          angle: 45 + base,
          opacity: 0.7,
          blur: 0.55,
          duration: Math.max(3.1, profile.twinkleDuration),
        },
        {
          width: Math.round(cfg.ray * 0.62),
          height: 1,
          angle: 22 + base,
          opacity: 0.46,
          blur: 0.35,
          duration: Math.max(3.4, profile.twinkleDuration + 0.2),
        },
        {
          width: Math.round(cfg.ray * 0.62),
          height: 1,
          angle: 68 + base,
          opacity: 0.46,
          blur: 0.35,
          duration: Math.max(3.4, profile.twinkleDuration + 0.2),
        },
      ];

    case "sturdy":
      return [
        {
          width: Math.round(cfg.ray * 0.78),
          height: rayThickness + 1,
          angle: base,
          opacity: 0.78,
          blur: 0.5,
          duration: Math.max(3.1, profile.twinkleDuration),
        },
        {
          width: rayThickness + 1,
          height: Math.round(cfg.ray * 0.78),
          angle: base,
          opacity: 0.78,
          blur: 0.5,
          duration: Math.max(3.1, profile.twinkleDuration),
        },
      ];

    case "ember":
      return [
        {
          width: Math.round(cfg.ray * 0.52),
          height: Math.max(1, rayThickness - 1),
          angle: 30 + base,
          opacity: 0.44,
          blur: 0.9,
          duration: Math.max(2.3, profile.twinkleDuration - 0.8),
        },
        {
          width: Math.max(1, rayThickness - 1),
          height: Math.round(cfg.ray * 0.52),
          angle: 58 + base,
          opacity: 0.36,
          blur: 0.95,
          duration: Math.max(2.5, profile.twinkleDuration - 0.5),
        },
      ];

    case "frost":
      return [
        {
          width: Math.round(cfg.ray * 1.02),
          height: Math.max(1, rayThickness - 1),
          angle: base,
          opacity: 0.8,
          blur: 0.45,
          duration: Math.max(2.9, profile.twinkleDuration - 0.8),
        },
        {
          width: Math.max(1, rayThickness - 1),
          height: Math.round(cfg.ray * 1.02),
          angle: base,
          opacity: 0.8,
          blur: 0.45,
          duration: Math.max(2.9, profile.twinkleDuration - 0.8),
        },
        {
          width: Math.round(cfg.ray * 0.86),
          height: 1,
          angle: 45 + base,
          opacity: 0.68,
          blur: 0.4,
          duration: Math.max(3.2, profile.twinkleDuration),
        },
        {
          width: 1,
          height: Math.round(cfg.ray * 0.86),
          angle: 45 + base,
          opacity: 0.68,
          blur: 0.4,
          duration: Math.max(3.2, profile.twinkleDuration),
        },
        {
          width: Math.round(cfg.ray * 0.54),
          height: 1,
          angle: 22 + base,
          opacity: 0.46,
          blur: 0.3,
          duration: Math.max(3.5, profile.twinkleDuration + 0.2),
        },
        {
          width: Math.round(cfg.ray * 0.54),
          height: 1,
          angle: 68 + base,
          opacity: 0.46,
          blur: 0.3,
          duration: Math.max(3.5, profile.twinkleDuration + 0.2),
        },
      ];
  }
}

function getSatelliteStyle(
  profile: StarProfile,
  satellite: { size: number },
  index: number,
  stage: StarStage,
  cfg: { halo: number },
  variant: TreeKey
): CSSProperties {
  const size = satellite.size + Math.floor(stage / 2);
  const glow = `0 0 ${Math.round(cfg.halo * 0.45)}px ${profile.glowColor}`;

  switch (profile.satelliteMode) {
    case "crown":
      return {
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "999px",
        background:
          "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.98), rgba(255,236,176,0.95) 48%, rgba(255,205,96,0.9) 100%)",
        boxShadow: glow,
        opacity: 0.56 + stage * 0.05,
        animation: `heroStarSparkle ${2.5 + index * 0.32}s ease-in-out ${-index * 0.28}s infinite`,
      };

    case "droplet":
      return {
        width: `${Math.max(4, size - 1)}px`,
        height: `${size + 4}px`,
        borderRadius: "999px 999px 70% 70%",
        background: `linear-gradient(to bottom, rgba(255,255,255,0.88), ${profile.coreColor})`,
        boxShadow: glow,
        opacity: 0.4 + stage * 0.045,
        filter: "blur(0.15px)",
        animation: `heroStarSparkle ${3.4 + index * 0.28}s ease-in-out ${-index * 0.22}s infinite`,
      };

    case "petals":
      return {
        width: `${size + 4}px`,
        height: `${size}px`,
        borderRadius: "999px",
        background: `radial-gradient(circle at 50% 40%, rgba(255,255,255,0.94), ${profile.coreColor} 70%)`,
        boxShadow: glow,
        opacity: 0.5 + stage * 0.05,
        transform: `rotate(${index % 2 === 0 ? -26 : 26}deg)`,
        animation: `heroStarSparkle ${2.8 + index * 0.26}s ease-in-out ${-index * 0.3}s infinite`,
      };

    case "orbit":
      return {
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "999px",
        background: "rgba(255,255,255,0.14)",
        border: `1px solid ${profile.rayColor}`,
        boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.18), ${glow}`,
        opacity: 0.46 + stage * 0.045,
        animation: `heroStarSparkle ${3.6 + index * 0.3}s ease-in-out ${-index * 0.35}s infinite`,
      };

    case "acorns":
      return {
        width: `${size}px`,
        height: `${size + 2}px`,
        borderRadius: "45% 45% 60% 60%",
        background:
          "linear-gradient(to bottom, rgba(156,104,58,0.98), rgba(104,64,28,0.98))",
        boxShadow: `0 0 ${Math.round(cfg.halo * 0.22)}px rgba(88,52,26,0.38)`,
        opacity: 0.52 + stage * 0.04,
        animation: `heroStarSparkle ${3.2 + index * 0.35}s ease-in-out ${-index * 0.24}s infinite`,
      };

    case "fireflies":
      return {
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "999px",
        background: "rgba(255,255,220,0.98)",
        boxShadow: `0 0 ${Math.round(cfg.halo * 0.62)}px ${profile.glowColor}`,
        filter: "blur(0.28px)",
        opacity: 0.46 + stage * 0.06,
        animation: `heroStarSparkle ${2.0 + index * 0.22}s ease-in-out ${-index * 0.4}s infinite`,
      };

    case "shards":
      return {
        width: `${size}px`,
        height: `${size + 2}px`,
        clipPath: PAPER_CRYSTAL,
        background: `linear-gradient(to bottom, rgba(255,255,255,0.98), ${profile.coreColor})`,
        boxShadow: glow,
        opacity: 0.48 + stage * 0.05,
        animation: `heroStarSparkle ${2.9 + index * 0.3}s ease-in-out ${-index * 0.3}s infinite`,
      };

    default:
      return {
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "999px",
        background: variant === "moon" ? profile.rayColor : profile.coreColor,
        boxShadow: glow,
        opacity: 0.42 + stage * 0.06,
      };
  }
}

function TreeStar({
  stage,
  variant,
  cyclePhase,
  left,
  bottom,
}: {
  stage: StarStage;
  variant: TreeKey;
  cyclePhase: number;
  left: string;
  bottom: string;
}) {
  if (stage === 0) return null;

  const profile = STAR_PROFILES[variant];
  const cfg = STAR_STAGE_STYLE[stage];

  const nightRise = Math.min(1, Math.max(0, (cyclePhase - 0.42) / 0.14));
  const nightFall = 1 - Math.min(1, Math.max(0, (cyclePhase - 0.9) / 0.08));
  const nightStrength = Math.max(0, Math.min(1, nightRise * nightFall));

  if (nightStrength <= 0.02) return null;

  const shellSize = cfg.size * 4;
  const rayThickness = Math.max(2, Math.round(cfg.size * 0.14));
  const visibleSatellites = profile.satellites.slice(0, cfg.satellites);
  const rayLayers = getStarRayLayers(profile, cfg, rayThickness);

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left,
        bottom,
        transform: "translate(-50%, 50%)",
        opacity: nightStrength,
      }}
      aria-hidden="true"
    >
      <div
        className="relative"
        style={{
          width: `${shellSize}px`,
          height: `${shellSize}px`,
        }}
      >
        <div
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: `${cfg.halo * 2}px`,
            height: `${cfg.halo * 2}px`,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${profile.glowColor} 0%, rgba(255,255,255,0.12) 28%, transparent 72%)`,
            filter: `blur(${Math.round(cfg.halo * 0.42)}px)`,
            opacity: cfg.glowOpacity,
            animation: `heroStarPulse ${profile.twinkleDuration}s ease-in-out ${profile.delay} infinite`,
          }}
        />

        {rayLayers.map((ray, index) => {
          const horizontal = ray.width >= ray.height;

          return (
            <div
              key={`ray-${variant}-${index}`}
              className="absolute left-1/2 top-1/2"
              style={{
                width: `${ray.width}px`,
                height: `${ray.height}px`,
                transform: `translate(-50%, -50%) rotate(${ray.angle}deg)`,
                background: horizontal
                  ? `linear-gradient(to right, transparent, ${profile.rayColor}, transparent)`
                  : `linear-gradient(to bottom, transparent, ${profile.rayColor}, transparent)`,
                filter: `blur(${ray.blur}px)`,
                opacity: ray.opacity,
                animation: `heroStarRayPulse ${ray.duration}s ease-in-out ${profile.delay} infinite`,
              }}
            />
          );
        })}

        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: `${cfg.size}px`,
            height: `${cfg.size}px`,
            transform: `translate(-50%, -50%) rotate(${profile.rotate}deg)`,
            clipPath:
              "polygon(50% 0%, 61% 38%, 98% 38%, 68% 58%, 79% 96%, 50% 74%, 21% 96%, 32% 58%, 2% 38%, 39% 38%)",
            background: `radial-gradient(circle at 50% 42%, rgba(255,255,255,0.98) 0%, ${profile.coreColor} 45%, ${profile.rayColor} 100%)`,
            boxShadow: `0 0 ${cfg.halo}px ${profile.glowColor}`,
            animation: `heroStarFlicker ${Math.max(
              3.2,
              profile.twinkleDuration - 1.2
            )}s ease-in-out ${profile.delay} infinite`,
          }}
        />

                {stage >= 1 && (
          <div
            className="absolute left-1/2 top-1/2 flex items-center justify-center uppercase"
            style={{
              width: `${cfg.size * 0.82}px`,
              height: `${cfg.size * 0.82}px`,
              transform: "translate(-50%, -50%)",
              fontSize: `${Math.max(6, Math.round(cfg.size * 0.22))}px`,
              lineHeight: 1,
              fontFamily: '"Cinzel", "Times New Roman", serif', 
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "rgba(44, 34, 12, 0.92)",
              textShadow:
                "0 0 1px rgba(255,255,255,0.45), 0 1px 2px rgba(255,255,255,0.35)",
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            {profile.initials}
          </div>
        )}

        {visibleSatellites.map((satellite, index) => (
          <div
            key={`satellite-${variant}-${index}`}
            className="absolute"
            style={{
              left: satellite.left,
              bottom: satellite.bottom,
              ...getSatelliteStyle(profile, satellite, index, stage, cfg, variant),
            }}
          />
        ))}
      </div>
    </div>
  );
}

function GroundPatch({ variant }: { variant: TreeKey }) {
  return (
    <>
      <div className="absolute bottom-[1.55rem] left-1/2 h-6 w-22 -translate-x-1/2 rounded-[999px] bg-[#1e1712]/32 blur-lg" />
      <div
        className="absolute bottom-[1.7rem] left-1/2 h-9 w-24 -translate-x-1/2 bg-[linear-gradient(to_bottom,_#6e4a31,_#543623_56%,_#342116_100%)]"
        style={{
          clipPath:
            "polygon(10% 64%, 20% 32%, 42% 12%, 70% 16%, 88% 42%, 84% 76%, 60% 92%, 20% 88%)",
          boxShadow: "0 10px 18px rgba(35, 20, 10, 0.22)",
        }}
      />
      <div
        className="absolute bottom-[2.35rem] left-1/2 h-4 w-18 -translate-x-1/2 bg-white/8"
        style={{
          clipPath:
            "polygon(12% 66%, 22% 34%, 46% 12%, 72% 22%, 88% 48%, 82% 74%, 58% 88%, 20% 84%)",
          filter: "blur(1.5px)",
        }}
      />
    </>
  );
}

function TreeGrowth({
  stage,
  variant,
  label,
}: {
  stage: number;
  variant: TreeKey;
  label?: string;
}) {
  const s = clampStage(stage);

  if (s === 1) return <PaperBud variant={variant} label={label} />;
  if (s === 2) return <PaperSprout variant={variant} label={label} />;
  if (s === 3) return <PaperSapling variant={variant} label={label} />;

  return <PaperCanopyTree stage={s} variant={variant} label={label} />;
}

function PaperBud({
  variant,
  label,
}: {
  variant: TreeKey;
  label?: string;
}) {
  const p = PALETTES[variant];

  return (
    <>
      <div className={`absolute bottom-[4.55rem] left-1/2 h-8 w-[0.35rem] -translate-x-1/2 rounded-full ${p.trunk}`} />
      <TrunkName label={label} bottom="4.55rem" height={32} width={6} />
      <div className={`absolute bottom-[5.65rem] left-1/2 h-8 w-8 -translate-x-1/2 rounded-full ${p.glow} blur-xl opacity-80`} />
      <div
        className={`absolute bottom-[5.9rem] left-[44%] h-4 w-7 ${p.leaf1}`}
        style={{ clipPath: PAPER_SEED, transform: "rotate(-18deg)" }}
      />
      <div
        className={`absolute bottom-[6rem] left-[50%] h-4 w-7 ${p.leaf2}`}
        style={{ clipPath: PAPER_SEED, transform: "rotate(20deg)" }}
      />
    </>
  );
}

function PaperSprout({
  variant,
  label,
}: {
  variant: TreeKey;
  label?: string;
}) {
  const p = PALETTES[variant];

  return (
    <>
      <div className={`absolute bottom-[4.45rem] left-1/2 h-12 w-[0.45rem] -translate-x-1/2 rounded-full ${p.trunk}`} />
      <TrunkName label={label} bottom="4.45rem" height={48} width={7} />
      <div className={`absolute bottom-[6.3rem] left-1/2 h-10 w-10 -translate-x-1/2 rounded-full ${p.glow} blur-xl opacity-80`} />
      <div
        className={`absolute bottom-[6rem] left-[41%] h-5 w-9 ${p.leaf1}`}
        style={{ clipPath: PAPER_SEED, transform: "rotate(-22deg)" }}
      />
      <div
        className={`absolute bottom-[6.8rem] left-[50%] h-5 w-9 ${p.leaf2}`}
        style={{ clipPath: PAPER_SEED, transform: "rotate(24deg)" }}
      />
      <div
        className={`absolute bottom-[7.55rem] left-[46.8%] h-4 w-7 ${p.leaf3}`}
        style={{ clipPath: PAPER_SEED }}
      />
    </>
  );
}

function PaperSapling({
  variant,
  label,
}: {
  variant: TreeKey;
  label?: string;
}) {
  const p = PALETTES[variant];
  const willow = variant === "willow";
  const saplingScale = 0.82;

  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0 origin-bottom"
        style={{
          transform: `scale(${saplingScale})`,
        }}
      >
        <div className={`absolute bottom-[4.2rem] left-1/2 h-20 w-[0.55rem] -translate-x-1/2 rounded-full ${p.trunk}`} />
        <TrunkName label={label} bottom="4.2rem" height={80} width={9} />
        <div className="absolute bottom-[8.8rem] left-1/2 h-8 w-[2px] -translate-x-1/2 bg-[#61402b]/80 rotate-[28deg]" />
        <div className="absolute bottom-[9rem] left-1/2 h-8 w-[2px] -translate-x-1/2 bg-[#61402b]/80 -rotate-[30deg]" />
        <div className={`absolute bottom-[8.8rem] left-1/2 h-14 w-16 -translate-x-1/2 rounded-full ${p.glow} blur-2xl opacity-85`} />
        <div
          className={`absolute bottom-[8.4rem] left-[38%] h-8 w-12 ${p.leaf1}`}
          style={{ clipPath: PAPER_CLOUD, transform: "rotate(-12deg)" }}
        />
        <div
          className={`absolute bottom-[10rem] left-[50%] h-8 w-12 ${p.leaf2}`}
          style={{ clipPath: PAPER_CLOUD, transform: "rotate(12deg)" }}
        />
        <div
          className={`absolute bottom-[10.8rem] left-[44%] h-8 w-12 ${p.leaf3}`}
          style={{ clipPath: PAPER_FAN }}
        />
        {willow && (
          <>
            <div
              className={`absolute bottom-[8.3rem] left-[39%] h-12 w-[7px] ${p.leaf2} opacity-80`}
              style={{ clipPath: PAPER_DRAPE }}
            />
            <div
              className={`absolute bottom-[8.7rem] left-[58%] h-12 w-[7px] ${p.leaf1} opacity-80`}
              style={{ clipPath: PAPER_DRAPE }}
            />
          </>
        )}
      </div>
    </div>
  );
}

function PaperCanopyTree({
  stage,
  variant,
  label,
}: {
  stage: number;
  variant: TreeKey;
  label?: string;
}) {
  const p = PALETTES[variant];
  const glowPalette = getHeroGlow(variant);
  const cfg = PAPER_STAGE[stage];
  const motion = TREE_MOTION[clampStage(stage)];
  const effects = HERO_EFFECTS[variant];
  const profile = getSpeciesProfile(variant, p);

  const layers = profile.layers.slice(0, cfg.layerCount);
  const backLayers = layers.slice(0, Math.max(1, cfg.layerCount - 2));
  const frontLayers = layers.slice(Math.max(1, cfg.layerCount - 2));

  const glowStrength = motion.glow * effects.glow;
  const parallaxStrength = motion.layer * effects.parallax;
  const particleStrength = motion.particle * effects.particles;

  const outerGlowOpacity = Math.min(
    1,
    profile.glow.opacity + 0.16 + glowStrength * 0.22
  );

  return (
    <div
      className="absolute bottom-[2.5rem] left-1/2 -translate-x-1/2"
      style={{
        width: `${scalePx(260, cfg.scale)}px`,
        height: `${scalePx(360, cfg.scale)}px`,
      }}
    >
      <div
        className={`absolute left-1/2 bottom-0 ${p.trunk}`}
        style={{
          width: `${cfg.trunkWidth}px`,
          height: `${cfg.trunkHeight}px`,
          transform: "translateX(-50%)",
          clipPath:
            "polygon(20% 100%, 10% 58%, 22% 18%, 38% 0, 62% 0, 78% 18%, 90% 58%, 80% 100%)",
          boxShadow: "0 16px 24px rgba(0,0,0,0.24)",
        }}
      />

      {profile.branches.map((branch, i) => (
        <div
          key={`branch-${i}`}
          className={`absolute ${p.trunk}`}
          style={{
            left: `calc(50% + ${scalePx(branch.x, cfg.scale)}px)`,
            bottom: `${scalePx(branch.bottom, cfg.scale)}px`,
            width: `${Math.max(3, scalePx(branch.width, cfg.scale))}px`,
            height: `${scalePx(branch.height, cfg.scale)}px`,
            transform: `rotate(${branch.rotate}deg)`,
            transformOrigin: "bottom center",
            clipPath: "polygon(18% 100%, 0 16%, 46% 0, 100% 14%, 82% 100%)",
          }}
        />
      ))}

      <TrunkName
        label={label}
        bottom={0}
        height={cfg.trunkHeight}
        width={cfg.trunkWidth}
      />

      {backLayers.map((layer, index) => (
        <LayeredBlob
          key={`back-${index}`}
          tone={layer.tone}
          x={scalePx(layer.x, cfg.scale)}
          bottom={scalePx(layer.bottom, cfg.scale)}
          width={scalePx(layer.width, cfg.scale)}
          height={scalePx(layer.height, cfg.scale)}
          rotate={layer.rotate}
          shape={layer.shape}
          opacity={layer.opacity}
          motionLevel={parallaxStrength}
          index={index}
        />
      ))}

      <div
        className="absolute left-1/2"
        style={{
          bottom: `${scalePx(profile.glow.bottom - 8, cfg.scale)}px`,
          width: `${scalePx(profile.glow.width * 2.1, cfg.scale)}px`,
          height: `${scalePx(profile.glow.height * 1.9, cfg.scale)}px`,
          transform: "translateX(-50%)",
          background: glowPalette.backdrop,
          filter: "blur(26px)",
          opacity: 0.95,
        }}
      />

      <div
        className="absolute left-1/2"
        style={
          {
            bottom: `${scalePx(profile.glow.bottom - 2, cfg.scale)}px`,
            width: `${scalePx(profile.glow.width * 1.85, cfg.scale)}px`,
            height: `${scalePx(profile.glow.height * 1.65, cfg.scale)}px`,
            transform: "translateX(-50%)",
            background: glowPalette.outer,
            filter: "blur(36px) saturate(145%)",
            opacity: outerGlowOpacity,
            animationName: glowStrength > 0.01 ? "heroGlowPulse" : undefined,
            animationDuration:
              glowStrength > 0.01
                ? `${6.8 - Math.min(1.2, glowStrength * 3)}s`
                : undefined,
            animationTimingFunction: glowStrength > 0.01 ? "ease-in-out" : undefined,
            animationIterationCount: glowStrength > 0.01 ? "infinite" : undefined,
            animationDelay: glowStrength > 0.01 ? TREE_PHASE_DELAY[variant] : undefined,
            ["--glow-opacity" as any]: outerGlowOpacity,
            ["--glow-grow" as any]: 0.03 + glowStrength * 0.35,
          } as CSSProperties
        }
      />

      <div
        className="absolute left-1/2"
        style={{
          bottom: `${scalePx(profile.glow.bottom + 6, cfg.scale)}px`,
          width: `${scalePx(profile.glow.width * 1.15, cfg.scale)}px`,
          height: `${scalePx(profile.glow.height * 1.0, cfg.scale)}px`,
          transform: "translateX(-50%)",
          background: glowPalette.inner,
          filter: "blur(13px)",
          opacity: 0.92,
        }}
      />

      <InterLayerParticles
        variant={variant}
        scale={cfg.scale}
        count={cfg.particleCount}
        particleStrength={particleStrength}
      />

      <PaperSpeciesAccents variant={variant} scale={cfg.scale} />

      {frontLayers.map((layer, index) => (
        <LayeredBlob
          key={`front-${index}`}
          tone={layer.tone}
          x={scalePx(layer.x, cfg.scale)}
          bottom={scalePx(layer.bottom, cfg.scale)}
          width={scalePx(layer.width, cfg.scale)}
          height={scalePx(layer.height, cfg.scale)}
          rotate={layer.rotate}
          shape={layer.shape}
          opacity={layer.opacity}
          motionLevel={parallaxStrength}
          index={index + 2}
        />
      ))}
    </div>
  );
}

function LayeredBlob({
  tone,
  x,
  bottom,
  width,
  height,
  rotate = 0,
  shape,
  opacity = 1,
  motionLevel = 0,
  index = 0,
}: {
  tone: string;
  x: number;
  bottom: number;
  width: number;
  height: number;
  rotate?: number;
  shape: string;
  opacity?: number;
  motionLevel?: number;
  index?: number;
}) {
  const animated = motionLevel > 0.04;

  return (
    <div
      className={`absolute ${tone}`}
      style={
        animated
          ? ({
              left: `calc(50% + ${x}px)`,
              bottom: `${bottom}px`,
              width: `${width}px`,
              height: `${height}px`,
              opacity,
              clipPath: shape,
              boxShadow: "0 16px 24px rgba(8, 12, 10, 0.18)",
              border: "1px solid rgba(255,255,255,0.12)",
              transformOrigin: "center bottom",
              ...animationStyle(
                "paperLayerSway",
                `${7.8 - motionLevel * 1.2 + index * 0.18}s`,
                "ease-in-out",
                `${-0.65 * index}s`
              ),
              ["--layer-rotate" as any]: `${rotate}deg`,
              ["--layer-sway" as any]: `${0.18 + motionLevel * 0.5 + index * 0.04}deg`,
              ["--layer-lift" as any]: `${0.3 + motionLevel * 0.9}px`,
            } as CSSProperties)
          : {
              left: `calc(50% + ${x}px)`,
              bottom: `${bottom}px`,
              width: `${width}px`,
              height: `${height}px`,
              opacity,
              transform: `translateX(-50%) rotate(${rotate}deg)`,
              clipPath: shape,
              boxShadow: "0 16px 24px rgba(8, 12, 10, 0.18)",
              border: "1px solid rgba(255,255,255,0.12)",
            }
      }
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.18), rgba(255,255,255,0.04) 24%, rgba(0,0,0,0.14) 100%)",
          mixBlendMode: "screen",
          opacity: 0.65,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          boxShadow: "inset 0 -18px 24px rgba(0,0,0,0.12), inset 0 2px 6px rgba(255,255,255,0.08)",
        }}
      />
      <div
        className="absolute inset-[2px]"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.18)",
          opacity: 0.7,
        }}
      />
    </div>
  );
}

function InterLayerParticles({
  variant,
  scale,
  count,
  particleStrength = 0,
}: {
  variant: TreeKey;
  scale: number;
  count: number;
  particleStrength?: number;
}) {
  if (particleStrength <= 0.08) return null;

  const glow =
    variant === "firefly"
      ? "rgba(255,245,170,0.95)"
      : variant === "moon" || variant === "silver"
      ? "rgba(255,255,255,0.88)"
      : variant === "blossom"
      ? "rgba(255,236,244,0.84)"
      : "rgba(255,236,190,0.58)";

  const visibleCount = Math.max(
    1,
    Math.min(count, Math.round(count * Math.min(1, particleStrength / 3.5)) + 2)
  );

  return (
    <>
      {PAPER_PARTICLES.slice(0, visibleCount).map((particle, index) => {
        const shard = variant === "blossom" ? false : index % 3 === 0;

        return (
          <div
            key={`particle-${index}`}
            className="absolute"
            style={
              {
                left: particle.left,
                bottom: particle.bottom,
                width: `${scalePx(particle.size, scale)}px`,
                height: `${scalePx(particle.size, scale)}px`,
                background: glow,
                boxShadow: `0 0 ${scalePx(16, scale)}px ${glow}`,
                borderRadius: shard ? "2px" : "999px",
                filter: "blur(0.35px)",
                ...animationStyle(
                  "heroParticleFloat",
                  `${
                    5.8 - Math.min(2.2, particleStrength * 0.24) + (index % 4) * 0.2
                  }s`,
                  "ease-in-out",
                  particle.delay
                ),
                ["--particle-opacity" as any]: particle.opacity,
                ["--particle-rise" as any]: `${0.9 + particleStrength * 0.7}px`,
                ["--particle-drift" as any]: `${
                  (index % 2 === 0 ? 1 : -1) * (0.6 + particleStrength * 0.22)
                }px`,
              } as CSSProperties
            }
          />
        );
      })}
    </>
  );
}

function PaperSpeciesAccents({
  variant,
  scale,
}: {
  variant: TreeKey;
  scale: number;
}) {
  const p = PALETTES[variant];

  if (variant === "willow") {
    return (
      <>
        {[
          { left: "19%", bottom: "34%", h: 96 },
          { left: "27%", bottom: "39%", h: 82 },
          { left: "36%", bottom: "44%", h: 68 },
          { left: "64%", bottom: "45%", h: 74 },
          { left: "73%", bottom: "39%", h: 88 },
          { left: "81%", bottom: "33%", h: 100 },
        ].map((strand, i) => (
          <div
            key={`willow-${i}`}
            className={`absolute ${i % 2 === 0 ? p.leaf2 : p.leaf1}`}
            style={{
              left: strand.left,
              bottom: strand.bottom,
              width: `${scalePx(10, scale)}px`,
              height: `${scalePx(strand.h, scale)}px`,
              clipPath: PAPER_DRAPE,
              opacity: 0.9,
              filter: "drop-shadow(0 8px 10px rgba(0,0,0,0.12))",
            }}
          />
        ))}
      </>
    );
  }

  if (variant === "oak") {
    return (
      <>
        <div
          className={`absolute left-1/2 ${p.leaf1}`}
          style={{
            bottom: "39%",
            width: `${scalePx(168, scale)}px`,
            height: `${scalePx(38, scale)}px`,
            transform: "translateX(-50%)",
            clipPath: PAPER_SHELF,
            opacity: 0.9,
          }}
        />
        {[
          { left: "36%", bottom: "35%" },
          { left: "50%", bottom: "32%" },
          { left: "64%", bottom: "36%" },
        ].map((acorn, i) => (
          <div
            key={`oak-${i}`}
            className="absolute rounded-b-full rounded-t-[45%] bg-[#8b5a34]"
            style={{
              left: acorn.left,
              bottom: acorn.bottom,
              width: `${scalePx(10, scale)}px`,
              height: `${scalePx(13, scale)}px`,
              boxShadow: "0 0 8px rgba(80,45,20,0.24)",
            }}
          />
        ))}
      </>
    );
  }

  if (variant === "blossom") {
    return (
      <>
        <div
          className="absolute left-1/2 rounded-full bg-pink-100/22"
          style={{
            bottom: "58%",
            width: `${scalePx(126, scale)}px`,
            height: `${scalePx(58, scale)}px`,
            transform: "translateX(-50%)",
            filter: "blur(12px)",
          }}
        />
        {[
          { left: "30%", bottom: "72%", size: 8, cls: "bg-white/90" },
          { left: "39%", bottom: "81%", size: 7, cls: "bg-rose-50/95" },
          { left: "48%", bottom: "77%", size: 8, cls: "bg-pink-50/95" },
          { left: "58%", bottom: "69%", size: 7, cls: "bg-rose-50/95" },
          { left: "65%", bottom: "74%", size: 8, cls: "bg-white/85" },
          { left: "43%", bottom: "61%", size: 6, cls: "bg-pink-50/95" },
        ].map((petal, i) => (
          <div
            key={`petal-${i}`}
            className={`absolute rounded-full ${petal.cls}`}
            style={{
              left: petal.left,
              bottom: petal.bottom,
              width: `${scalePx(petal.size, scale)}px`,
              height: `${scalePx(petal.size, scale)}px`,
              boxShadow: "0 0 12px rgba(255,243,248,0.34)",
            }}
          />
        ))}
      </>
    );
  }

  if (variant === "moon") {
    return (
      <>
        <div
          className="absolute left-[59%] rounded-full border border-white/60 bg-white/18"
          style={{
            bottom: "80%",
            width: `${scalePx(24, scale)}px`,
            height: `${scalePx(24, scale)}px`,
            boxShadow: "0 0 24px rgba(255,255,255,0.4)",
          }}
        />
        <div
          className="absolute left-[63%] rounded-full bg-[#132132]"
          style={{
            bottom: "81.2%",
            width: `${scalePx(17, scale)}px`,
            height: `${scalePx(17, scale)}px`,
          }}
        />
        {[
          { left: "35%", bottom: "71%" },
          { left: "70%", bottom: "66%" },
        ].map((star, i) => (
          <div
            key={`moon-star-${i}`}
            className="absolute bg-white/85"
            style={{
              left: star.left,
              bottom: star.bottom,
              width: `${scalePx(6, scale)}px`,
              height: `${scalePx(6, scale)}px`,
              transform: "rotate(45deg)",
              boxShadow: "0 0 12px rgba(255,255,255,0.55)",
            }}
          />
        ))}
      </>
    );
  }

  if (variant === "golden") {
    return (
      <>
        {[
          { left: "27%", bottom: "49%", h: 22, cls: p.leaf2 },
          { left: "47%", bottom: "76%", h: 18, cls: p.leaf3 },
          { left: "66%", bottom: "54%", h: 24, cls: p.leaf1 },
        ].map((leaf, i) => (
          <div
            key={`golden-${i}`}
            className={`absolute ${leaf.cls}`}
            style={{
              left: leaf.left,
              bottom: leaf.bottom,
              width: `${scalePx(10, scale)}px`,
              height: `${scalePx(leaf.h, scale)}px`,
              clipPath: PAPER_FLAME,
              opacity: 0.92,
            }}
          />
        ))}
      </>
    );
  }

  if (variant === "firefly") {
    return (
      <>
        {[
          { left: "30%", bottom: "58%", size: 8, delay: "0s" },
          { left: "40%", bottom: "72%", size: 6, delay: "-0.7s" },
          { left: "52%", bottom: "52%", size: 7, delay: "-1.2s" },
          { left: "61%", bottom: "65%", size: 8, delay: "-1.8s" },
          { left: "71%", bottom: "56%", size: 6, delay: "-0.4s" },
        ].map((dot, i) => (
          <div
            key={`firefly-${i}`}
            className="absolute rounded-full bg-yellow-100/95 animate-pulse"
            style={{
              left: dot.left,
              bottom: dot.bottom,
              width: `${scalePx(dot.size, scale)}px`,
              height: `${scalePx(dot.size, scale)}px`,
              animationDelay: dot.delay,
              boxShadow: "0 0 20px rgba(255,245,170,0.92)",
            }}
          />
        ))}
      </>
    );
  }

  if (variant === "silver") {
    return (
      <>
        <div
          className="absolute left-1/2 bg-white/18"
          style={{
            bottom: "73%",
            width: `${scalePx(116, scale)}px`,
            height: `${scalePx(22, scale)}px`,
            transform: "translateX(-50%)",
            clipPath: PAPER_CRYSTAL,
            filter: "blur(8px)",
          }}
        />
        {[
          { left: "36%", bottom: "68%" },
          { left: "60%", bottom: "77%" },
          { left: "68%", bottom: "61%" },
        ].map((flake, i) => (
          <div
            key={`silver-${i}`}
            className="absolute bg-white/90"
            style={{
              left: flake.left,
              bottom: flake.bottom,
              width: `${scalePx(6, scale)}px`,
              height: `${scalePx(10, scale)}px`,
              clipPath: PAPER_CRYSTAL,
              boxShadow: "0 0 12px rgba(255,255,255,0.42)",
            }}
          />
        ))}
      </>
    );
  }

  return null;
}