import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./auth";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Flags from "./pages/Flags";
import ListingQueue from "./pages/ListingQueue";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import RecipeQueue from "./pages/RecipeQueue";
import Users from "./pages/Users";
import VendorQueue from "./pages/VendorQueue";

function RequireAdmin({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (!user || user.role !== "ADMIN") return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <RequireAdmin>
            <Layout />
          </RequireAdmin>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/vendors" element={<VendorQueue />} />
        <Route path="/recipes" element={<RecipeQueue />} />
        <Route path="/listings" element={<ListingQueue />} />
        <Route path="/flags" element={<Flags />} />
        <Route path="/users" element={<Users />} />
        <Route path="/orders" element={<Orders />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
