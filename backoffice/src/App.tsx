import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import router from "./routes/AppRoute";
import { lightTheme, darktheme } from "./theme/theme";
import { useEffect, useState } from "react";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme == "dark") {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  });

  return (
    <ThemeProvider theme={lightTheme}>
      <RouterProvider router={router}></RouterProvider>
    </ThemeProvider>
  );
}

export default App;
