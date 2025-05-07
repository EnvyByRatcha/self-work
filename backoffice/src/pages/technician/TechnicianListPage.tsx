import TitleBox from "../../components/common/TitleBox";
import ContentBox from "../../components/common/ContentBox";
import LinkButton from "../../components/common/LinkButton";
import useTechnician from "../../hook/technician.hook";
import { Pagination } from "@mui/material";
import CustomTable from "../../components/table/CustomTable";
import { userColumn } from "../../constants/userColumn";

const TechnicianListPage = () => {
  const { technicians, totalPage, setCurrentPage } = useTechnician();

  return (
    <>
      <TitleBox title={"Technician list"} />
      <ContentBox padding>
        <LinkButton title="Add technician" to="/technician/create" />
        <CustomTable data={technicians} columns={userColumn} isLinkButton />
        <Pagination
          count={totalPage}
          sx={{
            marginTop: "12px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          onChange={(_, page) => setCurrentPage(page)}
          shape="rounded"
          size="small"
        />
      </ContentBox>
    </>
  );
};

export default TechnicianListPage;
