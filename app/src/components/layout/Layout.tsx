import { Box, Stack } from "@mui/material";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <Box display={"flex"} height="100vh">
      <Stack width={"100%"} height="100vh">
        <Box flex={1} overflow="auto">
          <Outlet />
        </Box>
      </Stack>
    </Box>
  );
}

export default Layout;
