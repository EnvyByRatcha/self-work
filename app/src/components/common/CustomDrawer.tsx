import { Box, Button, Drawer, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

interface CustomDrawerProps {
  title?: string;
  width?: string | number;
  buttonLabel?: string;
  children: React.ReactNode;
}

const CustomDrawer = ({
  title = "Choose spare-part",
  width = "100%",
  buttonLabel = "เพิ่มอะไหล่",
  children,
}: CustomDrawerProps) => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  return (
    <>
      <Button variant="contained" onClick={toggleDrawer(true)}>
        {buttonLabel}
      </Button>

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
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
          <IconButton onClick={toggleDrawer(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box px={"40px"}>{children}</Box>
      </Drawer>
    </>
  );
};

export default CustomDrawer;
