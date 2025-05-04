import { Box, Grid, SelectChangeEvent, Stack, Typography } from "@mui/material";
import { useState } from "react";
import type { ProductFormData } from "../../interface/IProduct";
import CustomTextField from "../input/CustomTextField";
import CustomSelect from "../input/CustomSelect";
import CustomFile from "../input/CustomFile";
import useCategory from "../../hook/category.hook";
import CustomButton from "../button/CustomButton";
import InfoIcon from "@mui/icons-material/Info";

const ProductForm = ({ onSubmit }: any) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    categoryName: "",
    photo: "",
  });
  const [propImg, setPropImg] = useState({
    name: "",
    url: "",
  });

  const { categories } = useCategory();

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
      return new Promise<string>((resolve, reject) => {
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
    <Box sx={{ width: "100%", marginX: "auto" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Grid container spacing={{ xs: 4, md: 0 }}>
          <Grid
            size={{ xs: 12, md: 4 }}
            padding={"40px"}
            sx={{ outline: "solid 1px", outlineColor: "outline.color" }}
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

          <Grid size={{ xs: 12, md: 8 }} paddingX={{ xs: "40px" }}>
            <Stack direction={"row"} gap={2}>
              <InfoIcon sx={{ color: "custom.linkButton" }} />
              <Typography
                fontSize={"1rem"}
                fontWeight={700}
                mb={"20px"}
                color="text.primary"
              >
                Product details
              </Typography>
            </Stack>
            <Grid container rowSpacing={2} spacing={2}>
              <CustomTextField
                label="Product name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
              />
              <CustomSelect
                label="Category"
                name="categoryName"
                options={categories.map((category) => {
                  return { label: category.name, value: category.name };
                })}
                value={formData.categoryName}
                onChange={handleSelectChange}
              />
              <CustomButton title="Proceed" type="submit" />
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default ProductForm;
