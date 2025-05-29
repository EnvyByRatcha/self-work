import { Box } from "@mui/material";

interface ContentBoxProps {
  children: React.ReactNode;
  padding?: boolean;
}

function ContentBox({ children, padding }: ContentBoxProps) {
  return (
    <Box
      sx={{
        padding: padding ? "40px" : "unset",
        maxWidth: "900px",
        marginX: "auto",
      }}
    >
      {children}
    </Box>
  );
}

export default ContentBox;
