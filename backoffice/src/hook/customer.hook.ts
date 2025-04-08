import { useEffect, useState } from "react";
import { Customer, CustomerFormData } from "../interface/ICustomer";
import customerService from "../service/customerService";

const useCustomer = () => {
  const [customers, setCustomer] = useState<Customer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    fetchCustomer(currentPage, limit);
  }, [currentPage]);

  const fetchCustomer = async (page: number, limit: number) => {
    const data = await customerService.getAllCustomer(page, limit);
    if (data.customers) {
      setCustomer(data.customers);
      setTotalPage(data.page.totalPage);
    }
  };

  const createCustomer = async (payload: CustomerFormData) => {
    const data = await customerService.createCustomer(payload);
    if (data.customer) {
      return data;
    }
  };

  return { customers, createCustomer, totalPage, setCurrentPage, setLimit };
};

export default useCustomer;
