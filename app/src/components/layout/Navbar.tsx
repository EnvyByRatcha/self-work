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

  const handleNavigate = (path: string) => {
    navigate(path);
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
        <Stack direction="row" spacing={4} alignItems="center">
          <Typography fontSize={"1.2rem"} fontWeight={600} color="textPrimary">
            {`Selfwork`}
          </Typography>
          <Button onClick={() => handleNavigate("/assignment")} color="inherit">
            <Typography
              fontSize={"14px"}
              fontWeight={400}
              color="textPrimary"
              textTransform={"capitalize"}
            >
              Assignment
            </Typography>
          </Button>
          <Button onClick={() => handleNavigate("/inventory")} color="inherit">
            <Typography
              fontSize={"14px"}
              fontWeight={400}
              color="textPrimary"
              textTransform={"capitalize"}
            >
              Inventory
            </Typography>
          </Button>
        </Stack>

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
