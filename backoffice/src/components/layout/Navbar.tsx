import { Box, Button, Stack, Typography } from "@mui/material";
import { useTheme } from "../../theme/ThemeContext";

function Navbar() {
  const { toggleTheme } = useTheme();

  return (
    <Box
      sx={{
        bgcolor: "rgb(255,255,255)",
        paddingLeft: "40px",
        paddingRight: "40px",
        borderBottom: "1px solid rgb(195, 211, 219)",
        minHeight: "82px",
      }}
    >
      <Stack direction={"row"} height={"100%"} alignItems={"center"}>
        <Typography fontSize={"1.5rem"} fontWeight={600}>
          Navbar
        </Typography>
        <Button onClick={toggleTheme}>
          <Typography>Theme</Typography>
        </Button>
      </Stack>
    </Box>
  );
}

export default Navbar;
