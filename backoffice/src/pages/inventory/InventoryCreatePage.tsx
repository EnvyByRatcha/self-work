import TitleBox from "../../components/common/TitleBox";
import InventoryForm from "../../components/form/InventoryForm";
import useInventoryTransition from "../../hook/inventoryTransition.hook";
import {
  InventoryTransitionDetailFormData,
  InventoryTransitionFormData,
} from "../../interface/IInventory";

const InventoryCreatePage = () => {
  const { createInventoryTransition } = useInventoryTransition();

  const handleTranstionFormSubmit = (
    formData: InventoryTransitionFormData,
    formDataDetail: InventoryTransitionDetailFormData
  ) => {
    console.log(formData, formDataDetail);
    createInventoryTransition(formData, formDataDetail);
  };

  return (
    <>
      <TitleBox title="Add transition" />
      <InventoryForm onSubmit={handleTranstionFormSubmit} />
    </>
  );
};

export default InventoryCreatePage;
