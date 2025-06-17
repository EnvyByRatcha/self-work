import { ProductUnit } from "./IProduct";

export interface TranferFormData {
  transitionType: string;
  customerId: string;
  products: ProductWithUnits[];
}

export interface ProductWithUnits {
  _id: string;
  name: string;
  productUnits: ProductUnit[];
}
