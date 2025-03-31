import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Box, Stack } from "@mui/material";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <Box display={"flex"}>
      <Sidebar />
      <Stack width={"100%"}>
        <Navbar />
        <Outlet />
      </Stack>
    </Box>
  );
}

export default Layout;
