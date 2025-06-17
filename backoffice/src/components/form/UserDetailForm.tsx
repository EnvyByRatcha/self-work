import { Box, Grid, Stack, Typography } from "@mui/material";
import CustomCard from "../common/CustomCard";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { User } from "../../interface/IUser";
import { useState } from "react";
import EditFieldModal from "../Modal/EditFieldModal";

interface UserDetailFormProps {
  user: User;
  onSubmit: any;
}

interface EditForm {
  field: keyof User | "";
  label: string;
  value: string;
  type: "text" | "email" | "password" | "number" | "tel";
  inputField: "textField" | "selector";
  options?: { label: string; value: string }[];
}

const UserDetailForm = ({ user, onSubmit }: UserDetailFormProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  const [editState, setEditState] = useState<EditForm>({
    field: "",
    label: "",
    value: "",
    type: "text",
    inputField: "textField",
    options: [],
  });

  const handleOpenEditor = (
    field: keyof User,
    label: string,
    value: string,
    type: "text" | "email" | "password" | "number" | "tel",
    inputField: "textField" | "selector",
    options?: { label: string; value: string }[]
  ) => {
    setEditState({ field, label, value, type, inputField, options });
    setModalOpen(true);
  };

  const setDefaultEditState = () => {
    setEditState({
      field: "",
      label: "",
      value: "",
      type: "text",
      inputField: "textField",
      options: [],
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
            <PersonOutlineOutlinedIcon
              sx={{ color: "custom.linkButton", mt: "4px" }}
            />
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
                handleOpenEditor(
                  "firstName",
                  "First name",
                  user?.firstName,
                  "text",
                  "textField"
                )
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
                  {user?.firstName}
                </Typography>
              </Stack>
              <Stack direction={"row"}>
                <Typography
                  minWidth={"120px"}
                  fontSize={"0.875rem"}
                  fontWeight={700}
                >
                  Last name
                </Typography>
                <Typography fontSize={"0.875rem"} fontWeight={400}>
                  {user?.lastName}
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
                  user?.address,
                  "text",
                  "textField"
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
                  {user.address || ""}
                </Typography>
              </Stack>
            </CustomCard>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <CustomCard
              handleClick={() =>
                handleOpenEditor(
                  "tel_1",
                  "Phone",
                  user?.tel_1,
                  "tel",
                  "textField"
                )
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
                  {`(+66) ${user.tel_1 || ""}`}
                </Typography>
              </Stack>
            </CustomCard>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <CustomCard
              handleClick={() =>
                handleOpenEditor(
                  "email",
                  "Email",
                  user?.email,
                  "email",
                  "textField"
                )
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
                  {user?.email}
                </Typography>
              </Stack>
            </CustomCard>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <CustomCard>
              <Stack direction={"row"} lineHeight={1.3}>
                <Typography
                  minWidth={"120px"}
                  fontSize={"0.875rem"}
                  fontWeight={700}
                >
                  Level
                </Typography>
                <Typography fontSize={"0.875rem"} fontWeight={400}>
                  {user?.level}
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
        inputField={editState.inputField}
      />
    </>
  );
};

export default UserDetailForm;
