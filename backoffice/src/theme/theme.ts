import { createTheme } from "@mui/material";

export const lightTheme = createTheme({
  typography: {
    fontFamily: "Plus Jakarta Sans, sans-serif",
  },
});

export const darktheme = createTheme({
  typography: {
    fontFamily: "Plus Jakarta Sans, sans-serif",
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#111417",
    },
  },
});
