import TitleBox from "../../components/common/TitleBox";
import ContentBox from "../../components/common/ContentBox";
import LinkButton from "../../components/common/LinkButton";
import CustomTable from "../../components/table/CustomTable";
import { customerColumn } from "../../constants/customerColumn";
import useCustomer from "../../hook/customer.hook";
import { Pagination } from "@mui/material";

const CustomerListPage = () => {
  const { customers, totalPage, setCurrentPage } = useCustomer();

  return (
    <>
      <TitleBox title={"Customer list"} />
      <ContentBox padding>
        <LinkButton title="Add customer" to="/customer/create" />
        <CustomTable data={customers} columns={customerColumn} isLinkButton />
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

export default CustomerListPage;
