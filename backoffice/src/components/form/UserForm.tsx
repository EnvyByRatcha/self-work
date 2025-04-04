import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import CustomTextField from "../input/CustomTextField";
import CustomSelect from "../input/CustomSelect";

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
            label="First name"
            name="firstName"
            type="text"
            required
            value={formData.firstName}
            onChange={handleChange}
          />
          <CustomTextField
            label="Last name"
            name="lastName"
            type="text"
            required
            value={formData.lastName}
            onChange={handleChange}
          />
          <CustomTextField
            label="Password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </Grid>
        <Grid size={4}>
          <CustomSelect
            label="Level"
            name="level"
            options={optionLevel}
            value={formData.level}
            onChange={handleSelectChange}
          />
          {/* <FormControl fullWidth>
            <Select
              value={formData.level}
              onChange={(e) =>
                setFormData({ ...formData, level: e.target.value })
              }
            >
              <MenuItem value="employee">employee</MenuItem>
              <MenuItem value="admin">admin</MenuItem>
            </Select>
          </FormControl> */}
        </Grid>
      </Grid>
      <Button type="submit" variant="contained" color="primary">
        Create User
      </Button>
    </form>
  );
};

export default UserForm;
