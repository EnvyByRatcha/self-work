import { sparePartUnitsFormData } from "./ISparePart";

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

export interface AssignmentWithParts {
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
  usedSparePart: AssignmentDetail[];
}

interface AssignmentDetail {
  sparePartId: string;
  assignmentDetailId: string;
}

export interface AssignmentDetailFormData {
  payload: sparePartUnitsFormData[];
}
