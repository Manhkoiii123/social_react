import Header from "@components/Header";
import Loading from "@components/Loading";
import { saveUserInfo } from "@redux/slices/authSlice";
import { useGetAuthUserQuery } from "@services/rootApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  const response = useGetAuthUserQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (response.isSuccess) {
      dispatch(saveUserInfo(response.data));
    }
  }, [response.isSuccess, response.data, dispatch]);

  if (response.isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};
export default ProtectedLayout;
