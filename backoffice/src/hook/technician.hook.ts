import { useEffect, useState } from "react";
import technicianService from "../service/technicianService";
import type { User, UserFormDataForUpdate } from "../interface/IUser";
import type { UserFormData } from "../interface/IUser";
import { unwrapOrError } from "../utils/upwrapOrError";

const useTechnician = () => {
  const [technicians, setTechnicians] = useState<User[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTechnician(currentPage, limit, searchTerm, levelFilter, statusFilter);
  }, [currentPage, searchTerm, levelFilter, statusFilter]);

  const fetchTechnician = async (
    page: number,
    limit: number,
    search?: string,
    level?: string,
    status?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await technicianService.getAllTechnician(
        page,
        limit,
        search,
        level,
        status
      );
      const result = unwrapOrError(data);
      setTechnicians(result.data.technicians);
      setTotalPage(result.data.pagination.currentPage);
    } catch (error) {
      setError("fail to fetching users");
    } finally {
      setLoading(false);
    }
  };

  const getTechnicianById = async (id: string) => {
    const data = await technicianService.getTechnicianById(id);
    const result = unwrapOrError(data);
    if (result.success) {
      return result;
    }
  };

  const createTechnician = async (payload: UserFormData) => {
    const data = await technicianService.createTechnician(payload);
    return data;
  };

  const updateTechnicianById = async (
    id: string,
    payload: UserFormDataForUpdate
  ) => {
    const data = await technicianService.updateTechnician(id, payload);
    return data;
  };

  const removeUser = async (id: string) => {
    const data = await technicianService.inActiveTechnician(id);
    fetchTechnician(currentPage, totalPage);
    return data;
  };

  return {
    technicians,
    setSearchTerm,
    setStatusFilter,
    setLevelFilter,
    currentPage,
    totalPage,
    setCurrentPage,
    setTotalPage,
    setLimit,
    createTechnician,getTechnicianById,
    updateTechnicianById,
    removeUser,
    loading,
    error,
  };
};

export default useTechnician;
