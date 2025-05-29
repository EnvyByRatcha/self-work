import axios from "axios";
import config from "../config";
import type { User, UserFormData } from "../interface/IUser";
import type { ErrorResponse } from "../interface/IError";
import { handleAxiosError } from "../utils/handleAxiosError";

const baseUrl = `${config.apiPath}/users`;
const headers = config.headers();

const userService = {
  getAllUsers: async (
    page: number,
    limit: number,
    search?: string,
    level?: string,
    status?: string
  ): Promise<GetUsersResponse | ErrorResponse> => {
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
  getUserById: async (id: string): Promise<UserResponse | ErrorResponse> => {
    try {
      const response = await axios.get(`${baseUrl}/${id}`, { headers });
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "fetching the user");
    }
  },
  createUser: async (
    payload: UserFormData
  ): Promise<UserResponse | ErrorResponse> => {
    try {
      const response = await axios.post(`${baseUrl}`, payload, { headers });
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "creating the user");
    }
  },
  updateUser: async (
    id: string,
    payload: UserFormData
  ): Promise<UserResponse | ErrorResponse> => {
    try {
      const response = await axios.put(`${baseUrl}/${id}`, payload, {
        headers,
      });
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "updating the user");
    }
  },
  inActiveUser: async (id: string): Promise<UserResponse | ErrorResponse> => {
    try {
      const response = await axios.delete(`${baseUrl}/${id}`, { headers });
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "deactive the user");
    }
  },
};

export default userService;

interface GetUsersResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
    pagination: {
      totalPage: number;
      currentPage: number;
      totalItems: number;
    };
  };
}

interface UserResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}
