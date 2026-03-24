import { redirect } from "next/navigation";
import { getForestState } from "@/lib/forest";
import { createClient } from "@/lib/supabase/server";
import { AdminForestManager } from "@/components/admin-forest-manager";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.OWNER_EMAIL) {
    redirect("/login");
  }

  const trees = await getForestState();

  return <AdminForestManager initialTrees={trees} />;
}