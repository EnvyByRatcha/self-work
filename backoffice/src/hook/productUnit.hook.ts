import { useEffect, useState } from "react";
import type { ProductUnit, ProductUnitFormData } from "../interface/IProduct";
import productUnitService from "../service/productUnitService";
import { unwrapOrError } from "../utils/upwrapOrError";

const useProductUnit = () => {
  const [productUnits, setProductUnits] = useState<ProductUnit[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {}, [currentPage]);

  const getProductUnitByProductId = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productUnitService.getAllProductUnit(
        id,
        currentPage,
        limit
      );
      const result = unwrapOrError(data);
      if (result.success) {
        setTotalPage(result.data.pagination.totalItems);
        return result;
      }
    } catch (error) {
      setError("fail to fetching productUnits");
    } finally {
      setLoading(false);
    }
  };

  const getProductUnitByCustomerId = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productUnitService.getProductUnitByCustomerId(
        id,
        currentPage,
        limit
      );
      const result = unwrapOrError(data);
      if (result.success) {
        setTotalPage(result.data.pagination.totalItems);
        return result;
      }
    } catch (error) {
      setError("fail to fetching productUnits");
    } finally {
      setLoading(false);
    }
  };
  
  const createProductUnit = async (payload: ProductUnitFormData) => {
    const data = await productUnitService.createProductUnit(payload);
    return data;
  };

  const updateProductUnit = async (id: string, payload: ProductUnit) => {
    const data = await productUnitService.updateProductUnit(id, payload);
    return data;
  };

  return {
    productUnits,
    getProductUnitByProductId,
    getProductUnitByCustomerId,
    createProductUnit,
    updateProductUnit,
    totalPage,
    setCurrentPage,
    setLimit,
    loading,
    error,
  };
};

export default useProductUnit;
