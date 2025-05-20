import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/login/LoginPage";
import Layout from "../components/layout/Layout";
import ProtectRoute from "./ProtectRoute";
import Dashboard from "../pages/dashboard/Dashboard";
import NotFoundPage from "../pages/notFound/NotFoundPage";
import AssignmentCreatePage from "../pages/assignment/AssignmentCreatePage";
import AssignmentListPage from "../pages/assignment/AssignmentListPage";
import InventoryListPage from "../pages/Inventory/InventoryListPage";

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
      { path: "/assignment", element: <AssignmentListPage /> },
      { path: "/asignment/create", element: <AssignmentCreatePage /> },
      { path: "/inventory", element: <InventoryListPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
