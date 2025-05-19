import {
  FormControl,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

interface SearchBoxProps {
  label: string;
  type: "text" | "email" | "password" | "number" | "tel";
  searchTerm: string | number;
  onClear: () => void;
  onSearchChange: (value: string) => void;
}

function SearchBox({
  label,
  type = "text",
  searchTerm,
  onClear,
  onSearchChange,
}: SearchBoxProps) {
  return (
    <FormControl
      sx={{
        maxWidth: "360px",
      }}
    >
      <TextField
        variant="standard"
        placeholder={`Search ${label}`}
        type={type}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        size="small"
        InputProps={{
          disableUnderline: true,
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={onClear}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          paddingLeft: "16px",
          width: "100%",
          height: "100%",

          "& .MuiInputBase-input": {
            paddingTop: "8px",
            paddingBottom: "8px",
            paddingRight: "16px",
            fontSize: "14px",
            fontWeight: 400,
          },
          "& .MuiFormLabel-asterisk": {
            display: "none",
          },
        }}
      />
    </FormControl>
  );
}

export default SearchBox;
