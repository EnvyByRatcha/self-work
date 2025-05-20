export interface SparePartUnit {
  _id: string;
  serialNumber: string;
  sparePartBatchId: string;
  technicianId: string;
  status: string;
  updatedAt: string;
}

export interface SparePartUnitWithBatch {
  batchId: string;
  units: SparePartUnit[];
}
