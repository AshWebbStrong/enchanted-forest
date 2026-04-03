"use client";

import { useEffect, useState } from "react";
import { ForestScene } from "@/components/forest-scene";
import { AdminControls } from "@/components/admin-controls";
import type { TreeState } from "@/lib/types";

const STORAGE_KEY = "local-forest-state";

export function AdminForestManager({
  initialTrees,
}: {
  initialTrees: TreeState[];
}) {
  const [trees, setTrees] = useState<TreeState[]>(
    initialTrees.map((tree) => ({
      ...tree,
      stage: Math.max(1, Math.min(8, tree.stage)),
      star_stage: Math.max(0, Math.min(7, tree.star_stage ?? 0)),
    }))
  );

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as TreeState[];
      setTrees(
        parsed.map((tree) => ({
          ...tree,
          stage: Math.max(1, Math.min(8, tree.stage)),
          star_stage: Math.max(0, Math.min(7, tree.star_stage ?? 0)),
        }))
      );
    } catch {
      // ignore bad local data
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trees));
  }, [trees]);

  function handleGrow(treeKey: string) {
    setTrees((prev) =>
      prev.map((tree) => {
        if (tree.tree_key !== treeKey) return tree;

        if (tree.stage < 8) {
          return { ...tree, stage: Math.min(tree.stage + 1, 8) };
        }

        if (tree.star_stage < 7) {
          return { ...tree, star_stage: Math.min(tree.star_stage + 1, 7) };
        }

        return tree;
      })
    );
  }

  function handleWilt(treeKey: string) {
    setTrees((prev) =>
      prev.map((tree) => {
        if (tree.tree_key !== treeKey) return tree;

        if (tree.star_stage > 0) {
          return { ...tree, star_stage: Math.max(tree.star_stage - 1, 0) };
        }

        if (tree.stage > 1) {
          return { ...tree, stage: Math.max(tree.stage - 1, 1) };
        }

        return tree;
      })
    );
  }

  function handleReset() {
    const resetTrees = initialTrees.map((tree) => ({
      ...tree,
      stage: Math.max(1, Math.min(8, tree.stage)),
      star_stage: Math.max(0, Math.min(7, tree.star_stage ?? 0)),
    }));

    setTrees(resetTrees);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ForestScene trees={trees} admin />
      <div className="absolute right-0 top-0 z-30 h-full w-[340px] p-6">
        <div className="mb-4 flex justify-end">
          <button
            onClick={handleReset}
            className="rounded-full border border-slate-200/70 bg-white/85 px-3 py-2 text-xs font-medium text-slate-700 shadow-md transition hover:bg-white"
          >
            Reset Local State
          </button>
        </div>
        <AdminControls trees={trees} onGrow={handleGrow} onWilt={handleWilt} />
      </div>
    </div>
  );
}