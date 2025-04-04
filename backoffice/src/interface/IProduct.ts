export interface Product {
  categoryId: any;
  _id: string;
  name: string;
  cost: number;
  price: number;
  qty: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  cost: number;
  price: number;
  categoryName: string;
}
