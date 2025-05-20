import { useEffect, useState } from "react";
import categoryService from "../service/categoryService";
import { Category, CategoryFormData } from "../interface/ICategory";
import { unwrapOrError } from "../utils/upwrapOrError";

const useCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategory(currentPage, limit, searchTerm, statusFilter);
  }, [currentPage, limit, searchTerm, statusFilter]);

  const fetchCategory = async (
    page: number,
    limit: number,
    search?: string,
    status?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryService.getAllCategory(
        page,
        limit,
        search,
        status
      );
      const result = unwrapOrError(response);
      setCategories(result.data.categories);
      setTotalPage(result.data.pagination.totalPage);
    } catch (error) {
      setError("fail to fetching category");
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (payload: CategoryFormData) => {
    const response = await categoryService.createCategory(payload);
    if (response.success) {
      fetchCategory(currentPage, limit);
    }
    return response;
  };

  const updateCategoryById = async (id: string, payload: CategoryFormData) => {
    const response = await categoryService.updateCategory(id, payload);
    if (response.success) {
      fetchCategory(currentPage, limit);
    }
    return response;
  };

  const inactiveCategory = async (id: string) => {
    const response = await categoryService.inactiveCategory(id);
    if (response.success) {
      fetchCategory(currentPage, limit);
    }
    return response;
  };

  return {
    categories,
    setSearchTerm,
    setStatusFilter,
    createCategory,
    updateCategoryById,
    inactiveCategory,
    totalPage,
    setCurrentPage,
    setLimit,
    fetchCategory,
    loading,
    error,
  };
};

export default useCategory;
