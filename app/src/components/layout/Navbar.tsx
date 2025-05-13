import { Box, Button, Stack, Typography } from "@mui/material";
import { useTheme } from "../../theme/ThemeContext";
import { useEffect, useState } from "react";
import { getEmail } from "../../utils/jwt";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const { toggleTheme } = useTheme();
  const [name, setName] = useState<string>("");

  useEffect(() => {
    getEmailFromToken();
  }, []);

  const getEmailFromToken = () => {
    const currentEmail = getEmail();
    if (currentEmail) {
      setName(currentEmail);
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

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
        justifyContent={"space-between"}
        spacing={2}
        alignItems={"center"}
      >
        <Typography fontSize={"1.5rem"} fontWeight={600} color="textPrimary">
          Navbar
        </Typography>
        <Stack direction={"row"} gap={2} alignItems={"center"}>
          <Button onClick={toggleTheme}>
            <Typography>Theme</Typography>
          </Button>
          <Typography color="textPrimary">{name}</Typography>
          <Button onClick={handleLogOut}>Log out</Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default Navbar;
