import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./theme/ThemeContext";
import router from "./routes/AppRoute";

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router}></RouterProvider>
    </ThemeProvider>
  );
}

export default App;
