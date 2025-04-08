import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

interface ContentBoxProps {
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
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid rgb(195, 211, 219)",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
};

const CustomModal = ({ title, open, setOpen, children }: ContentBoxProps) => {
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button
        variant="contained"
        sx={{
          bgcolor: "#3385F0",
          padding: "8px 16px",
          borderRadius: "8px",
          "&:hover": {
            bgcolor: "#2B71CC",
          },
        }}
        onClick={() => setOpen(true)}
      >
        {title}
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography fontWeight={700}>{title}</Typography>
          {children}
        </Box>
      </Modal>
    </div>
  );
};

export default CustomModal;
