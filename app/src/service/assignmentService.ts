import axios from "axios";
import config from "../config";
import type { ErrorResponse } from "../interface/IError";
import { handleAxiosError } from "../utils/handleAxiosError";
import {
  Assignment,
  AssignmentDetailFormData,
  AssignmentFormData,
  AssignmentWithParts,
} from "../interface/IAssignment";

const baseUrl = `${config.apiPath}/assignments/technician`;
const headers = config.headers();

const assignmentService = {
  getAssignmentByTechnicianId: async (
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
  getAssignmentDetail: async (
    id: string
  ): Promise<AssignmentDetailResponse | ErrorResponse> => {
    try {
      const response = await axios.get(`${baseUrl}/${id}`, { headers });
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "fetching the assignment detail");
    }
  },
  createAssignment: async (
    payload: AssignmentFormData
  ): Promise<AssignmentResponse | ErrorResponse> => {
    try {
      const response = await axios.post(`${baseUrl}`, payload, { headers });
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "create the assignment");
    }
  },
  createAssignmentDetail: async (
    id: string,
    payload: AssignmentDetailFormData
  ): Promise<AssignmentResponse | ErrorResponse> => {
    try {
      const response = await axios.post(`${baseUrl}/${id}`, payload, {
        headers,
      });
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "fetching the assignment detail");
    }
  },
};

export default assignmentService;

interface GetAssignmentsResponse {
  success: boolean;
  message: string;
  data: {
    assignments: Assignment[];
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
    assignment: Assignment;
  };
}

interface AssignmentDetailResponse {
  success: boolean;
  message: string;
  data: {
    assignmentWithParts: AssignmentWithParts;
  };
}
