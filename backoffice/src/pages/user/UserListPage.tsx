import TitleBox from "../../components/common/TitleBox";
import ContentBox from "../../components/common/ContentBox";
import LinkButton from "../../components/common/LinkButton";
import useUser from "../../hook/user.hook";
import { Stack } from "@mui/material";
import CustomTable from "../../components/table/CustomTable";
import { userColumn } from "../../constants/userColumn";
import SearchBox from "../../components/common/SearchBox";
import FilterDropDown from "../../components/common/FilterDropDown";
import TablePaginate from "../../components/common/TablePaginate";

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const levelOptions = [
  { label: "All", value: "all" },
  { label: "Admin", value: "admin" },
  { label: "User", value: "user" },
  { label: "Manager", value: "manager" },
];

const UserListPage = () => {
  const {
    users,
    searchTerm,
    setSearchTerm,
    setLevelFilter,
    setStatusFilter,
    totalPage,
    currentPage,
    setCurrentPage,
  } = useUser();

  return (
    <>
      <TitleBox title={"User list"} />
      <ContentBox padding>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Stack direction={"row"} gap={1}>
            <LinkButton title="Add user" to="/user/create" />
            <SearchBox
              label="user"
              type="text"
              searchTerm={searchTerm}
              onSearchChange={(value) => setSearchTerm(value)}
              onClear={() => setSearchTerm("")}
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

        <CustomTable data={users} columns={userColumn} isLinkButton />
        <TablePaginate
          currentPage={currentPage}
          totalPage={totalPage}
          onChangePage={(page) => setCurrentPage(page)}
        />
      </ContentBox>
    </>
  );
};

export default UserListPage;
