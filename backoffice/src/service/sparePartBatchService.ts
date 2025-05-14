import axios from "axios";
import config from "../config";
import type { ErrorResponse } from "../interface/IError";
import { handleAxiosError } from "../utils/handleAxiosError";
import { SparePartBatch } from "../interface/ISparePart";

const baseUrl = `${config.apiPath}/sparePartBatches`;

const sparePartBatchService = {
  getBatchBySparePartId: async (
    id: string
  ): Promise<SparePartBatchResponse | ErrorResponse> => {
    try {
      const response = await axios.get(`${baseUrl}/sparePart/${id}`);
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "fetching the sparePartBatch");
    }
  },
};

export default sparePartBatchService;

interface SparePartBatchResponse {
  success: boolean;
  message: string;
  data: {
    sparePartBatches: SparePartBatch[];
  };
}
