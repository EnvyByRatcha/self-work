import { useEffect, useState } from "react";
import { User } from "../interface/IUser";
import userService from "../service/UserService";

interface userFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  level: string;
}

const useUser = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const data = await userService.getAllUsers();
    if (data.users) {
      setUsers(data.users);
    }
  };

  const createUser = async (payload: userFormData) => {
    const data = await userService.createUser(payload);
    return data;
  };

  const removeUser = async (id: string) => {
    const data = await userService.removeUser(id);
    return data;
  };

  return { users, createUser, removeUser };
};

export default useUser;
