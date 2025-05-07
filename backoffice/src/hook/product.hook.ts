import { useEffect, useState } from "react";
import productService from "../service/productService";
import type { Product, ProductFormData } from "../interface/IProduct";
import { unwrapOrError } from "../utils/upwrapOrError";

const useProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProduct(currentPage, limit);
  }, [currentPage]);

  const fetchProduct = async (page: number, limit: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getAllProducts(page, limit);
      const result = unwrapOrError(data);
      setProducts(result.data.products);
      setTotalPage(result.data.pagination.totalPage);
    } catch (error) {
      setError("fail to fetching products");
    } finally {
      setLoading(false);
    }
  };

  const getProductById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProductById(id);
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

  const createProduct = async (payload: ProductFormData) => {
    const data = await productService.createProduct(payload);
    return data;
  };

  return {
    products,
    getProductById,
    createProduct,
    totalPage,
    setCurrentPage,
    setLimit,
    loading,
    error,
  };
};

export default useProduct;
