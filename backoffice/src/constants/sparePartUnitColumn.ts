import type { SparePartUnit } from "../interface/ISparePart";


type SparePartUnitColumn = {
  key: keyof SparePartUnit;
  label: string;
  align?: "left" | "center" | "right";
};

export const sparePartUnitColumn: SparePartUnitColumn[] = [
  { key: "serialNumber", label: "Serial number" },
  { key: "status", label: "Status" },
  { key: "updatedAt", label: "Last update" },
];
