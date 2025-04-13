import TitleBox from "../../components/common/TitleBox";
import InventoryForm from "../../components/form/InventoryForm";

const InventoryCreatePage = () => {
  const handleTranstionFormSubmit = () => {};

  return (
    <>
      <TitleBox title="Add transition" />
      <InventoryForm onSubmit={handleTranstionFormSubmit} />
    </>
  );
};

export default InventoryCreatePage;
