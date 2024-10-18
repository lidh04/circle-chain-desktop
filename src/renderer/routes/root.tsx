import { Outlet, useNavigate } from 'react-router-dom';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Home from '@mui/icons-material/Home';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PaidIcon from '@mui/icons-material/Paid';
import Paper from '@mui/material/Paper';
import People from '@mui/icons-material/People';
import * as React from 'react';
import ReceiptIcon from '@mui/icons-material/Receipt';

import { WalletPackage } from 'common/wallet-types';
import { Account } from '../../common/account-types';

const FireNav = styled(List)<{ component?: React.ElementType }>({
  '& .MuiListItemButton-root': {
    paddingLeft: 24,
    paddingRight: 24,
  },
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginRight: 16,
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20,
  },
});

type WalletSidebar = {
  icon: any;
  label: string;
  handleClick: () => void;
};

export default function Root() {
  const [open, setOpen] = React.useState(true);
  const [accountOpen, setAccountOpen] = React.useState(false);
  const [login, setLogin] = React.useState(false);
  const [account, setAccount] = React.useState<Account | null>(null);
  const [walletPackage, setWalletPackage] = React.useState<WalletPackage | null>(null);
  const [walletData, setWalletData] = React.useState<WalletSidebar[] | null>(null);
  const navigate = useNavigate();

  const initDataWithWalletPackage = (wp: WalletPackage) => {
    setWalletPackage(wp);
    const { wallets } = wp;
    const walletDataArray: WalletSidebar[] = [
      {
        icon: <AddCircleIcon />,
        label: 'Create',
        handleClick: () => {
          navigate('/create-wallet');
        },
      },
      {
        icon: <AccountBalanceWalletIcon />,
        label: 'Balance',
        handleClick: () => {
          navigate('/wallet-info');
        },
      },
      {
        icon: <PaidIcon />,
        label: 'Payment',
        handleClick: () => {
          navigate('/wallet-payment');
        },
      },
      {
        icon: <ReceiptIcon />,
        label: 'Transaction',
        handleClick: () => {
          navigate('/wallet-trans');
        },
      },
    ];
    if (wallets && wallets.length >= 3) {
      walletDataArray.splice(0, 1);
    }
    setWalletData(walletDataArray);
  };
  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    window.electron.ipcRenderer
      .getAccount()
      // eslint-disable-next-line @typescript-eslint/no-shadow
      .then((account) => {
        setAccount(account);
        if (account) {
          setLogin(true);
          return window.electron.ipcRenderer.getWalletPackage(account.value);
        }
        setLogin(false);
        return false;
      })
      .then((result) => {
        console.log('root page walletPackage:', result);
        if (result) {
          const wp: WalletPackage = result as WalletPackage;
          initDataWithWalletPackage(wp);
          return true;
        }
        return false;
      })
      .catch((err) => console.error(err));
  }, [setAccount]);

  const unLoggedAccountData = [
    {
      icon: <LoginIcon />,
      label: 'Login',
      handleClick: () => {
        navigate('/signin');
      },
    },
    {
      icon: <AppRegistrationIcon />,
      label: 'Signup',
      handleClick: () => {
        navigate('/signup');
      },
    },
  ];
  const loggedAccountData = [
    {
      icon: <People />,
      label: 'Profile',
      handleClick: () => {
        navigate('/profile');
      },
    },
    {
      icon: <LogoutIcon />,
      label: 'Logout',
      handleClick: async () => {
        try {
          const result = await window.electron.ipcRenderer.logout();
          if (result) {
            setLogin(false);
            navigate('/home');
          }
          return result;
        } catch (err) {
          console.error('cannot logout:', err);
          return false;
        }
      },
    },
  ];
  const goHome = () => {
    navigate('/home');
  };

  const handleEmailInput = async (email: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const walletPackage: WalletPackage = (await window.electron.ipcRenderer.getWalletPackage(email)) as WalletPackage;
      await window.electron.ipcRenderer.saveAccount(walletPackage.account);
      setWalletPackage(walletPackage);
      initDataWithWalletPackage(walletPackage);
      setAccount(walletPackage.account);
    } catch (err: any) {
      console.error('cannot get wallet package by email:', email, 'error:', err.message, err);
    }
  };

  // if (!account) {
  //   return <InputAccountDialog initOpen callback={handleEmailInput} />;
  // }

  return (
    <div className="root" style={{ display: 'flex', width: '100%' }}>
      <div
        className="sidebar"
        style={{
          padding: '1rem 2rem',
          borderRight: 'solid 1px #999',
          width: '321px',
        }}
      >
        <Box sx={{ display: 'flex' }}>
          <ThemeProvider
            theme={createTheme({
              components: {
                MuiListItemButton: {
                  defaultProps: {
                    disableTouchRipple: true,
                  },
                },
              },
              palette: {
                mode: 'dark',
                primary: { main: 'rgb(102, 157, 246)' },
                background: { paper: 'rgb(5, 30, 52)' },
              },
            })}
          >
            <Paper elevation={0} sx={{ maxWidth: 256 }}>
              <FireNav component="nav" disablePadding>
                <ListItemButton component="a" href="#customized-list">
                  <ListItemIcon sx={{ fontSize: 20 }}>🔥</ListItemIcon>
                  <ListItemText
                    sx={{ my: 0 }}
                    primary="CircleChain"
                    primaryTypographyProps={{
                      fontSize: 20,
                      fontWeight: 'medium',
                      letterSpacing: 0,
                    }}
                  />
                </ListItemButton>
                <Divider />
                <ListItem component="div" disablePadding>
                  <ListItemButton sx={{ height: 56 }} onClick={goHome}>
                    <ListItemIcon>
                      <Home color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Home"
                      primaryTypographyProps={{
                        color: 'primary',
                        fontWeight: 'medium',
                        variant: 'body2',
                      }}
                    />
                  </ListItemButton>
                  {/* <Tooltip title="Settings"> */}
                  {/*   <IconButton */}
                  {/*     size="large" */}
                  {/*     sx={{ */}
                  {/*       '& svg': { */}
                  {/*         color: 'rgba(255,255,255,0.8)', */}
                  {/*         transition: '0.2s', */}
                  {/*         transform: 'translateX(0) rotate(0)', */}
                  {/*       }, */}
                  {/*       '&:hover, &:focus': { */}
                  {/*         bgcolor: 'unset', */}
                  {/*         '& svg:first-of-type': { */}
                  {/*           transform: 'translateX(-4px) rotate(-20deg)', */}
                  {/*         }, */}
                  {/*         '& svg:last-of-type': { */}
                  {/*           right: 0, */}
                  {/*           opacity: 1, */}
                  {/*         }, */}
                  {/*       }, */}
                  {/*       '&:after': { */}
                  {/*         content: '""', */}
                  {/*         position: 'absolute', */}
                  {/*         height: '80%', */}
                  {/*         display: 'block', */}
                  {/*         left: 0, */}
                  {/*         width: '1px', */}
                  {/*         bgcolor: 'divider', */}
                  {/*       }, */}
                  {/*     }} */}
                  {/*   > */}
                  {/*     <Settings /> */}
                  {/*     <ArrowRight sx={{ position: 'absolute', right: 4, opacity: 0 }} /> */}
                  {/*   </IconButton> */}
                  {/* </Tooltip> */}
                </ListItem>
                <Divider />
                <Box
                  sx={{
                    bgcolor: open ? 'rgba(71, 98, 130, 0.2)' : null,
                    pb: open ? 2 : 0,
                  }}
                >
                  {
                    /* Wallet section */
                    login && (
                      <>
                        <ListItemButton
                          alignItems="flex-start"
                          onClick={() => setOpen(!open)}
                          sx={{
                            px: 3,
                            pt: 2.5,
                            pb: open ? 0 : 2.5,
                            '&:hover, &:focus': {
                              '& svg': { opacity: open ? 1 : 0 },
                            },
                          }}
                        >
                          <ListItemText
                            primary="Wallet"
                            primaryTypographyProps={{
                              fontSize: 15,
                              fontWeight: 'medium',
                              lineHeight: '20px',
                              mb: '2px',
                            }}
                            secondary="Create, Transaction, Post transactions"
                            secondaryTypographyProps={{
                              noWrap: true,
                              fontSize: 12,
                              lineHeight: '16px',
                              color: open ? 'rgba(0,0,0,0)' : 'rgba(255,255,255,0.5)',
                            }}
                            sx={{ my: 0 }}
                          />
                          <KeyboardArrowDown
                            sx={{
                              mr: -1,
                              opacity: 0,
                              transform: open ? 'rotate(-180deg)' : 'rotate(0)',
                              transition: '0.2s',
                            }}
                          />
                        </ListItemButton>
                        {open &&
                          walletData &&
                          walletData.map((item) => (
                            <ListItemButton
                              key={item.label}
                              sx={{
                                py: 0,
                                minHeight: 32,
                                color: 'rgba(255,255,255,.8)',
                              }}
                              onClick={item.handleClick}
                            >
                              <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                              <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{
                                  fontSize: 14,
                                  fontWeight: 'medium',
                                }}
                              />
                            </ListItemButton>
                          ))}
                      </>
                    )
                  }

                  {/* Account section */}
                  <ListItemButton
                    alignItems="flex-start"
                    onClick={() => setAccountOpen(!accountOpen)}
                    sx={{
                      px: 3,
                      pt: 2.5,
                      pb: open ? 0 : 2.5,
                      '&:hover, &:focus': {
                        '& svg': { opacity: open ? 1 : 0 },
                      },
                    }}
                  >
                    <ListItemText
                      primary="Account"
                      primaryTypographyProps={{
                        fontSize: 15,
                        fontWeight: 'medium',
                        lineHeight: '20px',
                        mb: '2px',
                      }}
                      secondary="Account Info"
                      secondaryTypographyProps={{
                        noWrap: true,
                        fontSize: 12,
                        lineHeight: '16px',
                        color: accountOpen ? 'rgba(0,0,0,0)' : 'rgba(255,255,255,0.5)',
                      }}
                      sx={{ my: 0 }}
                    />
                    <KeyboardArrowDown
                      sx={{
                        mr: -1,
                        opacity: 0,
                        transform: accountOpen ? 'rotate(-180deg)' : 'rotate(0)',
                        transition: '0.2s',
                      }}
                    />
                  </ListItemButton>
                  {accountOpen &&
                    !login &&
                    unLoggedAccountData.map((item) => (
                      <ListItemButton
                        key={item.label}
                        sx={{
                          py: 0,
                          minHeight: 32,
                          color: 'rgba(255,255,255,.8)',
                        }}
                        onClick={item.handleClick}
                      >
                        <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                        <ListItemText
                          primary={item.label}
                          primaryTypographyProps={{
                            fontSize: 14,
                            fontWeight: 'medium',
                          }}
                        />
                      </ListItemButton>
                    ))}
                  {accountOpen &&
                    login &&
                    loggedAccountData.map((item) => (
                      <ListItemButton
                        key={item.label}
                        sx={{
                          py: 0,
                          minHeight: 32,
                          color: 'rgba(255,255,255,.8)',
                        }}
                        onClick={item.handleClick}
                      >
                        <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                        <ListItemText
                          primary={item.label}
                          primaryTypographyProps={{
                            fontSize: 14,
                            fontWeight: 'medium',
                          }}
                        />
                      </ListItemButton>
                    ))}
                </Box>
              </FireNav>
            </Paper>
          </ThemeProvider>
        </Box>
      </div>
      <div className="detail" style={{ padding: '1rem 2rem', width: '70%' }}>
        <Outlet />
      </div>
    </div>
  );
}
