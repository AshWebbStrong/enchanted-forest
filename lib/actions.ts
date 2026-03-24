"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateTreeStage(treeKey: string, stage: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("forest_state")
    .update({
      stage,
      updated_at: new Date().toISOString(),
    })
    .eq("tree_key", treeKey);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin");
}