import TitleBox from "../../components/common/TitleBox";
import ContentBox from "../../components/common/ContentBox";
import LinkButton from "../../components/common/LinkButton";
import useInventoryTransition from "../../hook/inventoryTransition.hook";
import { inventoryTransitionColumn } from "../../constants/inventoryTransitionColumn";
import CustomTable from "../../components/table/CustomTable";
import { Stack } from "@mui/material";
import FilterDropDown from "../../components/common/FilterDropDown";
import SearchBox from "../../components/common/SearchBox";
import TablePaginate from "../../components/common/TablePaginate";

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Approve", value: "apprve" },
  { label: "Pending", value: "pending" },
];

const typeOptions = [
  { label: "All", value: "all" },
  { label: "Stock-in", value: "stock-in" },
  { label: "Technician-issued", value: "technician-issued" },
  { label: "Product-tranfered", value: "product-tranfered" },
];

const InventoryListPage = () => {
  const {
    inventoryTransitions,
    searchTerm,
    setSearchTerm,
    setTypeFilter,
    setStatusFilter,
    totalPage,
    currentPage,
    setCurrentPage,
  } = useInventoryTransition();

  const renderHeaderControls = (
    <Stack direction={{ xs: "column" }} justifyContent={"flex-start"}>
      <Stack direction={"row"} gap={1}>
        <LinkButton title="Add Transition" to="/inventory/create" />
        <LinkButton
          title="Technician issued"
          to="/inventory/create/technician-issued"
        />
        <LinkButton
          title="Product mangement"
          to="/inventory/create/product-management"
        />
      </Stack>

      <Stack direction={"row"} justifyContent={'space-between'} mt={2} spacing={2}>
        <SearchBox
          label="code"
          type="text"
          searchTerm={searchTerm}
          onSearchChange={(value) => setSearchTerm(value)}
          onClear={() => setSearchTerm("")}
        />
        <Stack direction={"row"}>
          <FilterDropDown
            title="Type"
            options={typeOptions}
            onSelect={(value) => setTypeFilter(value)}
          />
          <FilterDropDown
            title="Status"
            options={statusOptions}
            onSelect={(value) => setStatusFilter(value)}
          />
        </Stack>
      </Stack>
    </Stack>
  );

  const renderTableSection = (
    <>
      <CustomTable
        data={inventoryTransitions}
        columns={inventoryTransitionColumn}
        isLinkButton
      />
      <TablePaginate
        currentPage={currentPage}
        totalPage={totalPage}
        onChangePage={(page) => setCurrentPage(page)}
      />
    </>
  );

  return (
    <>
      <TitleBox title={"Inventory management"} />
      <ContentBox padding>
        {renderHeaderControls}
        {renderTableSection}
      </ContentBox>
    </>
  );
};

export default InventoryListPage;
