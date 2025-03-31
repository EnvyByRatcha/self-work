import axios from "axios";
import config from "../config";
import type { User, UserFormData } from "../interface/IUser";

const baseUrl = `${config.apiPath}/users`;

const userService = {
  // login: async (
  //   email: string,
  //   password: string,
  //   navigate: (path: string) => void
  // ) => {
  //   const response = await axios.post(`${config.apiPath}/auth`, {
  //     email: email,
  //     password: password,
  //   });
  //   if (response.status == 200) {
  //     localStorage.setItem("token", response.data.token);
  //     navigate("/dashboard");
  //   }
  // },
  getAllUsers: async (): Promise<UsersResponse> => {
    const response = await axios.get(baseUrl);
    return response.data;
  },
  getUserById: async (id: string): Promise<User> => {
    const response = await axios.get(`${baseUrl}/${id}`);
    const data: User = response.data;
    return data;
  },
  createUser: async (payload: UserFormData): Promise<UsersResponse> => {
    const response = await axios.post(`${baseUrl}`, payload);
    return response.data;
  },
  updateUser: async (
    id: string,
    payload: UserFormData
  ): Promise<UsersResponse> => {
    const response = await axios.put(`${baseUrl}/${id}`, payload);
    return response.data;
  },
  removeUser: async (id: string): Promise<UsersResponse> => {
    const response = await axios.delete(`${baseUrl}/${id}`);
    return response.data;
  },
};

export default userService;

interface UsersResponse {
  message: string;
  users?: User[];
}
