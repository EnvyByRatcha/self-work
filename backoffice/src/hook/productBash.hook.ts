import { useState } from "react";
import { ProductBash } from "../interface/IProductBash";
import productBashService from "../service/productBashService";

const useProductBash = () => {
  const [productBashes, setProductBashes] = useState<ProductBash[]>([]);

  const getBashByProductId = async (id: string) => {
    const data = await productBashService.getBashByProductId(id);
    if (data) {
      return data;
    }
  };

  return { getBashByProductId };
};

export default useProductBash;
