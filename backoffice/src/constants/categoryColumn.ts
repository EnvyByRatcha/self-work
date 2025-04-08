import type { Category } from "../interface/ICategory";

type CategoryColumn = {
  key: keyof Category;
  label: string;
  align?: "left" | "center" | "right";
};

export const categoryColumn: CategoryColumn[] = [
  { key: "name", label: "Name" },
];
