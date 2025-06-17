import TitleBox from "../../components/common/TitleBox";
import ContentBox from "../../components/common/ContentBox";
import LinkButton from "../../components/common/LinkButton";
import CustomTable from "../../components/table/CustomTable";
import { customerColumn } from "../../constants/customerColumn";
import useCustomer from "../../hook/customerHook/customer.hook";
import { Stack } from "@mui/material";
import SearchBox from "../../components/common/SearchBox";
import FilterDropDown from "../../components/common/FilterDropDown";
import TablePaginate from "../../components/common/TablePaginate";

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const CustomerListPage = () => {
  const {
    customers,
    searchTerm,
    setSearchTerm,
    setStatusFilter,
    totalPage,
    currentPage,
    setCurrentPage,
  } = useCustomer();

  const renderHeaderControls = (
    <Stack direction={"row"} justifyContent={"space-between"}>
      <Stack direction={"row"} gap={1}>
        <LinkButton title="Add customer" to="/customer/create" />
        <SearchBox
          label="customer"
          type="text"
          searchTerm={searchTerm}
          onSearchChange={(value) => setSearchTerm(value)}
          onClear={() => setSearchTerm("")}
        />
      </Stack>

      <Stack direction={"row"} gap={1}>
        <FilterDropDown
          title="Status"
          options={statusOptions}
          onSelect={(value) => setStatusFilter(value)}
        />
      </Stack>
    </Stack>
  );

  const renderTableSection = (
    <>
      <CustomTable data={customers} columns={customerColumn} isLinkButton />
      <TablePaginate
        currentPage={currentPage}
        totalPage={totalPage}
        onChangePage={(page) => setCurrentPage(page)}
      />
    </>
  );

  return (
    <>
      <TitleBox title={"Customer list"} />
      <ContentBox padding>
        {renderHeaderControls}
        {renderTableSection}
      </ContentBox>
    </>
  );
};

export default CustomerListPage;
