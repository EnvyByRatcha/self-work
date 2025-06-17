import { useEffect, useState } from "react";
import reportService from "../service/reportService";
import { unwrapOrError } from "../utils/upwrapOrError";

interface MonthlyCount {
  assignment: number[];
  inventory: number[];
}

const useReport = () => {
  const [assignmentCost, setAssignmentCost] = useState<number[]>([]);
  const [inventoryCost, setInventoryCost] = useState<number[]>([]);

  const [count, setCount] = useState<MonthlyCount>({
    assignment: [],
    inventory: [],
  });

  const [year, setYear] = useState<number>(2025);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReport(year);
  }, [year]);

  const fetchReport = async (year: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportService.getCostAssignmentPerMonth(year);
      const result = unwrapOrError(data);
      if (result.success) {
        setAssignmentCost(result.data.CostPerMonth.assignment);
        setInventoryCost(result.data.CostPerMonth.inventory);
        setCount(result.data.countPerMonth);
      }
    } catch (error) {
      setError("fail to fetching users");
    } finally {
      setLoading(false);
    }
  };

  return {
    assignmentCost,
    inventoryCost,
    count,
    year,
    setYear,
    loading,
    error,
  };
};

export default useReport;
