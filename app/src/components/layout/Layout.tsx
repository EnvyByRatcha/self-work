import { Box, Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
  return (
    <Box display={"flex"} height="100vh">
      <Stack width={"100%"} height="100vh">
        <Box flex={1} overflow="auto">
          <Navbar />
          <Box
            sx={{
              backgroundColor: "background.default",
              height: "calc(100vh - 82px)",
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}

export default Layout;
