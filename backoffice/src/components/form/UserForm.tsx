import { Box, Grid, SelectChangeEvent, Stack } from "@mui/material";
import { useState } from "react";
import CustomTextField from "../input/CustomTextField";
import CustomSelect from "../input/CustomSelect";
import CustomButton from "../button/CustomButton";

interface userFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  level: string;
}

const optionLevel = [
  { label: "employee", value: "employee" },
  { label: "admin", value: "admin" },
];

const UserForm = ({ onSubmit }: any) => {
  const [formData, setFormData] = useState<userFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    level: "employee",
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
    console.log(formData);

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

export default UserForm;
