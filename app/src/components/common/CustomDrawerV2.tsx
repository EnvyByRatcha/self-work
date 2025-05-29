import { Box, Drawer, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface CustomDrawerProps {
  title?: string;
  width?: string | number;
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
}

const CustomDrawerV2 = ({
  title = "Choose spare-part",
  width = "100%",
  open,
  setOpen,
  children,
}: CustomDrawerProps) => {
  const handleClose = () => setOpen(false);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width,
          top: "82px",
          height: "calc(100% - 82px)",
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={"40px"}
      >
        <Typography variant="h6">{title}</Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box px={"40px"}>{children}</Box>
    </Drawer>
  );
};

export default CustomDrawerV2;
