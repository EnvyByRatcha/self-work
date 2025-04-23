import { Box } from "@mui/material";

interface ContentBoxProps {
  children: React.ReactNode;
}

function ContentBox({ children }: ContentBoxProps) {
  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        padding: "40px",
        minHeight: "calc(100vh - 308px)",
      }}
    >
      {children}
    </Box>
  );
}

export default ContentBox;
