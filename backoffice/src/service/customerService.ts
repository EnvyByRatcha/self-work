import axios from "axios";
import config from "../config";
import type {
  Customer,
  CustomerFormData,
  CustomerFormDataForUpdate,
} from "../interface/ICustomer";
import type { ErrorResponse } from "../interface/IError";
import { handleAxiosError } from "../utils/handleAxiosError";

const baseUrl = `${config.apiPath}/customers`;
const headers = config.headers();

const customerService = {
  getAllCustomer: async (
    page: number,
    limit: number,
    search?: string,
    status?: string
  ): Promise<GetCustomersResponse | ErrorResponse> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) params.append("search", search);
      if (status) params.append("status", status);

      const response = await axios.get(`${baseUrl}?${params.toString()}`, {
        headers,
      });
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "fetching the customers");
    }
  },
  getCustomerById: async (
    id: string
  ): Promise<CustomerResponse | ErrorResponse> => {
    try {
      const response = await axios.get(`${baseUrl}/${id}`, {
        headers,
      });
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "fetching the product");
    }
  },
  createCustomer: async (
    payload: CustomerFormData
  ): Promise<CustomerResponse | ErrorResponse> => {
    try {
      const response = await axios.post(baseUrl, payload, {
        headers,
      });
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "fetching the customers");
    }
  },
  updateCustomer: async (
    id: string,
    payload: CustomerFormDataForUpdate
  ): Promise<CustomerResponse | ErrorResponse> => {
    try {
      const response = await axios.put(`${baseUrl}/${id}`, payload, {
        headers,
      });
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "fetching the customers");
    }
  },
  removeCustomer: async (
    id: string
  ): Promise<CustomerResponse | ErrorResponse> => {
    try {
      const response = await axios.delete(`${baseUrl}/${id}`, {
        headers,
      });
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
