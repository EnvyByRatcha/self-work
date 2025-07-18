import { InventoryTransitionDetail } from "../interface/IInventory";

type transitionDetailColumn = {
  key: keyof InventoryTransitionDetail;
  label: string;
  align?: "left" | "center" | "right";
};

export const transitionDetailColumn: transitionDetailColumn[] = [
  { key: "name", label: "Product name", align: "left" },
  { key: "qty", label: "QTY", align: "right" },
  { key: "cost", label: "Cost/Unit", align: "right" },
  { key: "total", label: "Total price", align: "right" },
];
