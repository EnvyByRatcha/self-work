import { Box, Grid, Stack, Typography } from "@mui/material";
import { useState } from "react";
import CustomTextField from "../input/CustomTextField";
import type { CustomerFormData } from "../../interface/ICustomer";
import CustomButton from "../button/CustomButton";
import InfoIcon from "@mui/icons-material/Info";

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
    <Box sx={{ maxWidth: "900px", marginX: "auto" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "40px",
        }}
      >
        <Grid container rowSpacing={2} spacing={2}>
          <Stack direction={"row"} gap={2}>
            <InfoIcon sx={{ color: "custom.linkButton" }} />
            <Typography
              fontSize={"1rem"}
              fontWeight={700}
              mb={"8px"}
              color="text.primary"
            >
              Customer details
            </Typography>
          </Stack>
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              label="Email address"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              label="Name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              label="Customer code"
              name="customerCode"
              type="text"
              required
              value={formData.customerCode}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              label="Address"
              name="address"
              type="text"
              required
              value={formData.address}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <CustomTextField
              label="Contact_1"
              name="tel_1"
              type="tel"
              required
              value={formData.tel_1}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <CustomTextField
              label="Contact_2"
              name="tel_2"
              type="tel"
              value={formData.tel_2}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Stack direction={"row"}>
          <CustomButton title="Proceed" type="submit" />
        </Stack>
      </form>
    </Box>
  );
};

export default CustomerForm;
