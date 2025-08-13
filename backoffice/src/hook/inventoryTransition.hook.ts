import inventoryTransitionService from "../service/inventoryTransitionService";
import type {
  InventoryTransition,
  TransitionFormData,
} from "../interface/IInventory";
import { useEffect, useState } from "react";
import { unwrapOrError } from "../utils/upwrapOrError";
import { useDebounce } from "./useDebounced.hook";

const useInventoryTransition = () => {
  const [inventoryTransitions, setInventoryTransitions] = useState<
    InventoryTransition[]
  >([]);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 800);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInventoryTransition(
      currentPage,
      limit,
      debouncedSearchTerm,
      typeFilter,
      statusFilter
    );
  }, [currentPage, limit, debouncedSearchTerm, typeFilter, statusFilter]);

  const fetchInventoryTransition = async (
    page: number,
    limit: number,
    search?: string,
    type?: string,
    status?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await inventoryTransitionService.getAllInventoryTransitions(
        page,
        limit,
        search,
        type,
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

  const rejectTransition = async (id: string) => {
    const data = await inventoryTransitionService.rejectTransition(id);
    return data;
  };

  return {
    inventoryTransitions,
    searchTerm,
    setSearchTerm,
    setTypeFilter,
    setStatusFilter,
    getInventoryTransitionDetailById,
    createInventoryTransition,
    createTechnicianIssued,
    createProductTranfered,
    approveTransition,
    rejectTransition,
    totalPage,
    currentPage,
    setCurrentPage,
    setLimit,
    loading,
    error,
  };
};

export default useInventoryTransition;
