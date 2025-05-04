import { Box } from "@mui/material";

interface ContentBoxProps {
  children: React.ReactNode;
  padding?: boolean;
}

function ContentBox({ children, padding }: ContentBoxProps) {
  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        padding: padding ? "40px" : "unset",
        minHeight: "calc(100vh - 308px)",
      }}
    >
      {children}
    </Box>
  );
}

export default ContentBox;
