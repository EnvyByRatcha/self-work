import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Box, Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

function Layout() {
  return (
    <Box display={"flex"} height="100vh">
      <Sidebar />
      <Stack width={"100%"} height="100vh">
        <Box flex={1} overflow="auto">
          <Navbar />

          <Outlet />

          <Footer />
        </Box>
      </Stack>
    </Box>
  );
}

export default Layout;
