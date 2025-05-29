import { useEffect, useState } from "react";
import { Notyf } from "notyf";
import { useParams } from "react-router-dom";
import useTechnician from "../../hook/technician.hook";
import { User } from "../../interface/IUser";
import TitleBox from "../../components/common/TitleBox";
import ContentBox from "../../components/common/ContentBox";
import UserDetailForm from "../../components/form/UserDetailForm";

const notyf = new Notyf();

const TechnicianDetailPage = () => {
  const { id } = useParams();

  const { getTechnicianById, updateTechnicianById } = useTechnician();

  const [technician, setTechnician] = useState<User>();

  useEffect(() => {
    if (id) {
      fetchTechnician(id);
    }
  }, [id]);

  const fetchTechnician = async (id: string) => {
    const data = await getTechnicianById(id);
    if (data?.success) {
      setTechnician(data.data.technician);
    }
  };

  const updateTechnician = async (payload: any) => {
    if (id) {
      const data = await updateTechnicianById(id, payload);
      if (data.success) {
        notyf.success(data.message);
        fetchTechnician(id);
        return;
      }
      notyf.error(data?.message);
      return;
    }
    notyf.error("User id is undifine");
  };

  return (
    <>
      <TitleBox title={"Technician detail"} />
      <ContentBox padding>
        {technician && (
          <UserDetailForm user={technician} onSubmit={updateTechnician} />
        )}
      </ContentBox>
    </>
  );
};

export default TechnicianDetailPage;
