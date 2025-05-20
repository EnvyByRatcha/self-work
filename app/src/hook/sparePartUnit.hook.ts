import { useEffect, useState } from "react";
import sparePartUnitService from "../service/sparePartUnitService";
import { unwrapOrError } from "../utils/upwrapOrError";
import { SparePartUnit, SparePartUnitWithBatch } from "../interface/ISparePart";

const useSparePartUnit = () => {
  const [unitWithBatch, setUnitWithBatch] = useState<SparePartUnitWithBatch[]>(
    []
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSparePartUnitByTechnicianId(currentPage, limit);
  }, [currentPage]);

  const fetchSparePartUnitByTechnicianId = async (
    page: number,
    limit: number
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response =
        await sparePartUnitService.getSparePartUnitByTechnicianId(page, limit);
      const result = unwrapOrError(response);
      if (result.success) {
        const grouped = groupUnitsByBatch(result.data.sparePartUnits);
        setUnitWithBatch(grouped);
        setTotalPage(result.data.pagination.totalPage);
      }
    } catch (error) {
      setError("fail to fetching sparePart");
    } finally {
      setLoading(false);
    }
  };

  const groupUnitsByBatch = (
    units: SparePartUnit[]
  ): SparePartUnitWithBatch[] => {
    const batchMap = new Map<string, SparePartUnit[]>();

    units.forEach((unit) => {
      if (!batchMap.has(unit.sparePartBatchId)) {
        batchMap.set(unit.sparePartBatchId, []);
      }
      batchMap.get(unit.sparePartBatchId)!.push(unit);
    });

    return Array.from(batchMap.entries()).map(([batchId, units]) => ({
      batchId,
      units,
    }));
  };

  return { unitWithBatch, totalPage, setCurrentPage, setLimit, loading, error };
};

export default useSparePartUnit;
