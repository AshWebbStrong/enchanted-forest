import { createClient } from "@/lib/supabase/server";
import type { TreeState } from "@/lib/types";

export async function getForestState(): Promise<TreeState[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("forest_state")
    .select("tree_key, stage, star_stage")
    .order("id", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((tree) => ({
    tree_key: tree.tree_key,
    stage: Math.max(1, Math.min(8, tree.stage)),
    star_stage: Math.max(0, Math.min(7, tree.star_stage ?? 0)),
  }));
}