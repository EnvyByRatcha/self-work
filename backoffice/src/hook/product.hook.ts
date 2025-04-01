import { useEffect, useState } from "react";
import productService from "../service/productService";
import { Product } from "../interface/IProduct";

interface productFormData {
  name: string;
  cost: number;
  price: number;
  categoryName: string;
}

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

  const createProduct = async (payload: productFormData) => {};

  return { products };
};

export default useProduct;
