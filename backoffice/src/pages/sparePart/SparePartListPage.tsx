import TitleBox from "../../components/common/TitleBox";
import ContentBox from "../../components/common/ContentBox";
import LinkButton from "../../components/common/LinkButton";
import CustomTable from "../../components/table/CustomTable";
import useSparePart from "../../hook/sparePart.hook";
import { sparePartColumn } from "../../constants/sparePartColumn";
import { Pagination } from "@mui/material";

const SparePartListPage = () => {
  const { spareParts, totalPage, setCurrentPage } = useSparePart();

  return (
    <>
      <TitleBox title={"Sparepart list"} />
      <ContentBox padding>
        <LinkButton title="Add Sparepart" to="/sparePart/create" />
        <CustomTable data={spareParts} columns={sparePartColumn} isLinkButton />
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

export default SparePartListPage;
