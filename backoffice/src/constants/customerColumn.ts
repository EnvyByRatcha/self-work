import type { Customer } from "../interface/ICustomer";

type CustomerColumn = {
  key: keyof Customer;
  label: string;
  align?: "left" | "center" | "right";
};

export const customerColumn: CustomerColumn[] = [
  { key: "name", label: "Name" },
  { key: "customerCode", label: "Code" },
  { key: "email", label: "Email" },
  { key: "tel_1", label: "tel_1" },
  { key: "tel_2", label: "tel_2" },
];