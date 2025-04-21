import axios from "axios";
import config from "../config";
import type { ProductUnit, ProductUnitFormData } from "../interface/IProduct";

const baseUrl = `${config.apiPath}/productUnits`;

const productUnitService = {
  getAllProductUnit: async (
    id: string,
    page: number,
    limit: number
  ): Promise<ProductUnitsResponse> => {
    const response = await axios.get(
      `${baseUrl}/${id}?page=${page}&limit=${limit}`
    );
    return response.data;
  },
  createProductUnit: async (
    payload: ProductUnitFormData
  ): Promise<ProductUnitResponse> => {
    const response = await axios.post(baseUrl, payload);
    return response.data;
  },
  updateProductUnit: async (
    id: string,
    payload: ProductUnitFormData
  ): Promise<ProductUnitResponse> => {
    const response = await axios.put(`${baseUrl}/${id}`, payload);
    return response.data;
  },
  removeProductUnit: async (id: string): Promise<ProductUnitResponse> => {
    const response = await axios.delete(`${baseUrl}/${id}`);
    return response.data;
  },
};

export default productUnitService;

interface ProductUnitResponse {
  message: string;
  productUnit?: ProductUnit;
}

interface ProductUnitsResponse {
  message: string;
  page: {
    totalPage: number;
    currentPage: number;
  };
  productUnits: ProductUnit[];
}
