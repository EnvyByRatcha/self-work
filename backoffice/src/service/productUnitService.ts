import axios from "axios";
import config from "../config";
import type { ProductUnit, ProductUnitFormData } from "../interface/IProduct";
import type { ErrorResponse } from "../interface/IError";
import { handleAxiosError } from "../utils/handleAxiosError";

const baseUrl = `${config.apiPath}/productUnits`;
const headers = config.headers();

const productUnitService = {
  getAllProductUnit: async (
    id: string,
    page: number,
    limit: number,
    search?: string,
    status?: string
  ): Promise<GetProductUnitsResponse | ErrorResponse> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) params.append("search", search);
      if (status) params.append("status", status);

      const response = await axios.get(
        `${baseUrl}/${id}?${params.toString()}`,
        {
          headers,
        }
      );
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "creating the productUnit");
    }
  },
  getProductUnitByCustomerId: async (
    id: string,
    page: number,
    limit: number,
    search?: string,
    status?: string
  ): Promise<GetProductUnitsResponse | ErrorResponse> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) params.append("search", search);
      if (status) params.append("status", status);
      const response = await axios.get(
        `${baseUrl}/customer/${id}?${params.toString()}`,
        {
          headers,
        }
      );
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "creating the productUnit");
    }
  },
  createProductUnit: async (
    payload: ProductUnitFormData
  ): Promise<ProductUnitResponse | ErrorResponse> => {
    try {
      const response = await axios.post(baseUrl, payload, {
        headers,
      });
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "creating the productUnit");
    }
  },
  updateProductUnit: async (
    id: string,
    payload: ProductUnit
  ): Promise<ProductUnitResponse> => {
    const response = await axios.put(`${baseUrl}/${id}`, payload, {
      headers,
    });
    return response.data;
  },
  removeProductUnit: async (id: string): Promise<ProductUnitResponse> => {
    const response = await axios.delete(`${baseUrl}/${id}`);
    return response.data;
  },
};

export default productUnitService;

interface ProductUnitResponse {
  success: boolean;
  message: string;
  data: {
    productUnit: ProductUnit;
  };
}

interface GetProductUnitsResponse {
  success: boolean;
  message: string;
  data: {
    productUnits: ProductUnit[];
    pagination: {
      totalPage: number;
      currentPage: number;
      totalItems: number;
    };
  };
}
