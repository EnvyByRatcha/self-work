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
              secondary: "#fff",
            },
            custom: {
              inputBg: "#EBF2F5",
              inputHover: "#DBE6EB",
              inputFocus: "#EAF3FD",
              linkButton: "#3385F0",
              linkButtonHover: "#2B71CD",
              customButton: "#EBF2F5",
              customButtonHover: "#DBE6EB",
              borderColor: "rgb(195, 211, 219",
              dangerButton: "rgb(225, 114, 134)",
            },
            sidebar: {
              color: "#FFFFFF",
              hover: "#EBF2F5",
              text: "#1B2124",
            },
            table: {
              color: "#F7FAFC",
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
              secondary: "#1B2124",
            },
            custom: {
              inputBg: "#1b2124",
              inputHover: "#262D30",
              inputFocus: "#0A1B30",
              linkButton: "#589BF3",
              linkButtonHover: "#7DB1F5",
              customButton: "#1b2124",
              customButtonHover: "#262D30",
              borderColor: "rgb(38, 45, 48)",
              dangerButton: "rgb(225, 114, 134)",
            },
            sidebar: {
              color: "rgb(17, 20, 23)",
              hover: "#EBF2F5",
              text: "#EBF2F5",
            },
            table: {
              color: "#111417",
            },
          }),
    },
    typography: {
      fontFamily: "Plus Jakarta Sans, sans-serif",
    },
    components: {
      MuiInputLabel: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.text.primary,
          }),
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: ({ theme }) => ({
            "& .MuiFilledInput-root": {
              backgroundColor: theme.palette.custom.inputBg,
              borderRadius: "8px",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: theme.palette.custom.inputHover,
              },
              "&.Mui-focused": {
                backgroundColor: theme.palette.custom.inputFocus,
                outline: `1px solid ${theme.palette.primary.main}`,
              },
              "&:before, &:after": {
                display: "none",
              },
            },
          }),
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.custom.inputBg,
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: theme.palette.custom.inputHover,
            },
            "&.Mui-focused": {
              backgroundColor: theme.palette.custom.inputFocus,
              outline: `1px solid ${theme.palette.primary.main}`,
            },
            "&:before, &:after": {
              display: "none",
            },
          }),
        },
      },
    },
  });
};

declare module "@mui/material/styles" {
  interface Palette {
    custom: {
      inputBg: string;
      inputHover: string;
      inputFocus: string;
      linkButton: string;
      linkButtonHover: string;
      customButton: string;
      customButtonHover: string;
      borderColor: string;
      dangerButton: string;
    };
  }

  interface PaletteOptions {
    custom?: {
      inputBg: string;
      inputHover: string;
      inputFocus: string;
      linkButton: string;
      linkButtonHover: string;
      customButton: string;
      customButtonHover: string;
      borderColor: string;
      dangerButton: string;
    };
  }
}
