import { Button, ListItemText, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

interface MenuOption {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  title: string;
  options: MenuOption[];
  onSelect: (value: string) => void;
}

function FilterDropDown({ title, options, onSelect }: FilterDropdownProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLabel, setSelectedLabel] = useState(title);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (label: string, value: string) => {
    if (value == "all") {
      setSelectedLabel(title);
    } else {
      setSelectedLabel(label);
    }

    onSelect(value);
    handleClose();
  };

  return (
    <>
      <Button
        onClick={handleClick}
        endIcon={<KeyboardArrowDownOutlinedIcon />}
        sx={{
          textTransform: "none",
          backgroundColor: "background.default",
          borderRadius: "8px",
          color: "text.primary",
          "&:hover": {
            backgroundColor: "custom.inputBg",
          },
        }}
      >
        {selectedLabel}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => handleSelect(option.label, option.value)}
          >
            <ListItemText>{option.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default FilterDropDown;
