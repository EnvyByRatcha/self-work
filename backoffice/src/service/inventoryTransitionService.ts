import axios from "axios";
import config from "../config";
import type {
  InventoryTransitionDetail,
  InventoryTransitions,
  TransitionFormData,
} from "../interface/IInventory";

const baseUrl = `${config.apiPath}/inventoryTransition`;
const headers = config.headers();

const inventoryTransitionService = {
  getAllInventoryTransitions: async (
    page: number,
    limit: number
  ): Promise<GetResponseInventoryTransitions> => {
    const response = await axios.get(`${baseUrl}?page=${page}&limit=${limit}`);
    return response.data;
  },
  getInventoryTransitionById: async (
    id: string
  ): Promise<GetResponseInventoryTransition> => {
    const response = await axios.get(`${baseUrl}/${id}`);
    return response.data;
  },
  createInventoryTransition: async (
    payload: TransitionFormData
  ): Promise<InventoryTransitionResponse> => {
    const response = await axios.post(baseUrl, payload, { headers });
    return response.data;
  },
};

export default inventoryTransitionService;

interface GetResponseInventoryTransitions {
  message: string;
  page: {
    totalPage: number;
    currentPage: number;
  };
  inventoryTransitions: InventoryTransitions[];
}

interface GetResponseInventoryTransition {
  message: string;
  inventoryTransition: InventoryTransitions;
  inventoryTransitionDetail: InventoryTransitionDetail[];
}

interface InventoryTransitionResponse {
  message: string;
  inventoryTransition?: InventoryTransitions;
}
