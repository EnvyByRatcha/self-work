import { createBrowserRouter } from "react-router-dom";
import ProtectRoute from "./ProtectRoute";
import Layout from "../components/layout/Layout";
import LoginPage from "../pages/login/LoginPage";
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
import InventoryListPage from "../pages/inventory/InventoryListPage";
import InventoryCreatePage from "../pages/inventory/InventoryCreatePage";
import InventoryTransitionDetailPage from "../pages/inventory/InventoryTransitionDetailPage";
import ProductDetailPage from "../pages/product/ProductDetailPage";
import SparePartDetailPage from "../pages/sparePart/SparePartDetailPage";
import NotFoundPage from "../pages/notFound/NotFoundPage";
import CustomerDetailPage from "../pages/customer/CustomerDetailPage";
import TechnicianListPage from "../pages/technician/TechnicianListPage";
import TechnicianCreatePage from "../pages/technician/TechnicianCreatePage";
import TechnicianIssuedPage from "../pages/inventory/form/TechnicianIssuedPage";
import AssignmentListPage from "../pages/assignment/AssignmentListPage";
import UserDetailPage from "../pages/user/UserDetailPage";
import TechnicianDetailPage from "../pages/technician/TechnicianDetailPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
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
        element: <UserListPage />,
      },
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
        path: "user/:id",
        element: <UserDetailPage />,
      },
      {
        path: "technician",
        element: <TechnicianListPage />,
      },
      {
        path: "technician/create",
        element: <TechnicianCreatePage />,
      },
      {
        path: "technician/:id",
        element: <TechnicianDetailPage />,
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
        path: "product/:id",
        element: <ProductDetailPage />,
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
        path: "sparePart/:id",
        element: <SparePartDetailPage />,
      },
      {
        path: "customer",
        element: <CustomerListPage />,
      },
      {
        path: "customer/create",
        element: <CustomerCreatePage />,
      },
      {
        path: "customer/:id",
        element: <CustomerDetailPage />,
      },
      {
        path: "inventory",
        element: <InventoryListPage />,
      },
      {
        path: "inventory/create",
        element: <InventoryCreatePage />,
      },
      {
        path: "inventory/:id",
        element: <InventoryTransitionDetailPage />,
      },
      {
        path: "inventory/create/technician-issued",
        element: <TechnicianIssuedPage />,
      },
      {
        path: "assignment",
        element: <AssignmentListPage />,
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
