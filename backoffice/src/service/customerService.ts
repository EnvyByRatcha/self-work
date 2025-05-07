import axios from "axios";
import config from "../config";
import type { Customer, CustomerFormData } from "../interface/ICustomer";
import type { ErrorResponse } from "../interface/IError";
import { handleAxiosError } from "../utils/handleAxiosError";

const baseUrl = `${config.apiPath}/customers`;

const customerService = {
  getAllCustomer: async (
    page: number,
    limit: number
  ): Promise<GetCustomersResponse | ErrorResponse> => {
    try {
      const response = await axios.get(
        `${baseUrl}?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "fetching the customers");
    }
  },
  getCustomerById: async (
    id: string
  ): Promise<CustomerResponse | ErrorResponse> => {
    try {
      const response = await axios.get(`${baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "fetching the product");
    }
  },
  createCustomer: async (
    payload: CustomerFormData
  ): Promise<CustomerResponse | ErrorResponse> => {
    try {
      const response = await axios.post(baseUrl, payload);
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "fetching the customers");
    }
  },
  updateCustomer: async (
    id: string,
    payload: CustomerFormData
  ): Promise<CustomerResponse | ErrorResponse> => {
    try {
      const response = await axios.put(`${baseUrl}/${id}`, payload);
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "fetching the customers");
    }
  },
  removeCustomer: async (
    id: string
  ): Promise<CustomerResponse | ErrorResponse> => {
    try {
      const response = await axios.delete(`${baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "fetching the customers");
    }
  },
};

export default customerService;

interface GetCustomersResponse {
  success: boolean;
  message: string;
  data: {
    customers: Customer[];
    pagination: {
      totalPage: number;
      currentPage: number;
      totalItems: number;
    };
  };
}

interface CustomerResponse {
  success: boolean;
  message: string;
  data: {
    customer: Customer;
  };
}
