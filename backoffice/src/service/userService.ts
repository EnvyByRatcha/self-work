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
    limit: number
  ): Promise<GetUsersResponse | ErrorResponse> => {
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
  getUserById: async (
    id: string
  ): Promise<UsersResponse | ErrorResponse> => {
    try {
      const response = await axios.get(`${baseUrl}/${id}`, { headers });
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "fetching the user");
    }
  },
  createUser: async (
    payload: UserFormData
  ): Promise<UsersResponse | ErrorResponse> => {
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
  ): Promise<UsersResponse | ErrorResponse> => {
    try {
      const response = await axios.put(`${baseUrl}/${id}`, payload, {
        headers,
      });
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "updating the user");
    }
  },
  deActiveUser: async (
    id: string
  ): Promise<UsersResponse | ErrorResponse> => {
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

interface UsersResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}
