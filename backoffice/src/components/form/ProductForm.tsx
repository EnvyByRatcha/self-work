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
import type { ProductFormData } from "../../interface/IProduct";

const ProductForm = ({ onSubmit }: any) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    cost: 0,
    price: 0,
    categoryName: "",
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
        gap: "12px",
        maxWidth: "800px",
      }}
    >
      <Grid container spacing={2}>
        <Grid size={12}>
          <FormControl fullWidth>
            <TextField
              label="Product name"
              type="text"
              fullWidth
              required
              color="info"
              variant="outlined"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </FormControl>
        </Grid>
        <Grid size={6}>
          <FormControl sx={{ width: "100%" }}>
            <TextField
              label="Cost"
              type="number"
              fullWidth
              required
              color="info"
              variant="outlined"
              onChange={(e) =>
                setFormData({ ...formData, cost: parseInt(e.target.value) })
              }
            />
          </FormControl>
        </Grid>
        <Grid size={6}>
          <FormControl sx={{ width: "100%" }}>
            <TextField
              label="Price"
              type="number"
              fullWidth
              required
              color="info"
              variant="outlined"
              placeholder="Please insert property price"
              onChange={(e) =>
                setFormData({ ...formData, price: parseInt(e.target.value) })
              }
            />
          </FormControl>
        </Grid>
        <Grid size={12}>
          <FormControl fullWidth>
            <Select
              value={formData.categoryName}
              onChange={(e) =>
                setFormData({ ...formData, categoryName: e.target.value })
              }
            >
              <MenuItem value="printer">printer</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Button type="submit" variant="contained" color="primary">
        Add product
      </Button>
    </form>
  );
};

export default ProductForm;
