import { useEffect, useState } from "react";
import sparePartService from "../service/sparePartService";
import type { SparePart, SparePartFormData } from "../interface/ISparePart";

const useSparePart = () => {
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    fetchSparePart(currentPage, limit);
  }, [currentPage]);

  const fetchSparePart = async (page: number, limit: number) => {
    const data = await sparePartService.getAllSparePart(page, limit);
    if (data.spareParts) {
      setSpareParts(data.spareParts);
      setTotalPage(data.page.totalPage);
    }
  };

  const createSparePart = async (payload: SparePartFormData) => {
    const data = await sparePartService.createSparePart(payload);
    if (data) {
      return data;
    }
  };

  return { spareParts, createSparePart, totalPage, setCurrentPage, setLimit };
};

export default useSparePart;
