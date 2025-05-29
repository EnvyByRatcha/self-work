import { useState } from "react";
import { Customer } from "../../interface/ICustomer";
import { Box, Grid, Stack, Typography } from "@mui/material";
import CustomCard from "../common/CustomCard";
import EditFieldModal from "../Modal/EditFieldModal";
import LocationCityIcon from "@mui/icons-material/LocationCity";

interface CustomerDetailFormProps {
  customer: Customer;
  onSubmit: any;
}

interface EditForm {
  field: keyof Customer | "";
  label: string;
  value: string;
  type: "text" | "email" | "password" | "number" | "tel";
}

const CustomerDetailForm = ({
  customer,
  onSubmit,
}: CustomerDetailFormProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  const [editState, setEditState] = useState<EditForm>({
    field: "",
    label: "",
    value: "",
    type: "text",
  });

  const handleOpenEditor = (
    field: keyof Customer,
    label: string,
    value: string,
    type: "text" | "email" | "password" | "number" | "tel"
  ) => {
    setEditState({ field, label, value, type });
    setModalOpen(true);
  };

  const setDefaultEditState = () => {
    setEditState({
      field: "",
      label: "",
      value: "",
      type: "text",
    });
  };

  const handleSubmit = (field: string, data: string) => {
    const payload = { [field]: data };
    onSubmit(payload);
    setDefaultEditState();
  };

  return (
    <>
      <Box sx={{ maxWidth: "720px", mx: "auto" }}>
        <Grid container spacing={{ xs: 4, md: 0 }} rowGap={2}>
          <Stack direction={"row"} gap={2}>
            <LocationCityIcon sx={{ color: "custom.linkButton", mt: "4px" }} />
            <Typography
              fontSize={"1.3125rem"}
              fontWeight={700}
              mb={"20px"}
              color="text.primary"
            >
              Personal info
            </Typography>
          </Stack>

          <Grid size={{ xs: 12 }}>
            <CustomCard
              handleClick={() =>
                handleOpenEditor("name", "Name", customer?.name, "text")
              }
            >
              <Stack direction={"row"} lineHeight={1.3}>
                <Typography
                  minWidth={"120px"}
                  fontSize={"0.875rem"}
                  fontWeight={700}
                >
                  First name
                </Typography>
                <Typography fontSize={"0.875rem"} fontWeight={400}>
                  {customer?.name}
                </Typography>
              </Stack>
            </CustomCard>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <CustomCard
              handleClick={() =>
                handleOpenEditor(
                  "address",
                  "Address",
                  customer?.address,
                  "text"
                )
              }
            >
              <Stack direction={"row"} lineHeight={1.3}>
                <Typography
                  minWidth={"120px"}
                  fontSize={"0.875rem"}
                  fontWeight={700}
                >
                  Address
                </Typography>
                <Typography fontSize={"0.875rem"} fontWeight={400}>
                  {customer.address || ""}
                </Typography>
              </Stack>
            </CustomCard>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <CustomCard
              handleClick={() =>
                handleOpenEditor("tel_1", "Phone", customer?.tel_1, "tel")
              }
            >
              <Stack direction={"row"} lineHeight={1.3}>
                <Typography
                  minWidth={"120px"}
                  fontSize={"0.875rem"}
                  fontWeight={700}
                >
                  Number
                </Typography>
                <Typography fontSize={"0.875rem"} fontWeight={400}>
                  {`(+66) ${customer.tel_1 || ""}`}
                </Typography>
              </Stack>
              <Stack direction={"row"} lineHeight={1.3}>
                <Typography
                  minWidth={"120px"}
                  fontSize={"0.875rem"}
                  fontWeight={700}
                >
                  Number2
                </Typography>
                <Typography fontSize={"0.875rem"} fontWeight={400}>
                  {`(+66) ${customer.tel_2 || ""}`}
                </Typography>
              </Stack>
            </CustomCard>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <CustomCard
              handleClick={() =>
                handleOpenEditor("email", "Email", customer?.email, "email")
              }
            >
              <Stack direction={"row"} lineHeight={1.3}>
                <Typography
                  minWidth={"120px"}
                  fontSize={"0.875rem"}
                  fontWeight={700}
                >
                  Primary Email
                </Typography>
                <Typography fontSize={"0.875rem"} fontWeight={400}>
                  {customer?.email}
                </Typography>
              </Stack>
            </CustomCard>
          </Grid>
        </Grid>
      </Box>

      <EditFieldModal
        title={`Edit ${editState.label}`}
        open={modalOpen}
        setOpen={setModalOpen}
        label={editState.label}
        value={editState.value}
        onSubmit={handleSubmit}
        type={editState.type}
        field={editState.field}
      />
    </>
  );
};

export default CustomerDetailForm;
