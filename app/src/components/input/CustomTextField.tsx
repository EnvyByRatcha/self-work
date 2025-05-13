import { FormControl, TextField } from "@mui/material";
import React from "react";

interface TextFieldProps {
  label: string;
  name: string;
  type: "text" | "email" | "password" | "number" | "tel";
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
}

const CustomTextField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required,
  multiline = false,
  rows = 3,
}: TextFieldProps) => {
  return (
    <FormControl fullWidth>
      <TextField
        label={label}
        name={name}
        type={type}
        value={value}
        required={required}
        variant="filled"
        onChange={onChange}
        fullWidth
        size="small"
        multiline={multiline}
        rows={multiline ? rows : undefined}
        sx={{
          "& .MuiFormLabel-asterisk": {
            display: "none",
          },
        }}
      />
    </FormControl>
  );
};

export default CustomTextField;
