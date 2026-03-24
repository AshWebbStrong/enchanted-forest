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

      <div className="grid grid-cols-[1.3fr_auto_auto] items-center gap-x-3 gap-y-3">
        {trees.map((tree) => (
          <div key={tree.tree_key} className="contents">
            <div className="truncate pr-2 text-sm font-medium text-slate-800">
              {TREE_NAMES[tree.tree_key]}
            </div>

            <button
              onClick={() => onGrow(tree.tree_key)}
              className="rounded-full border border-emerald-200/70 bg-emerald-50/90 px-3 py-2 text-sm font-medium text-emerald-900 shadow-md transition hover:-translate-y-0.5 hover:bg-white active:translate-y-0"
            >
              Grow
            </button>

            <button
              onClick={() => onWilt(tree.tree_key)}
              className="rounded-full border border-amber-100/70 bg-amber-50/90 px-3 py-2 text-sm font-medium text-amber-900 shadow-md transition hover:-translate-y-0.5 hover:bg-white active:translate-y-0"
            >
              Wilt
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}