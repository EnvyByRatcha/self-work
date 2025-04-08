import axios from "axios";
import config from "../config";
import type { SparePart, SparePartFormData } from "../interface/ISparePart";

const baseUrl = `${config.apiPath}/spareParts`;

const sparePartService = {
  getAllSparePart: async (
    page: number,
    limit: number
  ): Promise<SparePartsResponse> => {
    const response = await axios.get(`${baseUrl}?page=${page}&limit=${limit}`);
    return response.data;
  },
  createSparePart: async (
    payload: SparePartFormData
  ): Promise<SparePartResponse> => {
    const response = await axios.post(baseUrl, payload);
    return response.data;
  },
  updateSparePart: async (
    id: string,
    payload: SparePartFormData
  ): Promise<SparePartResponse> => {
    const response = await axios.put(`${baseUrl}/${id}`, payload);
    return response.data;
  },
  removeSparePart: async (id: string): Promise<SparePartResponse> => {
    const response = await axios.delete(`${baseUrl}/${id}`);
    return response.data;
  },
};

export default sparePartService;

interface SparePartResponse {
  message: string;
  sparePart?: SparePart;
}

interface SparePartsResponse {
  message: string;
  page: {
    totalPage: number;
    currentPage: number;
  };
  spareParts: SparePart[];
}
