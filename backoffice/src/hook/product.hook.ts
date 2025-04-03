import { useEffect, useState } from "react";
import productService from "../service/productService";
import type { Product, ProductFormData } from "../interface/IProduct";

const useProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    const data = await productService.getAllProducts();
    if (data.products) {
      setProducts(data.products);
    }
  };

  const createProduct = async (payload: ProductFormData) => {
    const data = await productService.createProduct(payload);
    if (data.product) {
      return data;
    }
  };

  return { products,createProduct };
};

export default useProduct;
