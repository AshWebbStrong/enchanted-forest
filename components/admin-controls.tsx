"use client";

import type { TreeState } from "@/lib/types";
import { TREE_NAMES } from "@/lib/types";

export function AdminControls({
  trees,
  onGrow,
  onWilt,
}: {
  trees: TreeState[];
  onGrow: (treeKey: string) => void;
  onWilt: (treeKey: string) => void;
}) {
  return (
    <div className="w-full rounded-[2rem] border border-white/30 bg-white/18 p-5 shadow-2xl backdrop-blur-md">
      <div className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-700/70">
        Forest Controls
      </div>

      <div className="grid grid-cols-[1.45fr_auto_auto] items-center gap-x-3 gap-y-3">
        {trees.map((tree) => {
          const treeStage = Math.max(1, Math.min(8, tree.stage));
          const starStage = Math.max(0, Math.min(7, tree.star_stage ?? 0));

          const canGrow = treeStage < 8 || starStage < 7;
          const canWilt = starStage > 0 || treeStage > 1;

          const growLabel =
            treeStage >= 8
              ? starStage >= 7
                ? "Star Maxed"
                : "Grow Star"
              : "Grow";

          const wiltLabel = starStage > 0 ? "Dim Star" : "Wilt";

          return (
            <div key={tree.tree_key} className="contents">
              <div className="min-w-0 pr-2">
                <div className="truncate text-sm font-medium text-slate-800">
                  {TREE_NAMES[tree.tree_key]}
                </div>
                <div className="text-[11px] text-slate-700/70">
                  Tree {treeStage}/8 · Star {starStage}/7
                </div>
              </div>

              <button
                onClick={() => onGrow(tree.tree_key)}
                disabled={!canGrow}
                className={`rounded-full px-3 py-2 text-sm font-medium shadow-md transition ${
                  canGrow
                    ? "border border-emerald-200/70 bg-emerald-50/90 text-emerald-900 hover:-translate-y-0.5 hover:bg-white active:translate-y-0"
                    : "cursor-not-allowed border border-slate-200/70 bg-slate-100/80 text-slate-400"
                }`}
              >
                {growLabel}
              </button>

              <button
                onClick={() => onWilt(tree.tree_key)}
                disabled={!canWilt}
                className={`rounded-full px-3 py-2 text-sm font-medium shadow-md transition ${
                  canWilt
                    ? "border border-amber-100/70 bg-amber-50/90 text-amber-900 hover:-translate-y-0.5 hover:bg-white active:translate-y-0"
                    : "cursor-not-allowed border border-slate-200/70 bg-slate-100/80 text-slate-400"
                }`}
              >
                {wiltLabel}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}