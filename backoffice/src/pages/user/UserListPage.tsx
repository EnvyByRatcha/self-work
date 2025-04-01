import TitleBox from "../../components/common/TitleBox";
import ContentBox from "../../components/common/ContentBox";
import LinkButton from "../../components/common/LinkButton";
import useUser from "../../hook/user.hook";
import { Pagination } from "@mui/material";
import GenericTable from "../../components/table/GenericTable";
import { userColumns } from "../../constants/userColumns";

const UserListPage = () => {
  const { users, totalPage, setCurrentPage, removeUser } = useUser();

  const handleRemoveUser = (id: string) => {
    removeUser(id).then((data) => {
      if (data.message == "success") {
        alert("success");
      }
    });
  };

  return (
    <>
      <TitleBox title={"User list"} />
      <ContentBox>
        <LinkButton title="Add user" to="/user/create" />
        <GenericTable
          data={users}
          columns={userColumns}
          onRemove={handleRemoveUser}
        />
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
        />
      </ContentBox>
    </>
  );
};

export default UserListPage;
