import { Button, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

interface CustomerButtonProps {
  type?: string;
  title: string;
  backgroundColor?: string;
  color?: string;
  fullWidth?: boolean;
  icon?: ReactNode;
  disable?: boolean;
  handleClick?: () => void;
}

const CustomButton = ({
  type,
  title,
  backgroundColor,
  color,
  fullWidth,
  icon,
  disable,
  handleClick,
}: CustomerButtonProps) => {
  return (
    <Button
      disabled={disable}
      type={type == "submit" ? "submit" : "button"}
      sx={{
        flex: fullWidth ? 1 : "unset",
        justifyContent: "center",
        alignItems: "center",
        width: fullWidth ? "100%" : "unset",
        backgroundColor: backgroundColor ? backgroundColor : "#3385F0",
        color: color ? color : "#ffffff",
        fontSize: "16px",
        fontWeight: 700,
        gap: "8px",
        "&:hover": {
          opacity: 0.9,
          backgroundColor,
        },
      }}
      variant="contained"
      onClick={handleClick}
    >
      {icon && <Stack>{icon}</Stack>}
      <Typography>{title}</Typography>
    </Button>
  );
};

export default CustomButton;
