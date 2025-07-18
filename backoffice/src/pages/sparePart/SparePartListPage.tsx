import TitleBox from "../../components/common/TitleBox";
import ContentBox from "../../components/common/ContentBox";
import LinkButton from "../../components/common/LinkButton";
import CustomTable from "../../components/table/CustomTable";
import useSparePart from "../../hook/sparePartHook/sparePart.hook";
import { sparePartColumn } from "../../constants/sparePartColumn";
import { Stack } from "@mui/material";
import SearchBox from "../../components/common/SearchBox";
import FilterDropDown from "../../components/common/FilterDropDown";
import TablePaginate from "../../components/common/TablePaginate";

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const SparePartListPage = () => {
  const {
    spareParts,
    searchTerm,
    setSearchTerm,
    setStatusFilter,
    totalPage,
    currentPage,
    setCurrentPage,
  } = useSparePart();

  const renderHeaderControls = (
    <Stack direction={"row"} justifyContent={"space-between"}>
      <Stack direction={"row"} gap={1}>
        <LinkButton title="Add Sparepart" to="/sparePart/create" />
        <SearchBox
          label="serial number"
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
      <CustomTable data={spareParts} columns={sparePartColumn} isLinkButton />
      <TablePaginate
        currentPage={currentPage}
        totalPage={totalPage}
        onChangePage={(page) => setCurrentPage(page)}
      />
    </>
  );
  return (
    <>
      <TitleBox title={"Sparepart list"} />
      <ContentBox padding>
        {renderHeaderControls}
        {renderTableSection}
      </ContentBox>
    </>
  );
};

export default SparePartListPage;
