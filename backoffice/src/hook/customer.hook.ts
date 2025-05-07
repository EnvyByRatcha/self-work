import { useEffect, useState } from "react";
import { Customer, CustomerFormData } from "../interface/ICustomer";
import customerService from "../service/customerService";
import { unwrapOrError } from "../utils/upwrapOrError";

const useCustomer = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomer(currentPage, limit);
  }, [currentPage]);

  const fetchCustomer = async (page: number, limit: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await customerService.getAllCustomer(page, limit);
      const result = unwrapOrError(data);
      setCustomers(result.data.customers);
      setTotalPage(result.data.pagination.totalPage);
    } catch (error) {
      setError("fail to fetching products");
    } finally {
      setLoading(false);
    }
  };

  const getCustomerById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await customerService.getCustomerById(id);
      const result = unwrapOrError(data);
      if (result.success) {
        return result;
      }
    } catch (error) {
      setError("fail to fetching product");
    } finally {
      setLoading(false);
    }
  };

  const createCustomer = async (payload: CustomerFormData) => {
    const data = await customerService.createCustomer(payload);
    return data;
  };

  return {
    customers,
    getCustomerById,
    createCustomer,
    totalPage,
    setCurrentPage,
    setLimit,
    loading,
    error,
  };
};

export default useCustomer;
