import axios from "axios";
import config from "../config";
import type { ErrorResponse } from "../interface/IError";
import type { SparePart } from "../interface/ISparePart";
import { handleAxiosError } from "../utils/handleAxiosError";

const baseUrl = `${config.apiPath}/sparePart/sn`;
const headers = config.headers();

const sparePartService = {
  getSparePartBySerialNumber: async (
    serialNumber: string
  ): Promise<SparePartsResponse | ErrorResponse> => {
    try {
      const response = await axios.get(`${baseUrl}/${serialNumber}`, {
        headers,
      });
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "fetching the assignments");
    }
  },
};

export default sparePartService;

interface SparePartsResponse {
  success: boolean;
  message: string;
  data: {
    spareParts: SparePart[];
  };
}
