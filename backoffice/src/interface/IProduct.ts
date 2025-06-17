export interface Product {
  _id: string;
  name: string;
  qty: number;
  photoUrl: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  categoryName: string;
  categoryId: any;
}

export interface ProductFormData {
  name: string;
  categoryName: string;
  photo: string;
}

export interface ProductBatch {
  _id: string;
  productId: string;
  cost: number;
  price: number;
  qty: number;
}

export interface ProductUnit {
  _id: string;
  serialNumber: string;
  productBatchId: string;
  customerId: {
    name: string;
  };
  status: string;
  updatedAt: string;
}

export interface ProductUnitFormData {
  serialNumber: string;
  productId: string;
  productBatchId: string;
}
