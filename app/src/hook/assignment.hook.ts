import { useEffect, useState } from "react";
import { unwrapOrError } from "../utils/upwrapOrError";
import { Assignment } from "../interface/IAssignment";
import assignmentService from "../service/assignmentService";

const useAssignment = () => {
  const [assignments, setAssignment] = useState<Assignment[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAssignmentByTechnicianId(currentPage, limit);
  }, [currentPage]);

  const fetchAssignmentByTechnicianId = async (page: number, limit: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await assignmentService.getAssignmentByUserId(
        page,
        limit
      );
      const result = unwrapOrError(response);
      if (result.success) {
        setAssignment(result.data.assignments);
        setTotalPage(result.data.pagination.totalPage);
      }
    } catch (error) {
      setError("fail to fetching sparePart");
    } finally {
      setLoading(false);
    }
  };

  return { assignments, totalPage, setCurrentPage, setLimit, loading, error };
};

export default useAssignment;
