import type { InventoryTransition } from "../interface/IInventory";

type InventoryTransitionColumn = {
  key: keyof InventoryTransition;
  label: string;
  align?: "left" | "center" | "right";
};

export const inventoryTransitionColumn: InventoryTransitionColumn[] = [
  { key: "transitionType", label: "Transition type" },
  { key: "cost", label: "Cost" },
  { key: "status", label: "Stauts" },
  { key: "createdAt", label: "Create time" },
  { key: "updatedAt", label: "Last update" },
];
