import { Button, Typography } from "@mui/material";

interface LinkButtonProps {
  title?: string;
  to: string;
}

function LinkButton({ title, to }: LinkButtonProps) {
  return (
    <Button
      href={to}
      sx={{
        bgcolor: "custom.linkButton",
        padding: "8px 16px",
        borderRadius: "8px",
        "&:hover": {
          bgcolor: "custom.linkButtonHover",
        },
        textTransform: "none",
        color: "text.secondary",
      }}
      disableElevation
    >
      <Typography fontSize={"14px"} fontWeight={600}>
        {title}
      </Typography>
    </Button>
  );
}

export default LinkButton;
