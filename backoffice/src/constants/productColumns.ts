import { Product } from "../interface/IProduct";

type ProductColumn = {
  key: keyof Product;
  label: string;
  align?: "left" | "center" | "right";
};

export const productColumns: ProductColumn[] = [
  { key: "name", label: "Product Name" },
  { key: "cost", label: "Cost" },
  { key: "price", label: "Price" },
  { key: "qty", label: "QTY" },
];
