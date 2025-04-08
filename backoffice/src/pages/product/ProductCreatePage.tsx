import { Alert, Snackbar } from "@mui/material";
import TitleBox from "../../components/common/TitleBox";
import ProductForm from "../../components/form/ProductForm";
import useProduct from "../../hook/product.hook";
import type { ProductFormData } from "../../interface/IProduct";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ProductCreatePage = () => {
  const { createProduct } = useProduct();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const handleProductFormSubmit = (productFormData: ProductFormData) => {
    createProduct(productFormData).then((data) => {
      if (data?.message == "success") {
        setOpenSnackbar(true);
        setTimeout(() => {
          navigate("/product");
        }, 2000);
      }
    });
  };

  return (
    <>
      <TitleBox title="Add product" />
      <ProductForm onSubmit={handleProductFormSubmit} />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} // แสดงข้อความ 3 วินาที
        onClose={() => setOpenSnackbar(false)} // ปิด Snackbar
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          Product added successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductCreatePage;
