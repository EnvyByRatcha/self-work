import { useEffect, useState } from "react";
import userService from "../service/userService";
import type { User, UserFormDataForUpdate } from "../interface/IUser";
import type { UserFormData } from "../interface/IUser";
import { unwrapOrError } from "../utils/upwrapOrError";
import { useDebounce } from "./useDebounced.hook";

const useUser = () => {
  const [users, setUsers] = useState<User[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 800);
  const [statusFilter, setStatusFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUser(
      currentPage,
      limit,
      debouncedSearchTerm,
      levelFilter,
      statusFilter
    );
  }, [currentPage, limit, debouncedSearchTerm, levelFilter, statusFilter]);

  const fetchUser = async (
    page: number,
    limit: number,
    search?: string,
    level?: string,
    status?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAllUsers(
        page,
        limit,
        search,
        level,
        status
      );
      const result = unwrapOrError(data);
      setUsers(result.data.users);
      setTotalPage(result.data.pagination.totalPage);
    } catch (error) {
      setError("fail to fetching users");
    } finally {
      setLoading(false);
    }
  };

  const getUserById = async (id: string) => {
    const data = await userService.getUserById(id);
    const result = unwrapOrError(data);
    if (result.success) {
      return result;
    }
  };

  const createUser = async (payload: UserFormData) => {
    const data = await userService.createUser(payload);
    return data;
  };

  const updateUserById = async (id: string, payload: UserFormDataForUpdate) => {
    const data = await userService.updateUser(id, payload);
    return data;
  };

  const removeUser = async (id: string) => {
    const data = await userService.inActiveUser(id);
    fetchUser(currentPage, totalPage);
    return data;
  };

  return {
    users,
    searchTerm,
    setSearchTerm,
    setStatusFilter,
    setLevelFilter,
    currentPage,
    totalPage,
    setCurrentPage,
    setTotalPage,
    setLimit,
    createUser,
    updateUserById,
    getUserById,
    fetchUser,
    removeUser,
    loading,
    error,
  };
};

export default useUser;
