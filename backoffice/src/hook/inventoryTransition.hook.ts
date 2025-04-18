import inventoryTransitionService from "../service/inventoryTransitionService";
import type {
  InventoryTransitions,
  TransitionFormData,
} from "../interface/IInventory";
import { useEffect, useState } from "react";

const useInventoryTransition = () => {
  const [inventoryTransitions, setInventoryTransitions] = useState<
    InventoryTransitions[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    fetchInventoryTransition(currentPage, limit);
  }, [currentPage]);

  const fetchInventoryTransition = async (page: number, limit: number) => {
    const data = await inventoryTransitionService.getAllInventoryTransitions(
      page,
      limit
    );
    if (data.inventoryTransitions) {
      setInventoryTransitions(data.inventoryTransitions);
      setTotalPage(data.page.totalPage);
    }
  };

  const fetchInventoryTransitionDetail = async (id: string) => {
    const data = await inventoryTransitionService.getInventoryTransitionById(
      id
    );
    if (data.inventoryTransition && data.inventoryTransitionDetail) {
      return data;
    }
  };

  const createInventoryTransition = async (payload: TransitionFormData) => {
    const data = await inventoryTransitionService.createInventoryTransition(
      payload
    );
    if (data) {
      return data;
    }
  };

  return {
    inventoryTransitions,
    fetchInventoryTransitionDetail,
    createInventoryTransition,
    totalPage,
    setCurrentPage,
    setLimit,
  };
};

export default useInventoryTransition;
