import axios from "axios";
import config from "../config";
import type { ProductBash } from "../interface/IProductBash";

const baseUrl = `${config.apiPath}/productBash`;

const productBashService = {
  getBashByProductId: async (id: string): Promise<ProductBashesResponse> => {
    const response = await axios.get(`${baseUrl}/product/${id}`);
    return response.data;
  },
};

export default productBashService;

interface ProductBashesResponse {
  message: string;
  productBashes: ProductBash[];
}
