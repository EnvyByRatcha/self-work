import { Alert, Snackbar } from "@mui/material";
import TitleBox from "../../components/common/TitleBox";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useSparePart from "../../hook/sparePart.hook";
import type { SparePartFormData } from "../../interface/ISparePart";
import SparePartForm from "../../components/form/SparePartForm";

const SparePartCreatePage = () => {
  const { createSparePart } = useSparePart();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const handleSparePartFormSubmit = (sparePartFormData: SparePartFormData) => {
    createSparePart(sparePartFormData).then((data) => {
      if (data?.message == "success") {
        setOpenSnackbar(true);
        setTimeout(() => {
          navigate("/sparePart");
        }, 2000);
      }
    });
  };

  return (
    <>
      <TitleBox title="Add Spare-part" />
      <SparePartForm onSubmit={handleSparePartFormSubmit} />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          Sparepart added successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default SparePartCreatePage;
