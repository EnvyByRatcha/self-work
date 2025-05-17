import TitleBox from "../../../components/common/TitleBox";
import ContentBox from "../../../components/common/ContentBox";
import TechnicianIssuedForm from "../../../components/form/TechnicianIssuedForm";
import useInventoryTransition from "../../../hook/inventoryTransition.hook";
import { useNavigate } from "react-router-dom";
import { Notyf } from "notyf";
import { TransitionFormData } from "../../../interface/IInventory";

const notyf = new Notyf();

function TechnicianIssuedPage() {
  const navigate = useNavigate();
  const { createTechnicianIssued } = useInventoryTransition();

  const handleSubmitAddSparePart = async (formData: TransitionFormData) => {
    console.log(formData);

    const data = await createTechnicianIssued(formData);
    if (data?.success) {
      notyf.success(data.message);
      setTimeout(() => {
        navigate("/inventory");
      }, 2000);
      return;
    }
    notyf.error(data?.message);
  };

  return (
    <>
      <TitleBox title="Technician issued" />
      <ContentBox padding>
        <TechnicianIssuedForm onSubmit={handleSubmitAddSparePart} />
      </ContentBox>
    </>
  );
}

export default TechnicianIssuedPage;
