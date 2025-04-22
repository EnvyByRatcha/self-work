import { Box, Typography } from "@mui/material";

interface TitleBoxProps {
  title: string;
}

function TitleBox({ title }: TitleBoxProps) {
  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        outline: "solid 1px",
        outlineColor: "outline.color",
        paddingX: "40px",
        paddingY: "24px",
      }}
    >
      <Typography fontSize={"1.75rem"} fontWeight={700} color="textPrimary">
        {title}
      </Typography>
    </Box>
  );
}

export default TitleBox;
