import React from "react";
import {
  RouterProvider,
  createMemoryRouter,
} from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import ErrorPage from './routes/error-page';
import Root from "./routes/root";
import Home from "./routes/home";
import LoginPage from "./routes/login";
import SignupPage from "./routes/signup";
import ForgotPassword from "./routes/forgot-password";
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
        element: <LoginPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
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

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function App() {
  return (
    <React.StrictMode>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </React.StrictMode>
  );
}
