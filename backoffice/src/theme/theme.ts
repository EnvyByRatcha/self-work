import { createTheme } from "@mui/material";

export const getTheme = (mode: "light" | "dark") => {
  return createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            primary: { main: "#1976d2" },
            outline: {
              color: "rgb(195, 211, 219)",
            },
            background: {
              default: "#FFFFFF",
            },
            text: {
              primary: "#1B2124",
            },
          }
        : {
            primary: { main: "#90caf9" },
            outline: {
              color: "rgb(38, 45, 48)",
            },
            background: {
              default: "#06080A",
            },
            text: {
              primary: "#EBF2F5",
            },
          }),
    },
    typography: {
      fontFamily: "Plus Jakarta Sans, sans-serif",
    },
  });
};
