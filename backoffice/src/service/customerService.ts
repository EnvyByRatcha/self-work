import axios from "axios";
import config from "../config";
import type { Customer, CustomerFormData } from "../interface/ICustomer";

const baseUrl = `${config.apiPath}/customers`;

const customerService = {
  getAllCustomer: async (
    page: number,
    limit: number
  ): Promise<GetResponseCustomers> => {
    const response = await axios.get(`${baseUrl}?page=${page}&limit=${limit}`);
    return response.data;
  },
  createCustomer: async (
    payload: CustomerFormData
  ): Promise<CustomerResponse> => {
    const response = await axios.post(baseUrl, payload);
    return response.data;
  },
  updateCustomer: async (
    id: string,
    payload: CustomerFormData
  ): Promise<CustomerResponse> => {
    const response = await axios.put(`${baseUrl}/${id}`, payload);
    return response.data;
  },
  removeCustomer: async (id: string): Promise<CustomerResponse> => {
    const response = await axios.delete(`${baseUrl}/${id}`);
    return response.data;
  },
};

export default customerService;

interface GetResponseCustomers {
  message: string;
  page: {
    totalPage: number;
    currentPage: number;
  };
  customers: Customer[];
}

interface CustomerResponse {
  message: string;
  customer?: Customer;
}
