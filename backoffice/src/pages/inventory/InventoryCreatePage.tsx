import TitleBox from "../../components/common/TitleBox";
import InventoryForm from "../../components/form/InventoryForm";
import useInventoryTransition from "../../hook/inventoryTransition.hook";
import {
  InventoryTransitionDetailFormData,
  InventoryTransitionFormData,
  TransitionFormData,
} from "../../interface/IInventory";

const InventoryCreatePage = () => {
  const { createInventoryTransition } = useInventoryTransition();

  const handleTranstionFormSubmit = (
    formData: InventoryTransitionFormData,
    formDataDetail: InventoryTransitionDetailFormData[]
  ) => {
    const payload: TransitionFormData = {
      transition: formData,
      details: formDataDetail,
    };
    createInventoryTransition(payload);
  };

  return (
    <>
      <TitleBox title="Add transition" />
      <InventoryForm onSubmit={handleTranstionFormSubmit} />
    </>
  );
};

export default InventoryCreatePage;
