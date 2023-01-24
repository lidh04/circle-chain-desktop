import React from "react";
import {
  RouterProvider,
  createMemoryRouter,
} from 'react-router-dom';
import ErrorPage from './routes/error-page';
import Root from "./routes/root";
import Home from "./routes/home";
import Login from "./routes/login";
import Register from "./routes/register";
import Profile from "./routes/profile";
import CreateWallet from "./routes/create-wallet";
import WalletInfo from "./routes/wallet-info";
import WalletTrans from "./routes/wallet-trans";
import './App.css';


const router = createMemoryRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "signin",
        element: <Login />,
        errorElement: <ErrorPage />,
      },
      {
        path: "signup",
        element: <Register />,
        errorElement: <ErrorPage />,
      },
      {
        path: "home",
        element: <Home />,
        errorElement: <ErrorPage />,
      },
      {
        path: "profile",
        element: <Profile />,
        errorElement: <ErrorPage />,
      },
      {
        path: "create-wallet",
        element: <CreateWallet />,
        errorElement: <ErrorPage />,
      },
      {
        path: "wallet-info",
        element: <WalletInfo />,
        errorElement: <ErrorPage />,
      },
      {
        path: "wallet-trans",
        element: <WalletTrans />,
        errorElement: <ErrorPage />,
      }
    ]
}], {
  initialEntries: ["/home"],
  initialIndex: 1,
});


export default function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
