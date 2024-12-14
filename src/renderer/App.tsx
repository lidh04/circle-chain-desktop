import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Account } from 'common/account-types';
import { WalletPackage } from 'common/wallet-types';
import ErrorPage from './routes/error-page';
import Root from './routes/root';
import Home from './routes/home';
import LoginPage from './routes/login';
import SignupPage from './routes/signup';
import ForgotPassword from './routes/forgot-password';
import Profile from './routes/profile';
import CreateWallet from './routes/create-wallet';
import WalletInfo from './routes/wallet-info';
import WalletPayment from './routes/wallet-payment';
import WalletTrans from './routes/wallet-trans';
import MineBlock from './routes/mine-block';
import './App.css';

export default function App() {
  const [account, setAccount] = React.useState<Account | null>(null);
  const [walletPackage, setWalletPackage] = React.useState<WalletPackage|null>(null);

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    window.electron.ipcRenderer
      .getAccount()
      // eslint-disable-next-line @typescript-eslint/no-shadow
      .then((account) => {
        setAccount(account);
        if (account) {
          return window.electron.ipcRenderer.getWalletPackage(account.value);
        }
        return false;
      })
      .then((result) => {
        console.log('root page walletPackage:', result);
        if (result) {
          const wp: WalletPackage = result as WalletPackage;
          setWalletPackage(wp);
          return true;
        }
        return false;
      })
      .catch((err) => console.error(err));
  }, []);

  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <Root account={account} walletPackage={walletPackage} />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: 'signin',
            element: <LoginPage  />,
            errorElement: <ErrorPage />,
          },
          {
            path: 'signup',
            element: <SignupPage />,
            errorElement: <ErrorPage />,
          },
          {
            path: 'forgot-password',
            element: <ForgotPassword />,
            errorElement: <ErrorPage />,
          },
          {
            path: 'home',
            element: <Home account={account} />,
            errorElement: <ErrorPage />,
          },
          {
            path: 'profile',
            element: <Profile account={account} />,
            errorElement: <ErrorPage />,
          },
          {
            path: 'create-wallet',
            element: <CreateWallet account={account} />,
            errorElement: <ErrorPage />,
          },
          {
            path: 'mine-block',
            element: <MineBlock account={account} />,
            errorElement: <ErrorPage />,
          },
          {
            path: 'wallet-info',
            element: <WalletInfo account={account} walletPackage={walletPackage} />,
            errorElement: <ErrorPage />,
          },
          {
            path: 'wallet-payment',
            element: <WalletPayment account={account} walletPackage={walletPackage} />,
            errorElement: <ErrorPage />,
          },
          {
            path: 'wallet-trans',
            element: <WalletTrans account={account} walletPackage={walletPackage} />,
            errorElement: <ErrorPage />,
          },
        ],
      },
    ],
    {
      initialEntries: ['/home'],
      initialIndex: 1,
    }
  );

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });


  return (
    <React.StrictMode>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </React.StrictMode>
  );
}
