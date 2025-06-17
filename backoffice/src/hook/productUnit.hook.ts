import { useState } from "react";
import type { ProductUnit, ProductUnitFormData } from "../interface/IProduct";
import productUnitService from "../service/productUnitService";
import { unwrapOrError } from "../utils/upwrapOrError";

const useProductUnit = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProductUnitByProductId = async (
    id: string,
    page: number,
    limit: number,
    search?: string,
    status?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productUnitService.getAllProductUnit(
        id,
        page,
        limit,
        search,
        status
      );
      const result = unwrapOrError(data);
      if (result.success) {
        return result;
      }
    } catch (error) {
      setError("fail to fetching productUnits");
    } finally {
      setLoading(false);
    }
  };

  const getProductUnitByCustomerId = async (
    id: string,
    page: number,
    limit: number,
    search?: string,
    status?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productUnitService.getProductUnitByCustomerId(
        id,
        page,
        limit,
        search,
        status
      );
      const result = unwrapOrError(data);
      if (result.success) {
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
    getProductUnitByProductId,
    getProductUnitByCustomerId,
    createProductUnit,
    updateProductUnit,
    loading,
    error,
  };
};

export default useProductUnit;
