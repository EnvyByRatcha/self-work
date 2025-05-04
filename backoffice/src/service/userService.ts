import axios from "axios";
import config from "../config";
import type { User, UserFormData } from "../interface/IUser";

const baseUrl = `${config.apiPath}/users`;
const headers = config.headers();

const userService = {
  getAllUsers: async (page: number, limit: number): Promise<UsersResponse> => {
    const response = await axios.get(`${baseUrl}?page=${page}&limit=${limit}`, {
      headers,
    });
    return response.data;
  },
  getUserById: async (id: string): Promise<UserResponse> => {
    const response = await axios.get(`${baseUrl}/${id}`, { headers });
    return response.data;
  },
  createUser: async (payload: UserFormData): Promise<UserResponse> => {
    const response = await axios.post(`${baseUrl}`, payload, { headers });
    return response.data;
  },
  updateUser: async (
    id: string,
    payload: UserFormData
  ): Promise<UserResponse> => {
    const response = await axios.put(`${baseUrl}/${id}`, payload, { headers });
    return response.data;
  },
  removeUser: async (id: string): Promise<UserResponse> => {
    const response = await axios.delete(`${baseUrl}/${id}`, { headers });
    return response.data;
  },
};

export default userService;

interface UserResponse {
  message: string;
  user?: User;
}

interface UsersResponse {
  message: string;
  page: {
    totalPage: number;
    currentPage: number;
  };
  users?: User[];
}
