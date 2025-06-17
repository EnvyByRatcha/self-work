import axios from "axios";
import config from "../config";
import { handleAxiosError } from "../utils/handleAxiosError";
import { ErrorResponse } from "../interface/IError";

const baseUrl = `${config.apiPath}/reports`;
const headers = config.headers();

const reportService = {
  getCostAssignmentPerMonth: async (
    year: number
  ): Promise<ReportResponse | ErrorResponse> => {
    try {
      const params = new URLSearchParams({
        year: year.toString(),
      });

      const response = await axios(
        `${baseUrl}/sumPerMonth?${params.toString()}`,
        { headers }
      );

      return response.data;
    } catch (error) {
      return handleAxiosError(error, "fetching cost per month");
    }
  },
};

export default reportService;

interface ReportResponse {
  success: boolean;
  message: string;
  data: {
    CostPerMonth: {
      assignment: number[];
      inventory: number[];
    };
    countPerMonth: {
      assignment: number[];
      inventory: number[];
    };
  };
}
