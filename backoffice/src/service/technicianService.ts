import axios from "axios";
import config from "../config";
import type { User, UserFormData } from "../interface/IUser";
import type { ErrorResponse } from "../interface/IError";
import { handleAxiosError } from "../utils/handleAxiosError";

const baseUrl = `${config.apiPath}/technicians`;
const headers = config.headers();

const technicianService = {
  getAllTechnician: async (
    page: number,
    limit: number
  ): Promise<GetTechniciansResponse | ErrorResponse> => {
    try {
      const response = await axios.get(
        `${baseUrl}?page=${page}&limit=${limit}`,
        {
          headers,
        }
      );
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "fetching the users");
    }
  },
  getTechnicianById: async (
    id: string
  ): Promise<TechnicianResponse | ErrorResponse> => {
    try {
      const response = await axios.get(`${baseUrl}/${id}`, { headers });
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "fetching the user");
    }
  },
  createTechnician: async (
    payload: UserFormData
  ): Promise<TechnicianResponse | ErrorResponse> => {
    try {
      const response = await axios.post(`${baseUrl}`, payload, { headers });
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "creating the user");
    }
  },
  updateTechnician: async (
    id: string,
    payload: UserFormData
  ): Promise<TechnicianResponse | ErrorResponse> => {
    try {
      const response = await axios.put(`${baseUrl}/${id}`, payload, {
        headers,
      });
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "updating the user");
    }
  },
  deActiveTechnician: async (
    id: string
  ): Promise<TechnicianResponse | ErrorResponse> => {
    try {
      const response = await axios.delete(`${baseUrl}/${id}`, { headers });
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "deactive the user");
    }
  },
};

export default technicianService;

interface GetTechniciansResponse {
  success: boolean;
  message: string;
  data: {
    technicians: User[];
    pagination: {
      totalPage: number;
      currentPage: number;
      totalItems: number;
    };
  };
}

interface TechnicianResponse {
  success: boolean;
  message: string;
  data: {
    technician: User;
  };
}
