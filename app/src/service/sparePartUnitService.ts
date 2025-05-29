import axios from "axios";
import config from "../config";
import type { ErrorResponse } from "../interface/IError";
import type { sparePartUnits } from "../interface/ISparePart";
import { handleAxiosError } from "../utils/handleAxiosError";

const baseUrl = `${config.apiPath}/sparePartUnits/technician`;
const headers = config.headers();

const sparePartUnitService = {
  getSparePartUnitByTechnicianId: async (): Promise<
    GetSparePartUnitsResponse | ErrorResponse
  > => {
    try {
      const response = await axios.get(`${baseUrl}`, { headers });
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
    sparePartUnits: sparePartUnits[];
  };
}

// interface SparePartUnitsResponse {
//   success: boolean;
//   message: string;
//   data: {
//     sparePartUnit: SparePartUnit;
//   };
// }
