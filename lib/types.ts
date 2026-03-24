export type TreeKey =
  | "golden"
  | "willow"
  | "blossom"
  | "moon"
  | "oak"
  | "firefly"
  | "silver";

export type TreeState = {
  tree_key: TreeKey;
  stage: number;
};

export const TREE_NAMES: Record<TreeKey, string> = {
  golden: "Golden",
  willow: "Willow",
  blossom: "Blossom",
  moon: "Moon",
  oak: "Oak",
  firefly: "Firefly",
  silver: "Silver",
};