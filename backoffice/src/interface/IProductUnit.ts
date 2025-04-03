export interface ProductUnit {
  _id: string;
  serialNumber: string;
  productId: string;
  customerId: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductUnitFormData {
  serialNumber: string;
  productId: string;
  customerId: string | null;
}
