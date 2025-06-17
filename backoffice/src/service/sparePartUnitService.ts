import axios from "axios";
import config from "../config";
import type { ErrorResponse } from "../interface/IError";
import { handleAxiosError } from "../utils/handleAxiosError";
import { SparePartUnit, SparePartUnitFormData } from "../interface/ISparePart";

const baseUrl = `${config.apiPath}/sparePartUnits`;
const headers = config.headers();

const sparePartUnitService = {
  getSparePartUnitBySparePartId: async (
    id: string,
    page: number,
    limit: number,
    search?: string,
    status?: string
  ): Promise<GetSparePartUnitsResponse | ErrorResponse> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) params.append("search", search);
      if (status) params.append("status", status);

      const response = await axios.get(
        `${baseUrl}/sparePart/${id}?${params.toString()}`,
        {
          headers,
        }
      );
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "creating the productUnit");
    }
  },
  createSparePartUnit: async (
    payload: SparePartUnitFormData
  ): Promise<SparePartUnitsResponse | ErrorResponse> => {
    try {
      const response = await axios.post(baseUrl, payload, {
        headers,
      });
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "creating the productUnit");
    }
  },
  updateSparePartUnit: async (
    id: string,
    payload: SparePartUnit
  ): Promise<SparePartUnitsResponse> => {
    const response = await axios.put(`${baseUrl}/${id}`, payload, {
      headers,
    });
    return response.data;
  },
  deactiveSparePartUnit: async (
    id: string
  ): Promise<SparePartUnitsResponse> => {
    const response = await axios.delete(`${baseUrl}/${id}`);
    return response.data;
  },
};

export default sparePartUnitService;

interface SparePartUnitsResponse {
  success: boolean;
  message: string;
  data: {
    sparePartUnit: SparePartUnit;
  };
}

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
