import TitleBox from "../../components/common/TitleBox";
import ContentBox from "../../components/common/ContentBox";
import LinkButton from "../../components/common/LinkButton";
import useUser from "../../hook/user.hook";
import { Pagination } from "@mui/material";
import CustomTable from "../../components/table/CustomTable";
import { userColumn } from "../../constants/userColumn";

const UserListPage = () => {
  const { users, totalPage, setCurrentPage } = useUser();

  return (
    <>
      <TitleBox title={"User list"} />
      <ContentBox padding>
        <LinkButton title="Add user" to="/user/create" />
        <CustomTable data={users} columns={userColumn} isLinkButton />
        <Pagination
          count={totalPage}
          color="primary"
          sx={{
            marginTop: "12px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          onChange={(_, page) => setCurrentPage(page)}
          shape="rounded"
          size="small"
        />
      </ContentBox>
    </>
  );
};

export default UserListPage;
