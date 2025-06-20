import inventoryTransitionService from "../service/inventoryTransitionService";
import type {
  InventoryTransition,
  TransitionFormData,
} from "../interface/IInventory";
import { useEffect, useState } from "react";
import { unwrapOrError } from "../utils/upwrapOrError";

const useInventoryTransition = () => {
  const [inventoryTransitions, setInventoryTransitions] = useState<
    InventoryTransition[]
  >([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInventoryTransition(currentPage, limit, searchTerm, statusFilter);
  }, [currentPage, limit, searchTerm, statusFilter]);

  const fetchInventoryTransition = async (
    page: number,
    limit: number,
    search?: string,
    status?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await inventoryTransitionService.getAllInventoryTransitions(
        page,
        limit,
        search,
        status
      );
      const result = unwrapOrError(data);
      if (result.success) {
        setInventoryTransitions(result.data.inventoryTransitions);
        setTotalPage(result.data.pagination.totalPage);
      }
    } catch (error) {
      setError("fail to fetching transitions");
    } finally {
      setLoading(false);
    }
  };

  const getInventoryTransitionDetailById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await inventoryTransitionService.getInventoryTransitionById(
        id
      );
      const result = unwrapOrError(data);
      if (result.success) {
        return result;
      }
    } catch (error) {
      setError("fail to fetching transition");
    } finally {
      setLoading(false);
    }
  };

  const createInventoryTransition = async (payload: TransitionFormData) => {
    const data = await inventoryTransitionService.createInventoryTransition(
      payload
    );
    return data;
  };

  const createTechnicianIssued = async (payload: TransitionFormData) => {
    const data = await inventoryTransitionService.createTechnicianIssued(
      payload
    );
    return data;
  };

  const createProductTranfered = async (payload: TransitionFormData) => {
    const data = await inventoryTransitionService.createProductTranfered(
      payload
    );
    return data;
  };

  const approveTransition = async (id: string) => {
    const data = await inventoryTransitionService.approveTransition(id);
    return data;
  };

  return {
    inventoryTransitions,
    setSearchTerm,
    setStatusFilter,
    getInventoryTransitionDetailById,
    createInventoryTransition,
    createTechnicianIssued,
    createProductTranfered,
    approveTransition,
    totalPage,
    currentPage,
    setCurrentPage,
    setLimit,
    loading,
    error,
  };
};

export default useInventoryTransition;
