import axios from "axios";
import config from "../config";
import type { Assignment,formData } from "../interface/IAssignment";
import type { ErrorResponse } from "../interface/IError";
import { handleAxiosError } from "../utils/handleAxiosError";

const baseUrl = `${config.apiPath}/assignments`;
const headers = config.headers();

const assignmentService = {
  getAllAssignment: async (
    page: number,
    limit: number
  ): Promise<GetAssignmentsResponse | ErrorResponse> => {
    try {
      const response = await axios.get(
        `${baseUrl}?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "fetching the assignments");
    }
  },
  getAssignmentById: async (
    id: string
  ): Promise<AssignmentResponse | ErrorResponse> => {
    try {
      const response = await axios.get(`${baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "fetching the transition");
    }
  },
  createAssignment: async (
    payload: formData
  ): Promise<AssignmentResponse | ErrorResponse> => {
    try {
      const response = await axios.post(baseUrl, payload, { headers });
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "creating the transition");
    }
  },
  approveAssignment: async (
    id: string
  ): Promise<AssignmentResponse | ErrorResponse> => {
    try {
      const response = await axios.put(`${baseUrl}/approve/${id}`);
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "approve the transition");
    }
  },
};

export default assignmentService;

interface GetAssignmentsResponse {
  success: boolean;
  message: string;
  data: {
    customers: Assignment[];
    pagination: {
      totalPage: number;
      currentPage: number;
      totalItems: number;
    };
  };
}

interface AssignmentResponse {
  success: boolean;
  message: string;
  data: {
    customer: Assignment;
  };
}
