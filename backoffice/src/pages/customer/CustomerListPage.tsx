import TitleBox from "../../components/common/TitleBox";
import ContentBox from "../../components/common/ContentBox";
import LinkButton from "../../components/common/LinkButton";
import CustomTable from "../../components/table/CustomTable";
import { customerColumn } from "../../constants/customerColumn";
import useCustomer from "../../hook/customer.hook";
import { Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useDebounce } from "../../hook/useDebounced.hook";
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
    setSearchTerm,
    setStatusFilter,
    totalPage,
    setCurrentPage,
  } = useCustomer();

  const [searchTermInput, setSearchTermInput] = useState("");
  const debouncedSearchTerm = useDebounce(searchTermInput, 800);

  useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const handleClearSearchTerm = () => {
    setSearchTermInput("");
  };

  const handleChangeSearchTerm = (value: string) => {
    setSearchTermInput(value);
  };

  const handleRemove = () => {};

  return (
    <>
      <TitleBox title={"Customer list"} />
      <ContentBox padding>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Stack direction={"row"} gap={1}>
            <LinkButton title="Add customer" to="/customer/create" />
            <SearchBox
              label="customer"
              type="text"
              searchTerm={searchTermInput}
              onSearchChange={handleChangeSearchTerm}
              onClear={handleClearSearchTerm}
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

        <CustomTable
          data={customers}
          columns={customerColumn}
          isLinkButton
          onRemove={handleRemove}
        />
        <TablePaginate
          totalPage={totalPage}
          onChangePage={(page) => setCurrentPage(page)}
        />
      </ContentBox>
    </>
  );
};

export default CustomerListPage;
