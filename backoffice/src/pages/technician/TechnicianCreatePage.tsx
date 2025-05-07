import ContentBox from "../../components/common/ContentBox";
import TitleBox from "../../components/common/TitleBox";
import TechnicianForm from "../../components/form/TechnicianForm";
import useTechnician from "../../hook/technician.hook";
import type { UserFormData } from "../../interface/IUser";
import { useNavigate } from "react-router-dom";
import { Notyf } from "notyf";

const notyf = new Notyf();

const TechnicianCreatePage = () => {
  const navigate = useNavigate();

  const { createTechnician } = useTechnician();

  const handleTechnicianFormSubmit = async (technicianFormData: UserFormData) => {
    const data = await createTechnician(technicianFormData);
    if (data.success) {
      notyf.success(data.message);
      setTimeout(() => {
        navigate("/technician");
      }, 2000);
      return;
    }
    notyf.error(data?.message);
  };

  return (
    <>
      <TitleBox title="Add technician" />
      <ContentBox padding>
        <TechnicianForm onSubmit={handleTechnicianFormSubmit} />
      </ContentBox>
    </>
  );
};

export default TechnicianCreatePage;
