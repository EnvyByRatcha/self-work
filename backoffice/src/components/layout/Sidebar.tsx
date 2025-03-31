import { Box, Stack, Typography } from "@mui/material";
import NavButton from "./NavButton";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";
import ProductionQuantityLimitsOutlinedIcon from "@mui/icons-material/ProductionQuantityLimitsOutlined";

interface MenuItem {
  title: string;
  to: string;
  icon: React.ElementType;
}

const menuService: MenuItem[] = [
  {
    title: "Dashboard",
    to: "/users",
    icon: GridViewOutlinedIcon,
  },
  {
    title: "HRM",
    to: "/user",
    icon: ManageAccountsOutlinedIcon,
  },
  {
    title: "Customer",
    to: "/dashboard",
    icon: SupportAgentOutlinedIcon,
  },
  {
    title: "Product",
    to: "/product",
    icon: ProductionQuantityLimitsOutlinedIcon,
  },
  {
    title: "SparePart",
    to: "/users",
    icon: PrecisionManufacturingOutlinedIcon,
  },
];

function Sidebar() {
  return (
    <Box
      sx={{
        width: "300px",
        height: "100vh",
        borderRight: "1px solid rgb(195, 211, 219)",
      }}
    >
      <Box
        sx={{
          height: "82px",
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          paddingLeft: "32px",
          paddingRight: "32px",
        }}
      >
        <Typography>SELF@WORK</Typography>
      </Box>

      <Stack px={"32px"} py={"16px"} gap={"2px"}>
        <Typography
          fontSize={"0.75rem"}
          fontWeight={700}
          color="rgb(156, 174, 184)"
          textTransform={"uppercase"}
          py={"8px"}
          pl={"16px"}
        >
          service
        </Typography>

        {menuService.map((item, index) => {
          return <NavButton key={index} {...item} />;
        })}
      </Stack>
    </Box>
  );
}

export default Sidebar;
