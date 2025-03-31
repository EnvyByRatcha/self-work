import TitleBox from "../../components/common/TitleBox";
import ContentBox from "../../components/common/ContentBox";
import LinkButton from "../../components/common/LinkButton";
import ProductTable from "../../components/table/ProductTable";
import useProduct from "../../hook/product.hook";

const ProductListPage = () => {
  const { products } = useProduct();

  return (
    <>
      <TitleBox title={"User list"} />
      <ContentBox>
        <LinkButton title="Add user" to="/user/create" />
        <ProductTable products={products} />
      </ContentBox>
    </>
  );
};

export default ProductListPage;
