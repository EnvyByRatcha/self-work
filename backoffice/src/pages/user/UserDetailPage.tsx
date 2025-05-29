import { useParams } from "react-router-dom";
import ContentBox from "../../components/common/ContentBox";
import TitleBox from "../../components/common/TitleBox";
import useUser from "../../hook/user.hook";
import { useEffect, useState } from "react";
import { User } from "../../interface/IUser";
import UserDetailForm from "../../components/form/UserDetailForm";
import { Notyf } from "notyf";

const notyf = new Notyf();

const UserDetailPage = () => {
  const { id } = useParams();

  const { getUserById, updateUserById } = useUser();

  const [user, setUser] = useState<User>();

  useEffect(() => {
    if (id) {
      fetchUser(id);
    }
  }, [id]);

  const fetchUser = async (id: string) => {
    const data = await getUserById(id);
    if (data?.success) {
      setUser(data.data.user);
    }
  };

  const updateUser = async (payload: any) => {
    if (id) {
      const data = await updateUserById(id, payload);
      if (data.success) {
        notyf.success(data.message);
        fetchUser(id);
        return;
      }
      notyf.error(data?.message);
      return;
    }
    notyf.error("User id is undifine");
  };

  return (
    <>
      <TitleBox title={"User detail"} />
      <ContentBox padding>
        {user && <UserDetailForm user={user} onSubmit={updateUser} />}
      </ContentBox>
    </>
  );
};

export default UserDetailPage;
