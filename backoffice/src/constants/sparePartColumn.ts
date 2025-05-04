import type { SparePart } from "../interface/ISparePart";

type SparePartColumn = {
  key: keyof SparePart;
  label: string;
  align?: "left" | "center" | "right";
};

export const sparePartColumn: SparePartColumn[] = [
  { key: "name", label: "Product Name" },
  { key: "qty", label: "QTY" },
  { key: "updatedAt", label: "Last update" },
];
