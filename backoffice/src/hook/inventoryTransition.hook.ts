import type {
  InventoryTransitionDetailFormData,
  InventoryTransitionFormData,
} from "../interface/IInventory";
import inventoryTransitionService from "../service/inventoryTransitionService";

const useInventoryTransition = () => {
  const createInventoryTransition = async (
    payload_main: InventoryTransitionFormData,
    payload_sub: InventoryTransitionDetailFormData
  ) => {
    const data = await inventoryTransitionService.createInventoryTransition(
      payload_main,
      payload_sub
    );

  };

  return { createInventoryTransition };
};

export default useInventoryTransition;
