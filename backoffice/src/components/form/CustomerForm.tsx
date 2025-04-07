import { Button, Grid } from "@mui/material";
import { useState } from "react";
import CustomTextField from "../input/CustomTextField";
import type { CustomerFormData } from "../../interface/ICustomer";

const CustomerForm = ({ onSubmit }: any) => {
  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    customerCode: "",
    address: "",
    tel_1: "",
    tel_2: "",
    email: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target as HTMLInputElement;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
            label="Email address"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <CustomTextField
            label="Name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
          />
          <CustomTextField
            label="Customer code"
            name="customerCode"
            type="text"
            required
            value={formData.customerCode}
            onChange={handleChange}
          />
          <CustomTextField
            label="Address"
            name="address"
            type="text"
            required
            value={formData.address}
            onChange={handleChange}
          />
          <CustomTextField
            label="Contact_1"
            name="tel_1"
            type="tel"
            required
            value={formData.tel_1}
            onChange={handleChange}
          />
          <CustomTextField
            label="Contact_2"
            name="tel_2"
            type="tel"
            value={formData.tel_2}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
      <Button type="submit" variant="contained" color="primary">
        Create User
      </Button>
    </form>
  );
};

export default CustomerForm;
