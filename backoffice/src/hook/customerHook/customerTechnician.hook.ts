import { useEffect, useState } from "react";
import { useDebounce } from "../useDebounced.hook";
import { User } from "../../interface/IUser";
import useTechnician from "../technician.hook";

const useCustomerTechnician = (customerId: string) => {
  const { getTechnicianByCustomerId } = useTechnician();

  const [technicians, setTechnicians] = useState<User[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 800);
  const [statusFilter, setStatusFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProductUnit();
  }, [customerId, currentPage, limit, debouncedSearchTerm, statusFilter,levelFilter]);

  const fetchProductUnit = async () => {
    setLoading(true);
    setError(null);
    if (!customerId) return;
    try {
      const data = await getTechnicianByCustomerId(
        customerId,
        currentPage,
        limit,
        debouncedSearchTerm,
        statusFilter,
        levelFilter
      );
      if (data?.success) {
        setTechnicians(data.data.technicians);
        setTotalPage(data.data.pagination.totalPage);
      }
    } catch (error) {
      setError("fail to fetching products");
    } finally {
      setLoading(false);
    }
  };

  return {
    technicians,
    currentPage,
    totalPage,
    setCurrentPage,
    setLimit,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    setLevelFilter,
    loading,
    error,
  };
};

export default useCustomerTechnician;
