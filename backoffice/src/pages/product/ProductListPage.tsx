import TitleBox from "../../components/common/TitleBox";
import ContentBox from "../../components/common/ContentBox";
import LinkButton from "../../components/common/LinkButton";
import useProduct from "../../hook/product.hook";
import CustomTable from "../../components/table/CustomTable";
import { productColumn } from "../../constants/productColumn";
import { Pagination } from "@mui/material";

const ProductListPage = () => {
  const { products, totalPage, setCurrentPage } = useProduct();

  return (
    <>
      <TitleBox title={"Product list"} />
      <ContentBox padding>
        <LinkButton title="Add Product" to="/product/create" />
        <CustomTable data={products} columns={productColumn} isLinkButton />
        <Pagination
          count={totalPage}
          color="primary"
          sx={{
            marginTop: "12px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          onChange={(_, page) => setCurrentPage(page)}
        />
      </ContentBox>
    </>
  );
};

export default ProductListPage;
