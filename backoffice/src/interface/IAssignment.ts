export interface Assignment {
  _id: string;
  title: string;
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
  title: string;
  customerCode: string;
  technicianId: string;
  solution: string;
  addressRemark: string;
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
