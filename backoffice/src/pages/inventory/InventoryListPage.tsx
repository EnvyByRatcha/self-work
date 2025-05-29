import TitleBox from "../../components/common/TitleBox";
import ContentBox from "../../components/common/ContentBox";
import LinkButton from "../../components/common/LinkButton";
import useInventoryTransition from "../../hook/inventoryTransition.hook";
import { inventoryTransitionColumn } from "../../constants/inventoryTransitionColumn";
import CustomTable from "../../components/table/CustomTable";
import { Stack } from "@mui/material";
import FilterDropDown from "../../components/common/FilterDropDown";
import { useEffect, useState } from "react";
import { useDebounce } from "../../hook/useDebounced.hook";
import SearchBox from "../../components/common/SearchBox";
import TablePaginate from "../../components/common/TablePaginate";

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Approve", value: "apprve" },
  { label: "Pending", value: "pending" },
];

const InventoryListPage = () => {
  const {
    inventoryTransitions,
    setSearchTerm,
    setStatusFilter,
    totalPage,
    setCurrentPage,
  } = useInventoryTransition();

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
      <TitleBox title={"Inventory management"} />
      <ContentBox padding>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Stack direction={"row"} gap={1}>
            <LinkButton title="Add Transition" to="/inventory/create" />
            <LinkButton
              title="Technician issued"
              to="/inventory/create/technician-issued"
            />

            <SearchBox
              label="user"
              type="text"
              searchTerm={searchTermInput}
              onSearchChange={handleChangeSearchTerm}
              onClear={handleClearSearchTerm}
            />
          </Stack>

          <FilterDropDown
            title="Status"
            options={statusOptions}
            onSelect={(value) => setStatusFilter(value)}
          />
        </Stack>

        <CustomTable
          data={inventoryTransitions}
          columns={inventoryTransitionColumn}
          isLinkButton
        />
        <TablePaginate
          totalPage={totalPage}
          onChangePage={(page) => setCurrentPage(page)}
        />
      </ContentBox>
    </>
  );
};

export default InventoryListPage;
