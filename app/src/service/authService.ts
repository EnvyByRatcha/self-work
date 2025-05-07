import axios from "axios";
import config from "../config";

const baseUrl = `${config.apiPath}/auth/technician`;

const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await axios.post(baseUrl, {
      email: email,
      password: password,
    });
    return response.data;
  },
};

export default authService;

interface AuthResponse {
  message: string;
  token?: string;
}
