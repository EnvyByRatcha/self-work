import { useEffect, useState } from "react";
import sparePartService from "../../service/sparePartService";
import type { SparePart, SparePartFormData } from "../../interface/ISparePart";
import { unwrapOrError } from "../../utils/upwrapOrError";
import { useDebounce } from "../useDebounced.hook";

const useSparePart = () => {
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 800);
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSparePart(currentPage, limit, debouncedSearchTerm, statusFilter);
  }, [currentPage, limit, debouncedSearchTerm, statusFilter]);

  const fetchSparePart = async (
    page: number,
    limit: number,
    search?: string,
    status?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await sparePartService.getAllSparePart(
        page,
        limit,
        search,
        status
      );
      const result = unwrapOrError(data);
      setSpareParts(result.data.spareParts);
      setTotalPage(result.data.pagination.totalPage);
    } catch (error) {
      setError("fail to fetching sparePart");
    } finally {
      setLoading(false);
    }
  };

  const getSparePartById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await sparePartService.getSparePartById(id);
      const result = unwrapOrError(data);
      if (result.success) {
        return result;
      }
    } catch (error) {
      setError("fail to fetching sparePart with ID");
    } finally {
      setLoading(false);
    }
  };

  const createSparePart = async (payload: SparePartFormData) => {
    const data = await sparePartService.createSparePart(payload);
    return data;
  };

  return {
    spareParts,
    searchTerm,
    setSearchTerm,
    setStatusFilter,
    getSparePartById,
    createSparePart,
    totalPage,
    currentPage,
    setCurrentPage,
    setLimit,
    loading,
    error,
  };
};

export default useSparePart;
