import { Box, Button, Stack, Typography } from "@mui/material";
import { useTheme } from "../../theme/ThemeContext";

function Navbar() {
  const { toggleTheme } = useTheme();

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        backgroundColor: "background.default",
        outline: "solid 1px",
        outlineColor: "outline.color",
        paddingX: "40px",
        minHeight: "82px",
      }}
    >
      <Stack
        direction={"row"}
        height={"82px"}
        justifyContent={"center"}
        spacing={2}
        alignItems={"center"}
      >
        <Typography fontSize={"1.5rem"} fontWeight={600} color="textPrimary">
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
