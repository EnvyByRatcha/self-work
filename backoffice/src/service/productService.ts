import axios from "axios";
import config from "../config";
import { Product } from "../interface/IProduct";

const baseUrl = `${config.apiPath}/products`;

const productService = {
  getAllProducts: async (): Promise<ProductResponse> => {
    const response = await axios.get(baseUrl);
    return response.data;
  },
  createProduct: async () => {
    const response = await axios.post(baseUrl);
  },
};

export default productService;

interface ProductResponse {
  products: Product[];
}
