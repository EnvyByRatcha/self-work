import ContentBox from "../../components/common/ContentBox";
import TitleBox from "../../components/common/TitleBox";
import InventoryForm from "../../components/form/InventoryForm";
import useInventoryTransition from "../../hook/inventoryTransition.hook";
import type {
  InventoryTransitionDetailFormData,
  InventoryTransitionFormData,
  TransitionFormData,
} from "../../interface/IInventory";
import { useNavigate } from "react-router-dom";
import { Notyf } from "notyf";

const notyf = new Notyf();

const InventoryCreatePage = () => {
  const navigate = useNavigate();
  const { createInventoryTransition } = useInventoryTransition();

  const handleTranstionFormSubmit = async (
    formData: InventoryTransitionFormData,
    formDataDetail: InventoryTransitionDetailFormData[]
  ) => {
    const payload: TransitionFormData = {
      transition: formData,
      details: formDataDetail,
    };
    const data = await createInventoryTransition(payload);
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
      <TitleBox title="Add transition" />
      <ContentBox padding>
        <InventoryForm onSubmit={handleTranstionFormSubmit} />
      </ContentBox>
    </>
  );
};

export default InventoryCreatePage;
