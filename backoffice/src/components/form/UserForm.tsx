import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";

interface userFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  level: string;
}

const UserForm = ({ onSubmit }: any) => {
  const [formData, setFormData] = useState<userFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    level: "employee",
  });

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
        maxWidth: "800px",
        gap: "12px",
      }}
    >
      <Grid container spacing={2}>
        <Grid size={12}>
          <FormControl fullWidth>
            <TextField
              label="Email address"
              type="email"
              fullWidth
              required
              color="info"
              variant="outlined"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </FormControl>
        </Grid>
        <Grid size={6}>
          <FormControl sx={{ width: "100%" }}>
            <TextField
              label="First name"
              fullWidth
              required
              color="info"
              variant="outlined"
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
          </FormControl>
        </Grid>
        <Grid size={6}>
          <FormControl sx={{ width: "100%" }}>
            <TextField
              label="Last name"
              fullWidth
              required
              color="info"
              variant="outlined"
              placeholder="Please insert property price"
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
          </FormControl>
        </Grid>
        <Grid size={6}>
          <FormControl fullWidth>
            <TextField
              label="Password"
              fullWidth
              required
              color="info"
              variant="outlined"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </FormControl>
        </Grid>
        <Grid size={6}>
          <FormControl fullWidth>
            <Select
              value={formData.level}
              onChange={(e) =>
                setFormData({ ...formData, level: e.target.value })
              }
            >
              <MenuItem value="employee">employee</MenuItem>
              <MenuItem value="admin">admin</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Button type="submit" variant="contained" color="primary">
        Create User
      </Button>
    </form>
  );
};

export default UserForm;
