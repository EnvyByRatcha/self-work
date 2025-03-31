import { Button, Typography } from "@mui/material";

interface LinkButtonProps {
  title: string;
  to: string;
}

function LinkButton({ title, to }: LinkButtonProps) {
  return (
    <Button
      href={to}
      variant="contained"
      sx={{
        bgcolor: "#3385F0",
        padding: "8px 16px",
        borderRadius: "8px",
        "&:hover": {
          bgcolor: "#2B71CC",
        },
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
