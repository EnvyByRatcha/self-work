import ContentBox from "../../components/common/ContentBox";
import TitleBox from "../../components/common/TitleBox";
import UserForm from "../../components/form/UserForm";
import useUser from "../../hook/user.hook";

import { useNavigate } from "react-router-dom";

interface userFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  level: string;
}

const UserCreatePage = () => {
  const navigate = useNavigate();

  const { createUser } = useUser();

  const handleUserFormSubmit = (userFormData: userFormData) => {
    createUser(userFormData).then((data) => {
      if (data.message == "success") {
        navigate("/user");
      }
    });
  };

  return (
    <>
      <TitleBox title="Create user" />
      <ContentBox>
        <UserForm onSubmit={handleUserFormSubmit} />
      </ContentBox>
    </>
  );
};

export default UserCreatePage;
