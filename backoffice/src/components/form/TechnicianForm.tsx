import { Box, Grid, SelectChangeEvent, Stack, Typography } from "@mui/material";
import { useState } from "react";
import CustomTextField from "../input/CustomTextField";
import CustomSelect from "../input/CustomSelect";
import CustomButton from "../button/CustomButton";
import InfoIcon from "@mui/icons-material/Info";

interface userFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  level: string;
}

const optionLevel = [
  { label: "technician", value: "technician" },
  { label: "Lead-technician", value: "lead-technician" },
];

const TechnicianForm = ({ onSubmit }: any) => {
  const [formData, setFormData] = useState<userFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    level: "technician",
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
              User details
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
              label="First name"
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              label="Last name"
              name="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              label="Password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <CustomSelect
              label="Level"
              name="level"
              options={optionLevel}
              value={formData.level}
              onChange={handleSelectChange}
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

export default TechnicianForm;
