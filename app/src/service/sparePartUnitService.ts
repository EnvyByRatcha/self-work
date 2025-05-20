import axios from "axios";
import config from "../config";
import type { ErrorResponse } from "../interface/IError";
import type { SparePartUnit } from "../interface/ISparePart";
import { handleAxiosError } from "../utils/handleAxiosError";

const baseUrl = `${config.apiPath}/sparePartUnits/technician`;
const headers = config.headers();

const sparePartUnitService = {
  getSparePartUnitByTechnicianId: async (
    page: number,
    limit: number
  ): Promise<GetSparePartUnitsResponse | ErrorResponse> => {
    try {
      const response = await axios.get(
        `${baseUrl}?page=${page}&limit=${limit}`,
        { headers }
      );
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "fetching the assignments");
    }
  },
};

export default sparePartUnitService;

interface GetSparePartUnitsResponse {
  success: boolean;
  message: string;
  data: {
    sparePartUnits: SparePartUnit[];
    pagination: {
      totalPage: number;
      currentPage: number;
      totalItems: number;
    };
  };
}

interface SparePartUnitsResponse {
  success: boolean;
  message: string;
  data: {
    sparePartUnit: SparePartUnit;
  };
}
