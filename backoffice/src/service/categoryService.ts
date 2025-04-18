import axios from "axios";
import config from "../config";
import type { Category, CategoryFormData } from "../interface/ICategory";

const baseUrl = `${config.apiPath}/categories`;

const categoryService = {
  getAllCategory: async (
    page: number,
    limit: number
  ): Promise<GetResponseProducts> => {
    const response = await axios.get(`${baseUrl}?page=${page}&limit=${limit}`);
    return response.data;
  },
  createCategory: async (
    payload: CategoryFormData
  ): Promise<CategoryResponse> => {
    const response = await axios.post(baseUrl, payload);
    return response.data;
  },
  updateCategory: async (
    id: string,
    payload: Category
  ): Promise<CategoryResponse> => {
    const response = await axios.put(`${baseUrl}/${id}`, payload);
    return response.data;
  },
  removeCategory: async (id: string): Promise<CategoryResponse> => {
    const response = await axios.delete(`${baseUrl}/${id}`);
    return response.data;
  },
};

export default categoryService;

interface GetResponseProducts {
  message: string;
  page: {
    totalPage: number;
    currentPage: number;
  };
  categories: Category[];
}

interface CategoryResponse {
  message: string;
  category?: Category;
}
