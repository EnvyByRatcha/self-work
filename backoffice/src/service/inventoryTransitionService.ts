import axios from "axios";
import config from "../config";
import type {
  InventoryTransitionDetailFormData,
  InventoryTransitionFormData,
} from "../interface/IInventory";

const baseUrl = `${config.apiPath}/inventoryTransition`;

const inventoryTransitionService = {
  createInventoryTransition: async (
    payload_main: InventoryTransitionFormData,
    payload_sub: InventoryTransitionDetailFormData
  ) => {
    const payload = {
      transitionType: payload_main.transitionType,
      form: payload_main.from,
      to: payload_main.to,
      detail: payload_sub,
    };
    console.log(payload);

    // const response = await axios.post(baseUrl, payload);
    // return response.data;
  },
};

export default inventoryTransitionService;
