import { Button, Stack, Typography } from "@mui/material";
import React from "react";

interface TextFieldProps {
  handleImageChange: (file: any) => void;
  propsImage: { name: string; url: string };
}

const CustomFile = ({ handleImageChange, propsImage }: TextFieldProps) => {
  return (
    <Stack flexDirection={"row"} gap={2}>
      <Button
        component="label"
        sx={{
          width: "fit-content",
          color: "#2ed480",
          borderColor: "#2ed480",
          textTransform: "capitalize",
          fontSize: "16px",
        }}
        variant="outlined"
      >
        Upload
        <input
          hidden
          type="file"
          accept="images/*"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleImageChange(e.target.files![0]);
          }}
        />
      </Button>
      <Typography
        fontSize={14}
        color="#808191"
        sx={{
          wordBreak: "break-all",
        }}
      >
        {propsImage?.name}
      </Typography>
    </Stack>
  );
};

export default CustomFile;
