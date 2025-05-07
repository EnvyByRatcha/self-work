import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/login/LoginPage";
import Layout from "../components/layout/Layout";
import ProtectRoute from "./ProtectRoute";
import Dashboard from "../pages/dashboard/Dashboard";
import NotFoundPage from "../pages/notFound/NotFoundPage";

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: (
      <ProtectRoute>
        <Layout />
      </ProtectRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
