import type { Assignment } from "../interface/IAssignment";

type AssignmentColumn = {
  key: keyof Assignment;
  label: string;
  align?: "left" | "center" | "right";
};

export const assignmentColumn: AssignmentColumn[] = [
  { key: "serialNumber", label: "Serail no." },
  { key: "customerCode", label: "Customer code" },
  { key: "status", label: "Status" },
  { key: "createdAt", label: "Create date" },
];
