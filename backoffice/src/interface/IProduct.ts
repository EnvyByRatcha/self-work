export interface Product {
  categoryId: any;
  _id: string;
  name: string;
  qty: number;
  photoUrl: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  categoryName: string;
  photo: string;
}

export interface ProductUnit {
  _id: string;
  serialNumber: string;
  productBatchId: string;
  customerId: string;
  status: string;
  updatedAt: string;
}

export interface ProductUnitFormData {
  serialNumber: string;
  productId: string;
  productBatchId: string;
}
