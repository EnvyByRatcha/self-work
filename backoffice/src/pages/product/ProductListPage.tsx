import TitleBox from "../../components/common/TitleBox";
import ContentBox from "../../components/common/ContentBox";
import LinkButton from "../../components/common/LinkButton";
import useProduct from "../../hook/product.hook";
import CustomTable from "../../components/table/CustomTable";
import { productColumn } from "../../constants/productColumn";
import { Stack } from "@mui/material";
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

const ProductListPage = () => {
  const {
    products,
    setSearchTerm,
    setStatusFilter,
    totalPage,
    setCurrentPage,
  } = useProduct();

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
      <TitleBox title={"Product list"} />
      <ContentBox padding>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Stack direction={"row"} gap={1}>
            <LinkButton title="Add Product" to="/product/create" />
            <SearchBox
              label="user"
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

        <CustomTable data={products} columns={productColumn} isLinkButton />
        <TablePaginate
          totalPage={totalPage}
          onChangePage={(page) => setCurrentPage(page)}
        />
      </ContentBox>
    </>
  );
};

export default ProductListPage;
