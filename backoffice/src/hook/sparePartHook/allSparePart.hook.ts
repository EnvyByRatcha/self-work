import { useEffect, useState } from "react";
import { SparePartUnit } from "../../interface/ISparePart";
import { useDebounce } from "../useDebounced.hook";
import useSparePartUnit from "../sparePartUnit.hook";

const useAllSparePartUnit = (sparePartId: string) => {

  const { getSparePartUnitById } = useSparePartUnit();
  const [sparePartUnits, setSparePartUnits] = useState<SparePartUnit[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 800);
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSparePartUnit();
  }, [sparePartId, currentPage, limit, debouncedSearchTerm, statusFilter]);

  const fetchSparePartUnit = async () => {
    setLoading(true);
    setError(null);
    if (!sparePartId) return;
    try {
      const data = await getSparePartUnitById(
        sparePartId,
        currentPage,
        limit,
        debouncedSearchTerm,
        statusFilter
      );
      if (data?.success) {
        setSparePartUnits(data.data.sparePartUnits);
        setTotalPage(data.data.pagination.totalPage);
      }
    } catch (error) {
      setError("fail to fetching sparepart units");
    } finally {
      setLoading(false);
    }
  };

  return {
    sparePartUnits,
    searchTerm,
    setSearchTerm,
    setStatusFilter,
    currentPage,
    totalPage,
    setCurrentPage,
    setLimit,
    loading,
    error,
  };
};

export default useAllSparePartUnit;
