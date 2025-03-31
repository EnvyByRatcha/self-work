import { useEffect, useState } from "react";
import { User } from "../interface/IUser";
import productService from "../service/ProductService";
import { Product } from "../interface/IProduct";

interface userFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  level: string;
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

  return { products };
};

export default useProduct;
