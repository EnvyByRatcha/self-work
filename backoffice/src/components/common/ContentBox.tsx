import { Box } from "@mui/material";

interface ContentBoxProps {
  children: React.ReactNode;
}

function ContentBox({ children }: ContentBoxProps) {
  return (
    <Box
      sx={{
        borderBottom: "1px solid rgb(195, 211, 219)",
        padding: "40px",
      }}
    >
      {children}
    </Box>
  );
}

export default ContentBox;
