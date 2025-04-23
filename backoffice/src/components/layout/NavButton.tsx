import { ListItemButton, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

interface LinkButtonProps {
  title: string;
  to: string;
  icon: React.ElementType;
}

function NavButton({ title, to, icon: Icon }: LinkButtonProps) {
  return (
    <ListItemButton
      component={Link}
      to={to}
      sx={{
        borderRadius: "8px",
        paddingX: "16px",
        paddingY: "8px",
        "&:hover": {
          bgcolor: "siderbar.hover",
        },
      }}
    >
      <Stack direction={"row"} gap={"8px"} color={"sidebar.text"}>
        {Icon && <Icon sx={{ fontSize: "1rem" }} />}
        <Typography fontSize={"12px"}>{title}</Typography>
      </Stack>
    </ListItemButton>
  );
}

export default NavButton;
