import { useEffect, useState } from "react";
import userService from "../service/userService";

import type { User } from "../interface/IUser";
import type { UserFormData } from "../interface/IUser";

const useUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    fetchUser(currentPage, totalPage);
  }, [currentPage]);

  const fetchUser = async (page: number, totalPage: number) => {
    const data = await userService.getAllUsers(page, totalPage);
    if (data.users) {
      console.log(data);

      setUsers(data.users);
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
    createUser,
    fetchUser,
    removeUser,
  };
};

export default useUser;
