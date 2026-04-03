"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateTreeStage(treeKey: string, stage: number) {
  const supabase = await createClient();
  const nextStage = Math.max(1, Math.min(8, stage));

  const { error } = await supabase
    .from("forest_state")
    .update({
      stage: nextStage,
      updated_at: new Date().toISOString(),
    })
    .eq("tree_key", treeKey);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateTreeStarStage(treeKey: string, starStage: number) {
  const supabase = await createClient();
  const nextStarStage = Math.max(0, Math.min(7, starStage));

  const { error } = await supabase
    .from("forest_state")
    .update({
      star_stage: nextStarStage,
      updated_at: new Date().toISOString(),
    })
    .eq("tree_key", treeKey);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin");
}