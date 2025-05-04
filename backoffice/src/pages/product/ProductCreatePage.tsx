import TitleBox from "../../components/common/TitleBox";
import ContentBox from "../../components/common/ContentBox";
import ProductForm from "../../components/form/ProductForm";
import useProduct from "../../hook/product.hook";
import type { ProductFormData } from "../../interface/IProduct";
import { useNavigate } from "react-router-dom";

import { Notyf } from "notyf";

const notyf = new Notyf();

const ProductCreatePage = () => {
  const { createProduct } = useProduct();

  const navigate = useNavigate();

  const handleProductFormSubmit = async (productFormData: ProductFormData) => {
    const data = await createProduct(productFormData);
    if (data?.success) {
      notyf.success(data.message);
      setTimeout(() => {
        navigate("/product");
      }, 2000);
      return;
    }
    notyf.error(data?.message);
  };

  return (
    <>
      <TitleBox title="Add product" />
      <ContentBox padding>
        <ProductForm onSubmit={handleProductFormSubmit} />
      </ContentBox>
    </>
  );
};

export default ProductCreatePage;
