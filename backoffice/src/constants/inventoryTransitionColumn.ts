import type { InventoryTransitions } from "../interface/IInventory";

type InventoryTransitionColumn = {
  key: keyof InventoryTransitions;
  label: string;
  align?: "left" | "center" | "right";
};

export const inventoryTransitionColumn: InventoryTransitionColumn[] = [
  { key: "transitionType", label: "Transition type" },
  { key: "cost", label: "Cost" },
  { key: "status", label: "Stauts" },
  { key: "createdAt", label: "Create time" },
];
