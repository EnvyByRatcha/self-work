import { Button, Typography } from "@mui/material";
import { ReactNode } from "react";

interface CustomerButtonProps {
  type?: string;
  title?: string;
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
        justifyContent: "center",
        alignItems: "center",
        minWidth: 0,
        width: fullWidth ? "100%" : "auto",
        padding: "8px 16px",
        backgroundColor: backgroundColor
          ? backgroundColor
          : "custom.customButton",
        color: color ? color : "text.primary",
        borderRadius: "8px",
        gap: "8px",
        "&:hover": {
          backgroundColor: "custom.customButtonHover",
        },
        textTransform: "none",
      }}
      variant="text"
      onClick={handleClick}
    >
      {icon && (
        <span
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {icon}
        </span>
      )}
      {title && (
        <Typography fontWeight={600} fontSize={"14px"}>
          {title}
        </Typography>
      )}
    </Button>
  );
};

export default CustomButton;
