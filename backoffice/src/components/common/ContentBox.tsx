import { Box } from "@mui/material";

interface ContentBoxProps {
  children: React.ReactNode;
}

function ContentBox({ children }: ContentBoxProps) {
  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        outline: "solid 1px",
        outlineColor: "outline.color",
        padding: "40px",
      }}
    >
      {children}
    </Box>
  );
}

export default ContentBox;
