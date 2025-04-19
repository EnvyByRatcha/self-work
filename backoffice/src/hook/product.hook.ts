import { useEffect, useState } from "react";
import productService from "../service/productService";
import type { Product, ProductFormData } from "../interface/IProduct";

const useProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    fetchProduct(currentPage, limit);
  }, [currentPage]);

  const fetchProduct = async (page: number, limit: number) => {
    const data = await productService.getAllProducts(page, limit);
    if (data.products) {
      setProducts(data.products);
      setTotalPage(data.page.totalPage);
    }
  };

  const getProductById = async (id: string) => {
    const data = await productService.getProductById(id);
    if (data.message == "success") {
      return data;
    }
  };

  const createProduct = async (payload: ProductFormData) => {
    const data = await productService.createProduct(payload);
    if (data) {
      return data;
    }
  };

  return {
    products,
    getProductById,
    createProduct,
    totalPage,
    setCurrentPage,
    setLimit,
  };
};

export default useProduct;
