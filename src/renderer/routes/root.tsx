import {
  Outlet,
  Link,
  useNavigate,
} from "react-router-dom";
import * as React from 'react';
import Box from '@mui/material/Box';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ArrowRight from '@mui/icons-material/ArrowRight';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Home from '@mui/icons-material/Home';
import Settings from '@mui/icons-material/Settings';
import People from '@mui/icons-material/People';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaidIcon from '@mui/icons-material/Paid';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';


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

export default function Root() {
  const [open, setOpen] = React.useState(true);
  const [accountOpen, setAccountOpen] = React.useState(false);
  const [login, setLogin] = React.useState(false);
  const navigate = useNavigate();

  const walletData = [
    {
      icon: <AddCircleIcon />,
      label: 'Create',
      handleClick: () => {
        navigate("/create-wallet");
      },
    },
    {
      icon: <AccountBalanceWalletIcon />,
      label: 'Info',
      handleClick: () => {
        navigate("/wallet-info");
      },
    },
    {
      icon: <PaidIcon />,
      label: 'Trans',
      handleClick: () => {
        navigate("/wallet-trans");
      },
    },
  ];
  const accountData = [
    {
      icon: <LoginIcon />,
      label: 'Login',
      handleClick: () => {
        navigate("/signin");
        //setLogin(true);
      },
    },
    {
      icon: <AppRegistrationIcon />,
      label: 'Signup',
      handleClick: () => {
        navigate("/signup");
        //setLogin(true);
      },
    },
  ];
  const loginAccountData = [
    {
      icon: <People />,
      label: 'Profile',
      handleClick: () => {
        navigate("/profile");
        //setLogin(false);
      },
    },
    {
      icon: <LogoutIcon />,
      label: 'Logout',
      handleClick: () => {
        setLogin(false);
      },
    },
  ];
  const goHome = () => {
    navigate('/home');
  };

  return (
    <div className="root" style={{ display: "flex", width: "100%"}}>
      <div className="sidebar" style={{padding: "1rem 2rem", borderRight: "solid 1px #999" }}>
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
                  <Tooltip title="Settings">
                    <IconButton
                      size="large"
                      sx={{
                        '& svg': {
                          color: 'rgba(255,255,255,0.8)',
                          transition: '0.2s',
                          transform: 'translateX(0) rotate(0)',
                        },
                        '&:hover, &:focus': {
                          bgcolor: 'unset',
                          '& svg:first-of-type': {
                            transform: 'translateX(-4px) rotate(-20deg)',
                          },
                          '& svg:last-of-type': {
                            right: 0,
                            opacity: 1,
                          },
                        },
                        '&:after': {
                          content: '""',
                          position: 'absolute',
                          height: '80%',
                          display: 'block',
                          left: 0,
                          width: '1px',
                          bgcolor: 'divider',
                        },
                      }}
                    >
                      <Settings />
                      <ArrowRight sx={{ position: 'absolute', right: 4, opacity: 0 }} />
                    </IconButton>
                  </Tooltip>
                </ListItem>
                <Divider />
                <Box
                  sx={{
                    bgcolor: open ? 'rgba(71, 98, 130, 0.2)' : null,
                    pb: open ? 2 : 0,
                  }}
                >
                  {/* Wallet section */}
                  <ListItemButton
                    alignItems="flex-start"
                    onClick={() => setOpen(!open)}
                    sx={{
                      px: 3,
                      pt: 2.5,
                      pb: open ? 0 : 2.5,
                      '&:hover, &:focus': { '& svg': { opacity: open ? 1 : 0 } },
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
                   walletData.map((item) => (
                     <ListItemButton
                       key={item.label}
                       sx={{ py: 0, minHeight: 32, color: 'rgba(255,255,255,.8)' }}
                       onClick={item.handleClick}
                     >
                       <ListItemIcon sx={{ color: 'inherit' }}>
                         {item.icon}
                       </ListItemIcon>
                       <ListItemText
                         primary={item.label}
                         primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
                       />
                     </ListItemButton>
                  ))}

                  {/* Account section */}
                  <ListItemButton
                    alignItems="flex-start"
                    onClick={() => setAccountOpen(!accountOpen)}
                    sx={{
                      px: 3,
                      pt: 2.5,
                      pb: open ? 0 : 2.5,
                      '&:hover, &:focus': { '& svg': { opacity: open ? 1 : 0 } },
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
                      secondary="Login and Register"
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
                  {accountOpen && !login &&
                   accountData.map((item) => (
                     <ListItemButton
                       key={item.label}
                       sx={{ py: 0, minHeight: 32, color: 'rgba(255,255,255,.8)' }}
                       onClick={item.handleClick}
                     >
                       <ListItemIcon sx={{ color: 'inherit' }}>
                         {item.icon}
                       </ListItemIcon>
                       <ListItemText
                         primary={item.label}
                         primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
                       />
                     </ListItemButton>
                  ))}
                  {accountOpen && login &&
                   loginAccountData.map((item) => (
                     <ListItemButton
                       key={item.label}
                       sx={{ py: 0, minHeight: 32, color: 'rgba(255,255,255,.8)' }}
                       onClick={item.handleClick}
                     >
                       <ListItemIcon sx={{ color: 'inherit' }}>
                         {item.icon}
                       </ListItemIcon>
                       <ListItemText
                         primary={item.label}
                         primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
                       />
                     </ListItemButton>
                  ))}
                </Box>
              </FireNav>
            </Paper>
          </ThemeProvider>
        </Box>
      </div>
      <div className="detail" style={{ padding: "1rem 2rem", width: "70%"}}>
        <Outlet />
      </div>
    </div>
  );
}
