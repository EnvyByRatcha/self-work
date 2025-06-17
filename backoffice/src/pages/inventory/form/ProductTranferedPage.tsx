import { useNavigate } from "react-router-dom";
import useInventoryTransition from "../../../hook/inventoryTransition.hook";
import { Notyf } from "notyf";
import { TransitionFormData } from "../../../interface/IInventory";
import TitleBox from "../../../components/common/TitleBox";
import ContentBox from "../../../components/common/ContentBox";
import ProductManagementForm from "../../../components/form/ProductManagementForm";

const notyf = new Notyf();

function ProducttranferedPage() {
  const navigate = useNavigate();
  const { createProductTranfered } = useInventoryTransition();

  const handleSubmitAddSparePart = async (formData: TransitionFormData) => {
    const data = await createProductTranfered(formData);
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
      <TitleBox title="Product tranfered" />
      <ContentBox padding>
        <ProductManagementForm onSubmit={handleSubmitAddSparePart} />
      </ContentBox>
    </>
  );
}

export default ProducttranferedPage;
