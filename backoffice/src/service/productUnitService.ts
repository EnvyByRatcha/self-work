import axios from "axios";
import config from "../config";
import type {
  ProductUnit,
  ProductUnitFormData,
} from "../interface/IProductUnit";

const baseUrl = `${config.apiPath}/productUnits`;

const productService = {
  getAllProductUnit: async (
    page: number,
    limit: number
  ): Promise<ProductUnitsResponse> => {
    const response = await axios.get(`${baseUrl}?page=${page}&limit=${limit}`);
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

export default productService;

interface ProductUnitResponse {
  message: string;
  product?: ProductUnit;
}

interface ProductUnitsResponse {
  message: string;
  page: {
    totalPage: number;
    currentPage: number;
  };
  products: ProductUnit[];
}
