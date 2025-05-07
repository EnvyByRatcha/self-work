import axios from "axios";
import config from "../config";
import type { Product, ProductFormData } from "../interface/IProduct";
import type { ErrorResponse } from "../interface/IError";
import { handleAxiosError } from "../utils/handleAxiosError";

const baseUrl = `${config.apiPath}/products`;

const productService = {
  getAllProducts: async (
    page: number,
    limit: number,
    search?: string,
    sort?: string,
    order?: "asc" | "desc",
    status?: string
  ): Promise<GetProductsResponse | ErrorResponse> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) params.append("search", search);
      if (sort) params.append("sort", sort);
      if (order) params.append("order", order);
      if (status) params.append("status", status);

      const response = await axios.get(`${baseUrl}?${params.toString()}`);
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "fetching the products");
    }
  },
  getProductById: async (
    id: string
  ): Promise<ProductResponse | ErrorResponse> => {
    try {
      const response = await axios.get(`${baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "fetching the product");
    }
  },
  createProduct: async (
    payload: ProductFormData
  ): Promise<ProductResponse | ErrorResponse> => {
    try {
      const response = await axios.post(baseUrl, payload);
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "creating the product");
    }
  },
  updateProduct: async (
    id: string,
    payload: ProductFormData
  ): Promise<ProductResponse | ErrorResponse> => {
    try {
      const response = await axios.put(`${baseUrl}/${id}`, payload);
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "updating the product");
    }
  },
  deactiveProduct: async (
    id: string
  ): Promise<ProductResponse | ErrorResponse> => {
    try {
      const response = await axios.delete(`${baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "deactive the product");
    }
  },
};

export default productService;

interface GetProductsResponse {
  success: boolean;
  message: string;
  data: {
    products: Product[];
    pagination: {
      totalPage: number;
      currentPage: number;
      totalItems: number;
    };
  };
}

interface ProductResponse {
  success: boolean;
  message: string;
  data: {
    product: Product;
  };
}
