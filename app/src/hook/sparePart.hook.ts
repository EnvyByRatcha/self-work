import { useState } from "react";
import sparePartService from "../service/sparePartService";
import { unwrapOrError } from "../utils/upwrapOrError";

const useSparePart = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSparePartByProductSn = async (sn: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await sparePartService.getSparePartBySerialNumber(sn);
      const result = unwrapOrError(data);
      if (result.success) {
        return result;
      }
    } catch (error) {
      setError("fail to fetching sparePart with ID");
    } finally {
      setLoading(false);
    }
  };

  return { getSparePartByProductSn, loading, error };
};

export default useSparePart;
