 import ContentBox from "../../components/common/ContentBox";
import TitleBox from "../../components/common/TitleBox";
import UserForm from "../../components/form/UserForm";
import useUser from "../../hook/user.hook";
import type { UserFormData } from "../../interface/IUser";
import { useNavigate } from "react-router-dom";
import { Notyf } from "notyf";

const notyf = new Notyf();

const UserCreatePage = () => {
  const navigate = useNavigate();

  const { createUser } = useUser();

  const handleUserFormSubmit = async (userFormData: UserFormData) => {
    const data = await createUser(userFormData);
    if (data.success) {
      notyf.success(data.message);
      setTimeout(() => {
        navigate("/user");
      }, 2000);
      return;
    }
    notyf.error(data?.message);
  };

  return (
    <>
      <TitleBox title="Add user" />
      <ContentBox padding>
        <UserForm onSubmit={handleUserFormSubmit} />
      </ContentBox>
    </>
  );
};

export default UserCreatePage;
