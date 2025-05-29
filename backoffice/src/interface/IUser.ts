export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  tel_1: string;
  level: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  level: string;
}

export interface UserFormDataForUpdate {
  firstName?: string;
  lastName?: string;
  address?: string;
  tel_1?: string;
  email?: string;
  level?: string;
}
