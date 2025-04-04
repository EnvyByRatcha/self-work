import ContentBox from "../../components/common/ContentBox";
import TitleBox from "../../components/common/TitleBox";
import UserForm from "../../components/form/UserForm";
import useUser from "../../hook/user.hook";
import type { UserFormData } from "../../interface/IUser";
import { useNavigate } from "react-router-dom";

const UserCreatePage = () => {
  const navigate = useNavigate();

  const { createUser } = useUser();

  const handleUserFormSubmit = (userFormData: UserFormData) => {
    createUser(userFormData).then((data) => {
      if (data.message == "success") {
        navigate("/user");
      }
    });
  };

  return (
    <>
      <TitleBox title="Add user" />
      <ContentBox>
        <UserForm onSubmit={handleUserFormSubmit} />
      </ContentBox>
    </>
  );
};

export default UserCreatePage;
