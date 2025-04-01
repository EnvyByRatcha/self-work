import { Login } from "@mui/icons-material";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import UserListPage from "../pages/user/UserListPage";
import UserCreatePage from "../pages/user/UserCreatePage";
import ProductListPage from "../pages/product/ProductListPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "user",
        element: <UserListPage />,
      },
      {
        path: "user/create",
        element: <UserCreatePage />,
      },
      {
        path: "product",
        element: <ProductListPage />,
      },
      {
        path: "product/create",
        element: <ProductListPage />,
      },
    ],
  },
]);

export default router;
