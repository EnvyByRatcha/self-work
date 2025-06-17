import { useState } from "react";
import sparePartUnitService from "../service/sparePartUnitService";
import { unwrapOrError } from "../utils/upwrapOrError";
import { SparePartUnit, SparePartUnitFormData } from "../interface/ISparePart";

const useSparePartUnit = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSparePartUnitById = async (
    id: string,
    page: number,
    limit: number,
    search?: string,
    status?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await sparePartUnitService.getSparePartUnitBySparePartId(
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

  const createSparePartUnit = async (payload: SparePartUnitFormData) => {
    const data = await sparePartUnitService.createSparePartUnit(payload);
    return data;
  };

  const updateSparePartUnit = async (id: string, payload: SparePartUnit) => {
    const data = await sparePartUnitService.updateSparePartUnit(id, payload);
    return data;
  };

  return {
    getSparePartUnitById,
    createSparePartUnit,
    updateSparePartUnit,
    loading,
    error,
  };
};

export default useSparePartUnit;
