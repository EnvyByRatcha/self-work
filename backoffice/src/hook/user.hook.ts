import { useEffect, useState } from "react";
import userService from "../service/userService";

import type { User } from "../interface/IUser";
import type { UserFormData } from "../interface/IUser";

const useUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(5);
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    fetchUser(currentPage, limit);
  }, [currentPage]);

  const fetchUser = async (page: number, limit: number) => {
    try {
      const data = await userService.getAllUsers(page, limit);

      if (data.users) {
        setTotalPage(data.page.totalPage);
        setUsers(data.users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createUser = async (payload: UserFormData) => {
    const data = await userService.createUser(payload);
    return data;
  };

  const removeUser = async (id: string) => {
    const data = await userService.removeUser(id);
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
  };
};

export default useUser;
