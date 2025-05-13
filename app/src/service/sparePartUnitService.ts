import axios from "axios";
import config from "../config";
import type { ErrorResponse } from "../interface/IError";
import { handleAxiosError } from "../utils/handleAxiosError";
import { Assignment, formData } from "../interface/IAssignment";

const baseUrl = `${config.apiPath}/sparePartUnits/technician`;
const headers = config.headers();

const sparePartUnitService = {
  getSparePartUnitByTechnicianId: async (page: number, limit: number) => {
    try {
      const response = await axios.get(
        `${baseUrl}?page=${page}&limit=${limit}`,
        { headers }
      );
      console.log(response.data);

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
    customers: Assignment[];
    pagination: {
      totalPage: number;
      currentPage: number;
      totalItems: number;
    };
  };
}

interface SparePartUnitResponse {
  success: boolean;
  message: string;
  data: {
    customer: Assignment;
  };
}
