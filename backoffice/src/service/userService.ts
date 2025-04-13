import axios from "axios";
import config from "../config";
import type { User, UserFormData } from "../interface/IUser";

const baseUrl = `${config.apiPath}/users`;

const userService = {
 
  getAllUsers: async (page: number, limit: number): Promise<UsersResponse> => {
    const response = await axios.get(`${baseUrl}?page=${page}&limit=${limit}`);
    return response.data;
  },
  getUserById: async (id: string): Promise<UserResponse> => {
    const response = await axios.get(`${baseUrl}/${id}`);
    return response.data;
  },
  createUser: async (payload: UserFormData): Promise<UserResponse> => {
    const response = await axios.post(`${baseUrl}`, payload);
    return response.data;
  },
  updateUser: async (
    id: string,
    payload: UserFormData
  ): Promise<UserResponse> => {
    const response = await axios.put(`${baseUrl}/${id}`, payload);
    return response.data;
  },
  removeUser: async (id: string): Promise<UserResponse> => {
    const response = await axios.delete(`${baseUrl}/${id}`);
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
