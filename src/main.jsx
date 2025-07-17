import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "@pages/RootLayout";
import ModalProvider from "@context/ModalProvider";
import { lazy } from "react";
import { ThemeProvider } from "@mui/material";
const HomePage = lazy(() => import("@pages/HomePage"));
import theme from './configs/muiConfig';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
  <ModalProvider>
    <RouterProvider router={router} />
  </ModalProvider>
  </ThemeProvider>
);
