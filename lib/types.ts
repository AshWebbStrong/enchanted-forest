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
  golden: "Emily",
  willow: "Daisy",
  blossom: "Rose",
  moon: "Anushka",
  oak: "Annabel",
  firefly: "Joanna",
  silver: "Bea",
};