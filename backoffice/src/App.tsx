import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import router from "./routes/AppRoute";
import { lightTheme } from "./theme/theme";

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <RouterProvider router={router}></RouterProvider>
    </ThemeProvider>
  );
}

export default App;
