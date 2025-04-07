import { Button, Grid, SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import type { ProductFormData } from "../../interface/IProduct";
import CustomTextField from "../input/CustomTextField";
import CustomSelect from "../input/CustomSelect";

const optionCategory = [
  { label: "printer", value: "empprinterloyee" },
  { label: "computer", value: "computer" },
];

const ProductForm = ({ onSubmit }: any) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    cost: 0,
    price: 0,
    categoryName: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target as HTMLInputElement;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setFormData((prevData) => ({
      ...prevData,
      level: event.target.value as string,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <Grid container spacing={2}>
        <Grid size={8}>
          <CustomTextField
            label="Product name"
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
            label="Category"
            name="categoryName"
            options={optionCategory}
            value={formData.categoryName}
            onChange={handleSelectChange}
          />
        </Grid>{" "}
        <Button type="submit" variant="contained" color="primary">
          Create User
        </Button>
      </Grid>
    </form>
  );
};

export default ProductForm;
