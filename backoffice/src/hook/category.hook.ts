import { useEffect, useState } from "react";
import categoryService from "../service/categoryService";
import { Category, CategoryFormData } from "../interface/ICategory";

const useCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    fetchCategory(currentPage, limit);
  }, [currentPage]);

  const fetchCategory = async (page: number, limit: number) => {
    const data = await categoryService.getAllCategory(page, limit);
    if (data.categories) {
      setCategories(data.categories);
      setTotalPage(data.page.totalPage);
    }
  };

  const createCustomer = async (payload: CategoryFormData) => {
    const data = await categoryService.createCategory(payload);
    if (data.category) {
      return data;
    }
  };

  return {
    categories,
    createCustomer,
    totalPage,
    setCurrentPage,
    setLimit,
    fetchCategory,
  };
};

export default useCategory;
