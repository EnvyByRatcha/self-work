export interface SparePart {
  _id: string;
  name: string;
  qty: number;
  photoUrl: string;
  productId: any;
  productName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface SparePartFormData {
  name: string;
  productId: string;
  photo: string;
}

export interface SparePartBatch {
  _id: string;
  sparePartId: string;
  cost: number;
  price: number;
  qty: number;
}

export interface SparePartUnit {
  _id: string;
  serialNumber: string;
  sparePartBatchId: string;
  technicianId: { email: string };
  status: string;
  updatedAt: string;
}

export interface SparePartUnitFormData {
  serialNumber: string;
  sparePartId: string;
  sparePartBatchId: string;
}
