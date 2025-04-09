import { Box, Grid, SelectChangeEvent, Typography } from "@mui/material";
import { useState } from "react";
import CustomTextField from "../input/CustomTextField";
import CustomSelect from "../input/CustomSelect";
import CustomFile from "../input/CustomFile";
import CustomButton from "../button/CustomButton";
import { SparePartFormData } from "../../interface/ISparePart";
import useProduct from "../../hook/product.hook";

const SparePartForm = ({ onSubmit }: any) => {
  const [formData, setFormData] = useState<SparePartFormData>({
    name: "",
    cost: 0,
    price: 0,
    qty: 0,
    productId: "",
    photo: "",
  });
  const [propImg, setPropImg] = useState({
    name: "",
    url: "",
  });

  const { products } = useProduct();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target as HTMLInputElement;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (file: File) => {
    const reader = (readFile: File) => {
      return new Promise<string>((resolve) => {
        const fileReader = new FileReader();
        fileReader.onload = () => resolve(fileReader.result as string);
        fileReader.readAsDataURL(readFile);
      });
    };
    reader(file).then((result: string) => {
      setPropImg({ name: file.name, url: result });
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propImg.url) {
      return alert("Please upload an image.");
    }
    const updateFormData = { ...formData, photo: propImg.url };
    onSubmit(updateFormData);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          borderBottom: "1px solid rgb(195, 211, 219)",
        }}
      >
        <Grid container spacing={2}>
          <Grid
            size={4}
            padding={"40px"}
            sx={{ borderRight: "1px solid rgb(195, 211, 219)" }}
          >
            <CustomFile
              handleImageChange={handleImageChange}
              propsImage={propImg}
            />
            {propImg.url && (
              <Box style={{ marginTop: "20px" }}>
                <img
                  src={propImg.url}
                  alt="Product Preview"
                  style={{
                    width: "100%",
                    maxWidth: "300px",
                    marginTop: "10px",
                    objectFit: "contain",
                    border: "1px solid rgb(195, 211, 219)",
                    borderRadius: "8px",
                  }}
                />
              </Box>
            )}
          </Grid>
          <Grid size={8} padding={"40px"}>
            <Typography fontSize={"1rem"} fontWeight={700} mb={"20px"}>
              Sparepart detail
            </Typography>
            <CustomTextField
              label="Sparepart name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
            />
            <CustomTextField
              label="Cost."
              name="cost"
              type="number"
              required
              value={formData.cost}
              onChange={handleChange}
            />
            <CustomTextField
              label="Price."
              name="price"
              type="number"
              required
              value={formData.price}
              onChange={handleChange}
            />
            <CustomSelect
              label="Product"
              name="productId"
              options={products.map((product) => {
                return { label: product.name, value: product._id };
              })}
              value={formData.productId}
              onChange={handleSelectChange}
            />
            <CustomButton title="Add sparepart" type="submit" />
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default SparePartForm;
