import { ForestScene } from "@/components/forest-scene";
import { getForestState } from "@/lib/forest";

export default async function HomePage() {
  const trees = await getForestState();

  return <ForestScene trees={trees} admin={false} />;
}