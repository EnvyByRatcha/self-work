import TitleBox from "../../components/common/TitleBox";
import ContentBox from "../../components/common/ContentBox";
import LinkButton from "../../components/common/LinkButton";
import CustomTable from "../../components/table/CustomTable";
import useSparePart from "../../hook/sparePart.hook";
import { sparePartColumn } from "../../constants/sparePartColumn";

const SparePartListPage = () => {
  const { spareParts } = useSparePart();

  return (
    <>
      <TitleBox title={"Product list"} />
      <ContentBox>
        <LinkButton title="Add Product" to="/product/create" />
        <CustomTable data={spareParts} columns={sparePartColumn} />
      </ContentBox>
    </>
  );
};

export default SparePartListPage;
