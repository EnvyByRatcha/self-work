import type { SparePart } from "../interface/ISparePart";

type SparePartColumn = {
  key: keyof SparePart;
  label: string;
  align?: "left" | "center" | "right";
};

export const sparePartColumn: SparePartColumn[] = [
  { key: "name", label: "Product Name" },
  { key: "cost", label: "Cost" },
  { key: "price", label: "Price" },
  { key: "qty", label: "QTY" },
];

