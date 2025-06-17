import { useEffect, useState } from "react";
import { Assignment } from "../interface/IAssignment";
import { unwrapOrError } from "../utils/upwrapOrError";
import assignmentService from "../service/assignmentService";

const useAssignment = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAssignment(currentPage, limit, searchTerm, statusFilter);
  }, [currentPage, searchTerm, statusFilter]);

  const fetchAssignment = async (
    page: number,
    limit: number,
    search?: string,
    status?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await assignmentService.getAllAssignment(
        page,
        limit,
        search,
        status
      );
      const result = unwrapOrError(data);
      setAssignments(result.data.assignments);
      setTotalPage(result.data.pagination.totalPage);
    } catch (error) {
      setError("fail to fetching products");
    } finally {
      setLoading(false);
    }
  };

  const getAssignmentDetailById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await assignmentService.getAssignmentById(id);
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

  const approveAssignment = async (id: string) => {
    const data = await assignmentService.approveAssignment(id);
    return data;
  };

  return {
    assignments,
    getAssignmentDetailById,
    approveAssignment,
    setSearchTerm,
    setStatusFilter,
    totalPage,
    currentPage,
    setCurrentPage,
    setLimit,
    loading,
    error,
  };
};

export default useAssignment;
