import ContentBox from "../../components/common/ContentBox";
import TitleBox from "../../components/common/TitleBox";
import ProductForm from "../../components/form/ProductForm";
import useProduct from "../../hook/product.hook";
import type { ProductFormData } from "../../interface/IProduct";
import { useNavigate } from "react-router-dom";

const ProductCreatePage = () => {
  const { createProduct } = useProduct();
  const navigate = useNavigate();

  const handleProductFormSubmit = (userFormData: ProductFormData) => {
    createProduct(userFormData).then((data) => {
      if (data?.message == "success") {
        navigate("/product");
      }
    });
  };

  return (
    <>
      <TitleBox title="Add product" />
      <ContentBox>
        <ProductForm onSubmit={handleProductFormSubmit} />
      </ContentBox>
    </>
  );
};

export default ProductCreatePage;
