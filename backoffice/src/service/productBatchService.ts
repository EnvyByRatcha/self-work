import axios from "axios";
import config from "../config";
import type { ErrorResponse } from "../interface/IError";
import { handleAxiosError } from "../utils/handleAxiosError";
import { ProductBatch } from "../interface/IProduct";

const baseUrl = `${config.apiPath}/productBatches`;

const productBatchService = {
  getBatchByProductId: async (
    id: string
  ): Promise<ProductBatchResponse | ErrorResponse> => {
    try {
      const response = await axios.get(`${baseUrl}/product/${id}`);
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "fetching the productBatch");
    }
  },
};

export default productBatchService;

interface ProductBatchResponse {
  success: boolean;
  message: string;
  data: {
    productBatches: ProductBatch[];
  };
}
