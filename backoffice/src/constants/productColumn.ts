import { Product } from "../interface/IProduct";

type ProductColumn = {
  key: keyof Product;
  label: string;
  align?: "left" | "center" | "right";
};

export const productColumn: ProductColumn[] = [
  { key: "name", label: "Product Name" },
  { key: "categoryName", label: "Category" },
  { key: "qty", label: "QTY" },
  { key: "updatedAt", label: "Last update" },
  { key: "status", label: "Status" },
];
