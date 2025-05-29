import { useEffect, useState } from "react";
import sparePartUnitService from "../service/sparePartUnitService";
import { unwrapOrError } from "../utils/upwrapOrError";
import { sparePartUnits } from "../interface/ISparePart";

const useSparePartUnit = () => {
  const [sparePartUnits, setSparePartUnits] = useState<sparePartUnits[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSparePartUnitByTechnicianId();
  }, []);

  const fetchSparePartUnitByTechnicianId = async () => {
    setLoading(true);
    setError(null);
    try {
      const response =
        await sparePartUnitService.getSparePartUnitByTechnicianId();
      const result = unwrapOrError(response);
      if (result.success) {
        setSparePartUnits(result.data.sparePartUnits);
      }
    } catch (error) {
      setError("fail to fetching sparePart");
    } finally {
      setLoading(false);
    }
  };

  return {
    sparePartUnits,
    setSparePartUnits,
    loading,
    error,
  };
};

export default useSparePartUnit;
