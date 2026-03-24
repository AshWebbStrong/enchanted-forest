import { createClient } from "@/lib/supabase/server";
import type { TreeState } from "@/lib/types";

export async function getForestState(): Promise<TreeState[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("forest_state")
    .select("tree_key, stage")
    .order("id", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}