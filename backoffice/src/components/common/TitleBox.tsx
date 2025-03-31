import { Box, Typography } from "@mui/material";

interface TitleBoxProps {
  title: string;
}

function TitleBox({ title }: TitleBoxProps) {
  return (
    <Box
      sx={{
        borderBottom: "1px solid rgb(195, 211, 219)",
        paddingX: "40px",
        paddingY: "24px",
      }}
    >
      <Typography fontSize={"1.75rem"} fontWeight={700}>
        {title}
      </Typography>
    </Box>
  );
}

export default TitleBox;
