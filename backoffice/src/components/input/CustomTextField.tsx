import { FormControl, TextField } from "@mui/material";
import React from "react";

interface TextFieldProps {
  label: string;
  name: string;
  type: "text" | "email" | "password" | "number" | "tel";
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const CustomTextField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required,
}: TextFieldProps) => {
  return (
    <FormControl fullWidth sx={{ marginBottom: 2 }}>
      <TextField
        label={label}
        name={name}
        type={type}
        value={value}
        required={required}
        variant="filled"
        onChange={onChange}
        fullWidth
        sx={{
          "& .MuiFilledInput-root": {
            backgroundColor: "#EBF2F5",
            borderRadius: "8px",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#DBE6EB",
            },
            "&.Mui-focused": {
              backgroundColor: "#EAF3FD",
              outline: "1px solid #2C7BE5",
            },
            "&:before, &:after": {
              display: "none",
            },
          },
        }}
      />
    </FormControl>
  );
};

export default CustomTextField;
