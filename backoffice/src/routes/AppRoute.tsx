import { Login } from "@mui/icons-material";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import UserListPage from "../pages/user/UserListPage";
import UserCreatePage from "../pages/user/UserCreatePage";
import ProductListPage from "../pages/product/ProductListPage";
import ProductCreatePage from "../pages/product/ProductCreatePage";
import SparePartListPage from "../pages/sparePart/SparePartListPage";
import CustomerListPage from "../pages/customer/CustomerListPage";
import CustomerCreatePage from "../pages/customer/CustomerCreatePage";
import CategoryListPage from "../pages/category/CategoryListPage";
import SparePartCreatePage from "../pages/sparePart/SparePartCreatePage";

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
        path: "category",
        element: <CategoryListPage />,
      },
      {
        path: "product",
        element: <ProductListPage />,
      },
      {
        path: "product/create",
        element: <ProductCreatePage />,
      },
      {
        path: "sparePart",
        element: <SparePartListPage />,
      },
      {
        path: "sparePart/create",
        element: <SparePartCreatePage />,
      },
      {
        path: "customer",
        element: <CustomerListPage />,
      },
      {
        path: "customer/create",
        element: <CustomerCreatePage />,
      },
    ],
  },
]);

export default router;
