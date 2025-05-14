import { useState } from "react";
import { unwrapOrError } from "../utils/upwrapOrError";
import { SparePartBatch } from "../interface/ISparePart";
import sparePartBatchService from "../service/sparePartBatchService";

const useSparePartBatch = () => {
  const [sparePartBatches, setSparePartBatches] = useState<SparePartBatch[]>(
    []
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBatchBySparePartId = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await sparePartBatchService.getBatchBySparePartId(id);
      const result = unwrapOrError(data);
      if (result.success) {
        return result;
      }
    } catch (error) {
      setError("fail to fetching transition");
    } finally {
      setLoading(false);
    }
  };

  return { getBatchBySparePartId, loading, error };
};

export default useSparePartBatch;
