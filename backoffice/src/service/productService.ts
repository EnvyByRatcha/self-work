import axios from "axios";
import config from "../config";
import { Product, ProductFormData } from "../interface/IProduct";

const baseUrl = `${config.apiPath}/products`;

const productService = {
  getAllProducts: async (): Promise<ProductsResponse> => {
    const response = await axios.get(baseUrl);
    return response.data;
  },
  createProduct: async (payload: ProductFormData): Promise<ProductResponse> => {
    const response = await axios.post(baseUrl, payload);
    return response.data;
  },
  updateProduct: async (
    id: string,
    payload: ProductFormData
  ): Promise<ProductResponse> => {
    const response = await axios.put(`${baseUrl}/${id}`, payload);
    return response.data;
  },
  removeProduct: async (id: string): Promise<ProductResponse> => {
    const response = await axios.delete(`${baseUrl}/${id}`);
    return response.data;
  },
};

export default productService;

interface ProductResponse {
  message: string;
  product?: Product;
}

interface ProductsResponse {
  message: string;
  page: {
    totalPage: number;
    currentPage: number;
  };
  products: Product[];
}
