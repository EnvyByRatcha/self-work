import { useEffect, useState } from "react";
import sparePartUnitService from "../service/sparePartUnitService";
import { unwrapOrError } from "../utils/upwrapOrError";
import { SparePartUnit, SparePartUnitFormData } from "../interface/ISparePart";

const useSparePartUnit = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {}, [currentPage]);

  const getSparePartUnitBySparePartId = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await sparePartUnitService.getSparePartUnitBySparePartId(
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

  // const getProductUnitByCustomerId = async (id: string) => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const data = await sparePArtUnitService.getProductUnitByCustomerId(
  //       id,
  //       currentPage,
  //       limit
  //     );
  //     const result = unwrapOrError(data);
  //     if (result.success) {
  //       setTotalPage(result.data.pagination.totalItems);
  //       return result;
  //     }
  //   } catch (error) {
  //     setError("fail to fetching productUnits");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const createSparePartUnit = async (payload: SparePartUnitFormData) => {
    const data = await sparePartUnitService.createSparePartUnit(payload);
    return data;
  };

  const updateSparePartUnit = async (id: string, payload: SparePartUnit) => {
    const data = await sparePartUnitService.updateSparePartUnit(id, payload);
    return data;
  };

  return {
    getSparePartUnitBySparePartId,
    createSparePartUnit,
    updateSparePartUnit,
    totalPage,
    setCurrentPage,
    setLimit,
    loading,
    error,
  };
};

export default useSparePartUnit;
