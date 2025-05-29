export interface Assignment {
  _id: string;
  title: string;
  serialNumber: string;
  customerCode: string;
  technicianId: string;
  userId: string;
  solution: string;
  addressRemark: string;
  cost: Number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentFormData {
  serialNumber: string;
  customerCode: string;
  addressRemark: string;
  title: string;
  solution: string;
}

export interface AssignmentDetailFormData {
  assignmentId: string;
  sparePartId: string;
  qty: number;
}

export interface formData {
  assignment: AssignmentFormData;
  details: AssignmentDetailFormData[];
}
