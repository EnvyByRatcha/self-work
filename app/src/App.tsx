import { RouterProvider } from "react-router-dom";
import router from "./routes/AppRoute";
import { ThemeProvider } from "./theme/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router}></RouterProvider>
    </ThemeProvider>
  );
}

export default App;
