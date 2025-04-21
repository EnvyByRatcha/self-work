import { useState } from "react";
import type { ProductUnitFormData } from "../interface/IProduct";
import productUnitService from "../service/productUnitService";

const useProductUnit = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const getProductUnitByProductId = async (id: string) => {
    const data = await productUnitService.getAllProductUnit(id, page, limit);
    if (data) {
      return data;
    }
  };

  const createProductUnit = async (payload: ProductUnitFormData) => {
    const data = await productUnitService.createProductUnit(payload);
    if (data) {
      return data;
    }
  };

  return { getProductUnitByProductId, createProductUnit };
};

export default useProductUnit;
