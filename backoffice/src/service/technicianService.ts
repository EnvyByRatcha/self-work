import axios from "axios";
import config from "../config";
import type { User, UserFormData, UserFormDataForUpdate } from "../interface/IUser";
import type { ErrorResponse } from "../interface/IError";
import { handleAxiosError } from "../utils/handleAxiosError";

const baseUrl = `${config.apiPath}/technicians`;
const headers = config.headers();

const technicianService = {
  getAllTechnician: async (
    page: number,
    limit: number,
    search?: string,
    level?: string,
    status?: string
  ): Promise<GetTechniciansResponse | ErrorResponse> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) params.append("search", search);
      if (level) params.append("level", level);
      if (status) params.append("status", status);

      const response = await axios.get(`${baseUrl}?${params.toString()}`, {
        headers,
      });
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
    payload: UserFormDataForUpdate
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
  inActiveTechnician: async (
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
