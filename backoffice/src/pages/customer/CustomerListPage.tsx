import TitleBox from "../../components/common/TitleBox";
import ContentBox from "../../components/common/ContentBox";
import LinkButton from "../../components/common/LinkButton";
import { Pagination } from "@mui/material";
import GenericTable from "../../components/table/GenericTable";
import { customerColumn } from "../../constants/customerColumn";
import useCustomer from "../../hook/customer.hook";

const CustomerListPage = () => {
  const { customers, totalPage, setCurrentPage } = useCustomer();

  return (
    <>
      <TitleBox title={"Customer list"} />
      <ContentBox>
        <LinkButton title="Add customer" to="/customer/create" />
        <GenericTable data={customers} columns={customerColumn} />
      </ContentBox>
    </>
  );
};

export default CustomerListPage;
