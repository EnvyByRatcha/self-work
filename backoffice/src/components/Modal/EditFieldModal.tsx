import { Box, Modal, Stack, Typography } from "@mui/material";
import CustomTextField from "../input/CustomTextField";
import { useEffect, useState } from "react";
import CustomButton from "../button/CustomButton";

interface CustomModalPropsV2 {
  title: String;
  open: boolean;
  setOpen: (open: boolean) => void;
  label: string;
  value: string;
  type: "text" | "email" | "password" | "number" | "tel";
  field: string;
  onSubmit: (field: string, newValue: string) => void;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 400,
  bgcolor: "background.paper",
  outline: "solid 2px",
  outlineColor: "outline.color",
  borderRadius: "24px",
  boxShadow: 24,
  p: 3,
};

function EditFieldModal({
  title,
  open,
  setOpen,
  label,
  value,
  type = "text",
  field,
  onSubmit,
}: CustomModalPropsV2) {
  const handleClose = () => {
    setOpen(false);
  };
  const [input, setInput] = useState(value);

  useEffect(() => {
    setInput(value);
  }, [value]);

  const handleDiscard = () => {
    setInput(value);
  };

  const handleSubmit = () => {
    onSubmit(field, input);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography
          fontWeight={700}
          fontSize={"14px"}
          color="text.primary"
          mb={2}
        >
          {title}
        </Typography>
        <CustomTextField
          label={label}
          value={input}
          name={label}
          type={type}
          required
          onChange={(e) => setInput(e.target.value)}
        />
        <Stack direction={"row"} gap={1} mt={3} justifyContent={"end"}>
          <CustomButton title="Discard" handleClick={handleDiscard} />
          <CustomButton
            title="Confirm"
            handleClick={handleSubmit}
            backgroundColor="custom.linkButton"
            bgHover="custom.linkButtonHover"
            color="text.secondary"
          />
        </Stack>
      </Box>
    </Modal>
  );
}

export default EditFieldModal;
