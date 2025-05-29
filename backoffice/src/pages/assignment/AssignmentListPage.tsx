import { useEffect, useState } from "react";
import ContentBox from "../../components/common/ContentBox";
import TitleBox from "../../components/common/TitleBox";
import CustomTable from "../../components/table/CustomTable";
import useAssignment from "../../hook/assignment.hook";
import { useDebounce } from "../../hook/useDebounced.hook";
import { assignmentColumn } from "../../constants/assignmentColumn";
import TablePaginate from "../../components/common/TablePaginate";
import { Stack } from "@mui/material";
import LinkButton from "../../components/common/LinkButton";
import SearchBox from "../../components/common/SearchBox";
import FilterDropDown from "../../components/common/FilterDropDown";

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Approve", value: "apprve" },
  { label: "Pending", value: "pending" },
];

function AssignmentListPage() {
  const {
    assignments,
    setSearchTerm,
    setStatusFilter,
    totalPage,
    setCurrentPage,
  } = useAssignment();

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

  return (
    <>
      <TitleBox title={"Assignment list"} />
      <ContentBox padding>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Stack direction={"row"} gap={1}>
            <LinkButton title="Add assignment" to="/assignment/create" />
            <SearchBox
              label="serial no."
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
          data={assignments}
          columns={assignmentColumn}
          isLinkButton
        />
        <TablePaginate
          totalPage={totalPage}
          onChangePage={(page) => setCurrentPage(page)}
        />
      </ContentBox>
    </>
  );
}

export default AssignmentListPage;
