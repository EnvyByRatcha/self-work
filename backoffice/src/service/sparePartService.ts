import axios from "axios";
import config from "../config";
import type { SparePart, SparePartFormData } from "../interface/ISparePart";
import type { ErrorResponse } from "../interface/IError";
import { handleAxiosError } from "../utils/handleAxiosError";

const baseUrl = `${config.apiPath}/spareParts`;

const sparePartService = {
  getAllSparePart: async (
    page: number,
    limit: number,
    search?: string,
    sort?: string,
    order?: "asc" | "desc",
    status?: string
  ): Promise<GetSparePartsResponse | ErrorResponse> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) params.append("search", search);
      if (sort) params.append("sort", sort);
      if (order) params.append("order", order);
      if (status) params.append("status", status);

      const response = await axios.get(`${baseUrl}?${params.toString()}`);
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "fetching the spareparts");
    }
  },
  getSparePartById: async (
    id: string
  ): Promise<SparePartResponse | ErrorResponse> => {
    try {
      const response = await axios.get(`${baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "fetching the sparepart");
    }
  },
  createSparePart: async (
    payload: SparePartFormData
  ): Promise<SparePartResponse | ErrorResponse> => {
    try {
      const response = await axios.post(baseUrl, payload);
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "creating the spareparts");
    }
  },
  updateSparePart: async (
    id: string,
    payload: SparePartFormData
  ): Promise<SparePartResponse | ErrorResponse> => {
    try {
      const response = await axios.put(`${baseUrl}/${id}`, payload);
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "updating the spareparts");
    }
  },
  deactiveSparePart: async (
    id: string
  ): Promise<SparePartResponse | ErrorResponse> => {
    try {
      const response = await axios.delete(`${baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "deactive the spareparts");
    }
  },
};

export default sparePartService;

interface GetSparePartsResponse {
  success: boolean;
  message: string;
  data: {
    spareParts: SparePart[];
    pagination: {
      totalPage: number;
      currentPage: number;
      totalItems: number;
    };
  };
}

interface SparePartResponse {
  success: boolean;
  message: string;
  data: {
    sparePart: SparePart;
  };
}
