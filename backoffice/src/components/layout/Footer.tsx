import { Stack, Typography } from "@mui/material";

function Footer() {
  return (
    <Stack
      sx={{
        backgroundColor: "background.default",
        outline: "solid 1px",
        outlineColor: "outline.color",
        height: "40px",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingX: "40px",
        paddingY: "8px",
      }}
    >
      <Typography fontSize={"12px"} color="textPrimary">
        Footer
      </Typography>
      <Typography fontSize={"12px"} color="textPrimary">
        V1
      </Typography>
    </Stack>
  );
}

export default Footer;
