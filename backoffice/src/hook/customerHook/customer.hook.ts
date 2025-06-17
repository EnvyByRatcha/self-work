import { useEffect, useState } from "react";
import {
  Customer,
  CustomerFormData,
  CustomerFormDataForUpdate,
} from "../../interface/ICustomer";
import customerService from "../../service/customerService";
import { unwrapOrError } from "../../utils/upwrapOrError";
import { useDebounce } from "../useDebounced.hook";

const useCustomer = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 800);
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomer(currentPage, limit, debouncedSearchTerm, statusFilter);
  }, [currentPage, debouncedSearchTerm, statusFilter]);

  const fetchCustomer = async (
    page: number,
    limit: number,
    search?: string,
    status?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await customerService.getAllCustomer(
        page,
        limit,
        search,
        status
      );
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

  const updateCustomerById = async (
    id: string,
    payload: CustomerFormDataForUpdate
  ) => {
    const data = await customerService.updateCustomer(id, payload);
    return data;
  };

  return {
    customers,
    searchTerm,
    setSearchTerm,
    setStatusFilter,
    getCustomerById,
    createCustomer,
    updateCustomerById,
    totalPage,
    currentPage,
    setCurrentPage,
    setLimit,
    loading,
    error,
  };
};

export default useCustomer;
