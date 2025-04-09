export interface SparePart {
  _id: string;
  name: string;
  cost: number;
  price: number;
  qty: number;
  productId: any;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface SparePartFormData {
  name: string;
  cost: number;
  price: number;
  qty: number;
  productId: string;
  photo: string;
}
