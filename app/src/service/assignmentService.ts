import axios from "axios";
import config from "../config";
import type { ErrorResponse } from "../interface/IError";
import { handleAxiosError } from "../utils/handleAxiosError";
import { Assignment, formData } from "../interface/IAssignment";

const baseUrl = `${config.apiPath}/assignments/technician`;
const headers = config.headers();

const assignmentService = {
  getAssignmentByUserId: async (
    page: number,
    limit: number
  ): Promise<GetAssignmentsResponse | ErrorResponse> => {
    try {
      const response = await axios.get(
        `${baseUrl}?page=${page}&limit=${limit}`,
        { headers }
      );
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "fetching the assignments");
    }
  },
  createAssignment: async (
    payload: formData
  ): Promise<AssignmentResponse | ErrorResponse> => {
    try {
      const response = await axios.post(`${baseUrl}`,payload, { headers });
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "fetching the assignments");
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
