import { Box, Stack, Typography } from "@mui/material";

interface TitleBoxProps {
  title: string;
  children?: React.ReactNode;
}

function TitleBox({ title, children }: TitleBoxProps) {
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
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Typography
          fontSize={"1.75rem"}
          fontWeight={700}
          color="textPrimary"
          textTransform={"capitalize"}
        >
          {title}
        </Typography>
        <Stack direction={"row"} gap={1}>
          {children}
        </Stack>
      </Stack>
    </Box>
  );
}

export default TitleBox;
