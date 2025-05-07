import { useState } from "react";
import type { ProductBatch } from "../interface/IProductBatch";
import productBatchService from "../service/productBatchService";
import { unwrapOrError } from "../utils/upwrapOrError";

const useProductBash = () => {
  const [productBashes, setProductBashes] = useState<ProductBatch[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBashByProductId = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productBatchService.getBatchByProductId(id);
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

  return { getBashByProductId, loading, error };
};

export default useProductBash;
