import { useEffect, useState } from "react";
import useProductUnit from "../productUnit.hook";
import { ProductUnit } from "../../interface/IProduct";
import { useDebounce } from "../useDebounced.hook";

const useAllProductUnit = (productId: string) => {
  const { getProductUnitByProductId } = useProductUnit();

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
  }, [productId, currentPage, limit, debouncedSearchTerm, statusFilter]);

  const fetchProductUnit = async () => {
    setLoading(true);
    setError(null);
    if (!productId) return;
    try {
      const data = await getProductUnitByProductId(
        productId,
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
      setError("fail to fetching product units");
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

export default useAllProductUnit;
