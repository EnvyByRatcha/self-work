export interface SparePart {
  _id: string;
  name: string;
  qty: number;
  photoUrl: string;
  productId: any;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface SparePartFormData {
  name: string;
  productId: string;
  photo: string;
}
