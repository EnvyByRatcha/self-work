import { useEffect, useState } from "react";
import sparePartService from "../service/sparePartService";
import type { SparePart, SparePartFormData } from "../interface/ISparePart";
import { unwrapOrError } from "../utils/upwrapOrError";

const useSparePart = () => {
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSparePart(currentPage, limit);
  }, [currentPage]);

  const fetchSparePart = async (page: number, limit: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await sparePartService.getAllSparePart(page, limit);
      const result = unwrapOrError(data);
      setSpareParts(result.data.spareParts);
      setTotalPage(result.data.pagination.totalPage);
    } catch (error) {
      setError("fail to fetching product");
    } finally {
      setLoading(false);
    }
  };

  const getSparePartById = async (id: string) => {
    const data = await sparePartService.getSparePartById(id);
    return data;
  };

  const createSparePart = async (payload: SparePartFormData) => {
    const data = await sparePartService.createSparePart(payload);
    return data;
  };

  return {
    spareParts,
    getSparePartById,
    createSparePart,
    totalPage,
    setCurrentPage,
    setLimit,
    loading,
    error,
  };
};

export default useSparePart;
