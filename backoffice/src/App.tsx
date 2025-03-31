import { RouterProvider } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import router from "./routes/AppRoute";
import theme from "./theme/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router}></RouterProvider>
    </ThemeProvider>
  );
}

export default App;
