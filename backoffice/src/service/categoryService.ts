import axios from "axios";
import config from "../config";
import type { Category, CategoryFormData } from "../interface/ICategory";
import type { ErrorResponse } from "../interface/IError";
import { handleAxiosError } from "../utils/handleAxiosError";

const baseUrl = `${config.apiPath}/categories`;

const categoryService = {
  getAllCategory: async (
    page: number,
    limit: number,
    search?: string,
    status?: string
  ): Promise<GetCategoriesResponse | ErrorResponse> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) params.append("search", search);
      if (status) params.append("status", status);

      const response = await axios.get(`${baseUrl}?${params.toString()}`);
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "fetching the categories");
    }
  },
  createCategory: async (
    payload: CategoryFormData
  ): Promise<CategoryResponse | ErrorResponse> => {
    try {
      const response = await axios.post(baseUrl, payload);
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "creating the category");
    }
  },
  updateCategory: async (
    id: string,
    payload: CategoryFormData
  ): Promise<CategoryResponse | ErrorResponse> => {
    try {
      const response = await axios.put(`${baseUrl}/${id}`, payload);
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "updating the category");
    }
  },
  inactiveCategory: async (
    id: string
  ): Promise<CategoryResponse | ErrorResponse> => {
    try {
      const response = await axios.delete(`${baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "removing the category");
    }
  },
};

export default categoryService;

interface GetCategoriesResponse {
  success: boolean;
  message: string;
  data: {
    categories: Category[];
    pagination: {
      totalPage: number;
      currentPage: number;
      totalItems: number;
    };
  };
}

interface CategoryResponse {
  success: boolean;
  message: string;
  data: {
    category: Category;
  };
}
