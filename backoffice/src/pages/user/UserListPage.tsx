import TitleBox from "../../components/common/TitleBox";
import ContentBox from "../../components/common/ContentBox";
import LinkButton from "../../components/common/LinkButton";
import useUser from "../../hook/user.hook";
import UserTable from "../../components/table/UserTable";

const UserListPage = () => {
  const { users, removeUser } = useUser();

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
        <UserTable users={users} onRemove={handleRemoveUser} />
      </ContentBox>
    </>
  );
};

export default UserListPage;
