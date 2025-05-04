import { useEffect, useState } from "react";
import categoryService from "../service/categoryService";
import { Category, CategoryFormData } from "../interface/ICategory";
import { unwrapOrError } from "../utils/upwrapOrError";

const useCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategory(currentPage, limit);
  }, [currentPage, limit]);

  const fetchCategory = async (
    page: number,
    limit: number,
    search?: string,
    sort?: string,
    order?: "asc" | "desc",
    status?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getAllCategory(
        page,
        limit,
        search,
        sort,
        order,
        status
      );
      const result = unwrapOrError(data);
      setCategories(result.data.categories);
      setTotalPage(result.data.pagination.totalPage)
    } catch (error) {
      setError("fail to fetching category");
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (payload: CategoryFormData) => {
    const data = await categoryService.createCategory(payload);
    return data;
  };

  return {
    categories,
    createCategory,
    totalPage,
    setCurrentPage,
    setLimit,
    fetchCategory,
    loading,
    error,
  };
};

export default useCategory;
