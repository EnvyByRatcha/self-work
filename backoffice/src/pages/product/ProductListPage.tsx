import TitleBox from "../../components/common/TitleBox";
import ContentBox from "../../components/common/ContentBox";
import LinkButton from "../../components/common/LinkButton";
import useProduct from "../../hook/productHook/product.hook";
import CustomTable from "../../components/table/CustomTable";
import { productColumn } from "../../constants/productColumn";
import { Stack } from "@mui/material";
import SearchBox from "../../components/common/SearchBox";
import FilterDropDown from "../../components/common/FilterDropDown";
import TablePaginate from "../../components/common/TablePaginate";

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const ProductListPage = () => {
  const {
    products,
    searchTerm,
    setSearchTerm,
    setStatusFilter,
    totalPage,
    currentPage,
    setCurrentPage,
  } = useProduct();

  const renderHeaderControls = (
    <Stack direction={"row"} justifyContent={"space-between"}>
      <Stack direction={"row"} gap={1}>
        <LinkButton title="Add Product" to="/product/create" />
        <SearchBox
          label="product name"
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
      <CustomTable data={products} columns={productColumn} isLinkButton />
      <TablePaginate
        currentPage={currentPage}
        totalPage={totalPage}
        onChangePage={(page) => setCurrentPage(page)}
      />
    </>
  );

  return (
    <>
      <TitleBox title={"Product list"} />
      <ContentBox padding>
        {renderHeaderControls}
        {renderTableSection}
      </ContentBox>
    </>
  );
};

export default ProductListPage;
