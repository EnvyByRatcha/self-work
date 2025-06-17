import axios from "axios";
import config from "../config";
import type {
  InventoryTransitionDetail,
  InventoryTransition,
  TransitionFormData,
} from "../interface/IInventory";
import type { ErrorResponse } from "../interface/IError";
import { handleAxiosError } from "../utils/handleAxiosError";

const baseUrl = `${config.apiPath}/inventoryTransition`;
const headers = config.headers();

const inventoryTransitionService = {
  getAllInventoryTransitions: async (
    page: number,
    limit: number,
    search?: string,
    status?: string
  ): Promise<GetTransitionsResponse | ErrorResponse> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) params.append("search", search);
      if (status) params.append("status", status);

      const response = await axios.get(`${baseUrl}?${params.toString()}`, {
        headers,
      });
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "fetching the transitions");
    }
  },
  getInventoryTransitionById: async (
    id: string
  ): Promise<InventoryTransitionWithDetailResponse | ErrorResponse> => {
    try {
      const response = await axios.get(`${baseUrl}/${id}`, { headers });
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "fetching the transition");
    }
  },
  createInventoryTransition: async (
    payload: TransitionFormData
  ): Promise<TransitionResponse | ErrorResponse> => {
    try {
      const response = await axios.post(baseUrl, payload, { headers });
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "creating the transition");
    }
  },
  createTechnicianIssued: async (
    payload: TransitionFormData
  ): Promise<TransitionResponse | ErrorResponse> => {
    try {
      const response = await axios.post(
        `${baseUrl}/technicianIssued`,
        payload,
        { headers }
      );
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "creating the transition");
    }
  },
  createProductTranfered: async (
    payload: TransitionFormData
  ): Promise<TransitionResponse | ErrorResponse> => {
    try {
      const response = await axios.post(
        `${baseUrl}/productTranfered`,
        payload,
        { headers }
      );
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "creating the transition");
    }
  },
  approveTransition: async (
    id: string
  ): Promise<TransitionResponse | ErrorResponse> => {
    try {
      const response = await axios.put(
        `${baseUrl}/approve/${id}`,
        {},
        { headers }
      );
      return response.data;
    } catch (error) {
      return handleAxiosError(error, "approve the transition");
    }
  },
};

export default inventoryTransitionService;

interface GetTransitionsResponse {
  success: boolean;
  message: string;
  data: {
    inventoryTransitions: InventoryTransition[];
    pagination: {
      totalPage: number;
      currentPage: number;
      totalItems: number;
    };
  };
}

interface TransitionResponse {
  success: boolean;
  message: string;
  data: {
    inventoryTransition: InventoryTransition;
  };
}

interface InventoryTransitionWithDetailResponse {
  success: boolean;
  message: string;
  data: {
    inventoryTransition: InventoryTransition;
    inventoryTransitionDetail: InventoryTransitionDetail[];
  };
}
