import TitleBox from "../../components/common/TitleBox";
import ContentBox from "../../components/common/ContentBox";
import LinkButton from "../../components/common/LinkButton";
import useTechnician from "../../hook/technician.hook";
import { Stack } from "@mui/material";
import CustomTable from "../../components/table/CustomTable";
import { userColumn } from "../../constants/userColumn";
import SearchBox from "../../components/common/SearchBox";
import { useEffect, useState } from "react";
import { useDebounce } from "../../hook/useDebounced.hook";
import FilterDropDown from "../../components/common/FilterDropDown";
import TablePaginate from "../../components/common/TablePaginate";

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const levelOptions = [
  { label: "All", value: "all" },
  { label: "Technician", value: "technician" },
  { label: "Lead-technician", value: "lead-technician" },
];

const TechnicianListPage = () => {
  const {
    technicians,
    setSearchTerm,
    setLevelFilter,
    setStatusFilter,
    totalPage,
    setCurrentPage,
  } = useTechnician();

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
      <TitleBox title={"Technician list"} />
      <ContentBox padding>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Stack direction={"row"} gap={1}>
            <LinkButton title="Add technician" to="/technician/create" />
            <SearchBox
              label="technician"
              type="text"
              searchTerm={searchTermInput}
              onSearchChange={handleChangeSearchTerm}
              onClear={handleClearSearchTerm}
            />
          </Stack>

          <Stack direction={"row"} gap={1}>
            <FilterDropDown
              title="Level"
              options={levelOptions}
              onSelect={(value) => setLevelFilter(value)}
            />

            <FilterDropDown
              title="Status"
              options={statusOptions}
              onSelect={(value) => setStatusFilter(value)}
            />
          </Stack>
        </Stack>

        <CustomTable
          data={technicians}
          columns={userColumn}
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

export default TechnicianListPage;
