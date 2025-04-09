import TitleBox from "../../components/common/TitleBox";
import ContentBox from "../../components/common/ContentBox";
import LinkButton from "../../components/common/LinkButton";

function InventoryListPage() {
  return (
    <>
      <TitleBox title={"Inventory management"} />
      <ContentBox>
        <LinkButton title="Add Product" to="/product/create" />
      </ContentBox>
    </>
  );
}

export default InventoryListPage;
