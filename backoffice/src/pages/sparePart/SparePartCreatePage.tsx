import TitleBox from "../../components/common/TitleBox";
import ContentBox from "../../components/common/ContentBox";
import { useNavigate } from "react-router-dom";
import useSparePart from "../../hook/sparePartHook/sparePart.hook";
import type { SparePartFormData } from "../../interface/ISparePart";
import SparePartForm from "../../components/form/SparePartForm";

import { Notyf } from "notyf";

const notyf = new Notyf();

const SparePartCreatePage = () => {
  const { createSparePart } = useSparePart();

  const navigate = useNavigate();

  const handleSparePartFormSubmit = async (
    sparePartFormData: SparePartFormData
  ) => {
    const data = await createSparePart(sparePartFormData);
    if (data?.success) {
      notyf.success(data.message);
      setTimeout(() => {
        navigate("/sparePart");
      }, 2000);
      return;
    }
    notyf.error(data?.message);
  };

  return (
    <>
      <TitleBox title="Add Spare-part" />
      <ContentBox padding>
        <SparePartForm onSubmit={handleSparePartFormSubmit} />
      </ContentBox>
    </>
  );
};

export default SparePartCreatePage;
