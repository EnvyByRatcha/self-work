import { Box, Stack, Typography } from "@mui/material";

function Navbar() {
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
      </Stack>
    </Box>
  );
}

export default Navbar;
