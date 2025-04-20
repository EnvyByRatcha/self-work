import TitleBox from "../../components/common/TitleBox";
import ContentBox from "../../components/common/ContentBox";
import LinkButton from "../../components/common/LinkButton";
import useProduct from "../../hook/product.hook";
import CustomTable from "../../components/table/CustomTable";
import { productColumn } from "../../constants/productColumn";

const ProductListPage = () => {
  const { products } = useProduct();

  return (
    <>
      <TitleBox title={"Product list"} />
      <ContentBox>
        <LinkButton title="Add Product" to="/product/create" />
        <CustomTable data={products} columns={productColumn} isLinkButton />
      </ContentBox>
    </>
  );
};

export default ProductListPage;
