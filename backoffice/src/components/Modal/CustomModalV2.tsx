import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

interface CustomModalPropsV2 {
  title: String;
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
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
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
};

const CustomModalV2 = ({ title, open, setOpen, children }: CustomModalPropsV2) => {
  const handleClose = () => setOpen(false);

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
        {children}
      </Box>
    </Modal>
  );
};

export default CustomModalV2;
