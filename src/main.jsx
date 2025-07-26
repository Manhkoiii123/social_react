import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import RootLayout from "@pages/RootLayout";
import { lazy } from "react";
import { ThemeProvider } from "@mui/material";
const HomePage = lazy(() => import("@pages/HomePage"));
import theme from "./configs/muiConfig";
import RegisterPage from "@pages/auth/RegisterPage";
import AuthLayout from "@pages/auth/AuthLayout";
import LoginPage from "@pages/auth/LoginPage";
import OTPVerifyPage from "@pages/auth/OTPVerifyPage";
import { Provider } from "react-redux";
import { persistor, store } from "@redux/store";
import ProtectedLayout from "@pages/ProtectedLayout";
import { PersistGate } from "redux-persist/integration/react";
import Dialog from "@components/Dialog";
import Loading from "@components/Loading";
import SearchUsersPage from "@pages/SearchUsersPage";
import About from "@pages/UserProfile/About";
import FriendLists from "@pages/UserProfile/FriendLists";
import AccountSettings from "@pages/AccountSettings";
import MessagePage from "@pages/MessagePage";
import ChatDetail from "@components/Messages/ChatDetail";
const UserProfilePage = lazy(() => import("@pages/UserProfile/UserProfile"));
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: "/",
            element: <HomePage />,
          },
          {
            path: "/messages",
            element: <MessagePage />,
            children: [
              {
                path: ":userId",
                element: <ChatDetail />,
              },
            ],
          },
          {
            path: "/search/users",
            element: <SearchUsersPage />,
          },
          {
            path: "/users/:userId",
            element: <UserProfilePage />,
            children: [
              {
                index: true,
                element: <Navigate to="about" replace />,
              },
              {
                path: "about",
                element: <About />,
              },
              {
                path: "friends",
                element: <FriendLists />,
              },
            ],
          },
          {
            path: "/settings",
            children: [
              {
                path: "account",
                element: <AccountSettings />,
              },
            ],
          },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/register",
            element: <RegisterPage />,
          },
          {
            path: "/login",
            element: <LoginPage />,
          },
          {
            path: "/verify-otp",
            element: <OTPVerifyPage />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={<Loading />} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
        <Dialog />
      </ThemeProvider>
    </PersistGate>
  </Provider>,
);
