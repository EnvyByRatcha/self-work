import { useEffect, useState } from "react";
import useProductUnit from "../productUnit.hook";
import { ProductUnit } from "../../interface/IProduct";
import { useDebounce } from "../useDebounced.hook";

const useCustomerProduct = (customerId: string) => {
  const { getProductUnitByCustomerId } = useProductUnit();

  const [productUnits, setProductUnits] = useState<ProductUnit[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 800);
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProductUnit();
  }, [customerId, currentPage, limit, debouncedSearchTerm, statusFilter]);

  const fetchProductUnit = async () => {
    setLoading(true);
    setError(null);
    if (!customerId) return;
    try {
      const data = await getProductUnitByCustomerId(
        customerId,
        currentPage,
        limit,
        debouncedSearchTerm,
        statusFilter
      );
      if (data?.success) {
        setProductUnits(data.data.productUnits);
        setTotalPage(data.data.pagination.totalPage);
      }
    } catch (error) {
      setError("fail to fetching products");
    } finally {
      setLoading(false);
    }
  };

  return {
    productUnits,
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

export default useCustomerProduct;
