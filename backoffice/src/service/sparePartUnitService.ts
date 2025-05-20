import axios from "axios";
import config from "../config";
import type { ErrorResponse } from "../interface/IError";
import { handleAxiosError } from "../utils/handleAxiosError";
import { SparePartUnit, SparePartUnitFormData } from "../interface/ISparePart";

const baseUrl = `${config.apiPath}/sparePartUnits`;

const sparePartUnitService = {
  getSparePartUnitBySparePartId: async (
    id: string,
    page: number,
    limit: number
  ): Promise<GetSparePartUnitsResponse | ErrorResponse> => {
    try {
      const response = await axios.get(
        `${baseUrl}/sparePart/${id}?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "creating the productUnit");
    }
  },
  // getProductUnitByCustomerId: async (
  //   id: string,
  //   page: number,
  //   limit: number
  // ): Promise<GetSparePartUnitsResponse | ErrorResponse> => {
  //   try {
  //     const response = await axios.get(
  //       `${baseUrl}/customer/${id}?page=${page}&limit=${limit}`
  //     );
  //     return response.data;
  //   } catch (error) {
  //     return handleAxiosError(error, "creating the productUnit");
  //   }
  // },
  createSparePartUnit: async (
    payload: SparePartUnitFormData
  ): Promise<SparePartUnitsResponse | ErrorResponse> => {
    try {
      const response = await axios.post(baseUrl, payload);
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "creating the productUnit");
    }
  },
  updateSparePartUnit: async (
    id: string,
    payload: SparePartUnit
  ): Promise<SparePartUnitsResponse> => {
    const response = await axios.put(`${baseUrl}/${id}`, payload);
    return response.data;
  },
  deactiveSparePartUnit: async (id: string): Promise<SparePartUnitsResponse> => {
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
