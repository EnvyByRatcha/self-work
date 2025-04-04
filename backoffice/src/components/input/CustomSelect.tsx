import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";

interface SelectProps {
  label: string;
  name: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (event: SelectChangeEvent<string>) => void;
  required?: boolean;
}

const CustomSelect = ({
  label,
  name,
  options,
  value,
  onChange,
  required,
}: SelectProps) => {
  return (
    <FormControl variant="filled" fullWidth sx={{ marginBottom: 2 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        name={name}
        value={value}
        required={required}
        onChange={onChange}
        fullWidth
        sx={{
          backgroundColor: "#EBF2F5",
          borderRadius: "8px",
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
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelect;
