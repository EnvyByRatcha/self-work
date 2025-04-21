export interface Product {
  categoryId: any;
  _id: string;
  name: string;
  cost: number;
  price: number;
  qty: number;
  photoUrl: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  cost: number;
  price: number;
  categoryName: string;
  photo: string;
}

export interface ProductUnit {
  serialNumber: string;
  productBashId: string;
  customerId: string;
  status: string;
}

export interface ProductUnitFormData {
  serialNumber: string;
  productId: string;
  productBashId: string;
}
