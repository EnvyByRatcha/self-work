import { User } from "../interface/IUser";

type UserColumn = {
  key: keyof User;
  label: string;
  align?: "left" | "center" | "right";
};

export const userColumn: UserColumn[] = [
  { key: "email", label: "Email" },
  { key: "firstName", label: "First name" },
  { key: "lastName", label: "Last name	" },
  { key: "level", label: "Level" },
];
