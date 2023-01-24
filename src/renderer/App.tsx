import React from "react";
import {
  MemoryRouter as Router,
  Link,
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
  createMemoryRouter,
} from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import ErrorPage from './routes/error-page';
import Root from "./routes/root";
import icon from '../../assets/icon.svg';
import './App.css';

const Hello = () => {

  const gotoLogin = () => {
    console.log("navigate to signin");
  };
  const gotoRegister = () => {
    console.log("navigate to signup");
  };
  return (
    <div>
      <div className="hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1 className="hello">
        {"circle chain app"}
      </h1>
      <div className="hello">
        <Box
          sx={{
            '& > :not(style)': {
              m: 1,
            },
          }}
        >
          <Button
            variant="contained"
            startIcon={<LoginIcon />}
            color="primary"
            onClick={gotoLogin}>
            Login
          </Button>
          <Button
            variant="contained"
            startIcon={<AppRegistrationIcon />}
            color="secondary"
            onClick={gotoRegister}>
            Signup
          </Button>
        </Box>
      </div>
    </div>
  );
};

const Login = () => {
  return (
    <div>
      <h1>Login</h1>
      <div>
        <Link to="/index">Back</Link>
      </div>
    </div>
  );
};

const Register = () => {
  return (
    <div>
      <h1>Register</h1>
      <div>
        <Link to="/index">Back</Link>
      </div>
    </div>
  );
};

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
        path: "index",
        element: <Hello />,
        errorElement: <ErrorPage />,
      },
    ]
}], {
  initialEntries: ["/"],
  initialIndex: 1,
});


export default function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
