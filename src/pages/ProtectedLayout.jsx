import { useGetAuthUserQuery } from "@services/rootApi";
import { Link, Navigate, Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  const response = useGetAuthUserQuery();

  if (response.isLoading) {
    return <p>Loading...</p>;
  }

  if (!response?.data?._id) {
    return <Navigate to="/login" />;
  }
  return (
    <div>
      <Link to="/">Home Page</Link>
      <Link to="/messages">Message Page</Link>
      <Outlet />
    </div>
  );
};
export default ProtectedLayout;
