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

export interface SparePartUnit {
  _id: string;
  serialNumber: string;
  sparePartBatchId: string;
  technicianId: string;
  status: string;
  updatedAt: string;
}

export interface sparePartUnits {
  _id: string;
  name: string;
  units: {
    _id: string;
    serialNumber: string;
  }[];
}

export interface sparePartUnitsFormData {
  sparePartId: string;
  name: string;
  units: {
    _id: string;
    serialNumber: string;
  }[];
}
