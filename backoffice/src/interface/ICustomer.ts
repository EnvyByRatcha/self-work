export interface Customer {
  _id: string;
  name: string;
  customerCode: string;
  email: string;
  address: string;
  tel_1: string;
  tel_2: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFormData {
  name: string;
  customerCode: string;
  email: string;
  address: string;
  tel_1: string;
  tel_2: string;
}
