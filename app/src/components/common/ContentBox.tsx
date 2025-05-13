import { Box } from "@mui/material";

interface ContentBoxProps {
  children: React.ReactNode;
  padding?: boolean;
}

function ContentBox({ children, padding }: ContentBoxProps) {
  return (
    <Box
      sx={{
        backgroundColor: "#537D5D",
        padding: padding ? "40px" : "unset",
        maxWidth: "1280px",
        border: "1px solid black",
        marginX: "auto",
      }}
    >
      {children}
    </Box>
  );
}

export default ContentBox;
