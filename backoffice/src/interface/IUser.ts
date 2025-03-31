export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
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
