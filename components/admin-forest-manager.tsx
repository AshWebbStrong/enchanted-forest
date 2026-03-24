"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ForestScene } from "@/components/forest-scene";
import { AdminControls } from "@/components/admin-controls";
import type { TreeState } from "@/lib/types";
import { updateTreeStage } from "@/lib/actions";

export function AdminForestManager({
  initialTrees,
}: {
  initialTrees: TreeState[];
}) {
  const [trees, setTrees] = useState<TreeState[]>(initialTrees);
  const router = useRouter();

  async function handleGrow(treeKey: string) {
    const current = trees.find((tree) => tree.tree_key === treeKey);
    if (!current) return;

    const nextStage = Math.min(current.stage + 1, 8);

    setTrees((prev) =>
      prev.map((tree) =>
        tree.tree_key === treeKey
          ? { ...tree, stage: nextStage }
          : tree
      )
    );

    await updateTreeStage(treeKey, nextStage);
    router.refresh();
  }

  async function handleWilt(treeKey: string) {
    const current = trees.find((tree) => tree.tree_key === treeKey);
    if (!current) return;

    const nextStage = Math.max(current.stage - 1, 0);

    setTrees((prev) =>
      prev.map((tree) =>
        tree.tree_key === treeKey
          ? { ...tree, stage: nextStage }
          : tree
      )
    );

    await updateTreeStage(treeKey, nextStage);
    router.refresh();
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ForestScene trees={trees} admin />
      <div className="absolute right-0 top-0 z-30 h-full w-[340px] p-6">
        <AdminControls trees={trees} onGrow={handleGrow} onWilt={handleWilt} />
      </div>
    </div>
  );
}