import { useEffect, useState } from "react";
import userService from "../service/userService";
import type { User } from "../interface/IUser";
import type { UserFormData } from "../interface/IUser";
import { unwrapOrError } from "../utils/upwrapOrError";

const useUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUser(currentPage, limit);
  }, [currentPage]);

  const fetchUser = async (page: number, limit: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAllUsers(page, limit);
      const result = unwrapOrError(data);
      
      setUsers(result.data.users);
      setTotalPage(result.data.pagination.currentPage);
    } catch (error) {
      setError("fail to fetching users");
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (payload: UserFormData) => {
    const data = await userService.createUser(payload);
    return data;
  };

  const removeUser = async (id: string) => {
    const data = await userService.deActiveUser(id);
    fetchUser(currentPage, totalPage);
    return data;
  };

  return {
    users,
    currentPage,
    totalPage,
    setCurrentPage,
    setTotalPage,
    setLimit,
    createUser,
    fetchUser,
    removeUser,
    loading,
    error,
  };
};

export default useUser;
