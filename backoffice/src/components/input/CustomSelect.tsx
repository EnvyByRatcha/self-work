import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

interface SelectProps {
  label: string;
  name: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (event: SelectChangeEvent<string>) => void;
  required?: boolean;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = -24;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const CustomSelect = ({
  label,
  name,
  options,
  value,
  onChange,
  required,
}: SelectProps) => {
  return (
    <FormControl variant="filled" fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        name={name}
        value={value}
        required={required}
        onChange={onChange}
        fullWidth
        MenuProps={MenuProps}
        size="small"
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
