import { useEffect, useState } from "react";
import sparePartService from "../service/sparePartService";
import type { SparePart, SparePartFormData } from "../interface/ISparePart";

const useSparePart = () => {
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);

  useEffect(() => {
    fetchSparePart();
  }, []);

  const fetchSparePart = async () => {
    const data = await sparePartService.getAllSparePart();
    if (data.spareParts) {
      setSpareParts(data.spareParts);
    }
  };

  const createSparePart = async (payload: SparePartFormData) => {
    const data = await sparePartService.createSparePart(payload);
    if (data.sparePart) {
      return data;
    }
  };

  return { spareParts, createProduct: createSparePart };
};

export default useSparePart;
