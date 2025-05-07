import type { ProductUnit } from "../interface/IProduct";

type ProductUnitColumn = {
  key: keyof ProductUnit;
  label: string;
  align?: "left" | "center" | "right";
};

export const productUnitColumn: ProductUnitColumn[] = [
  { key: "serialNumber", label: "Serial number" },
  { key: "status", label: "Status" },
  { key: "updatedAt", label: "Last update" },
];
