import { Box, Grid, Stack, Typography } from "@mui/material";
import { useState } from "react";
import CustomTextField from "../input/CustomTextField";
import CustomButton from "../button/CustomButton";
import { AssignmentFormData } from "../../interface/IAssignment";
import InfoIcon from "@mui/icons-material/Info";

const AssignmentForm = ({ onSubmit }: any) => {
  const [formData, setFormData] = useState<AssignmentFormData>({
    title: "",
    customerCode: "",
    solution: "",
    addressRemark: "",
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
              name="addressRemark"
              type="text"
              required
              value={formData.addressRemark}
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
              label="Title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              label="Solution"
              name="solution"
              type="text"
              required
              multiline
              rows={5}
              value={formData.solution}
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

export default AssignmentForm;
