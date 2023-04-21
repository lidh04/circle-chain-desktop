import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from 'react-router-dom';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import icon from '../../../assets/icon.svg';

export default function Home() {
  const [login, setLogin] = React.useState(false);
  const navigate = useNavigate();

  const gotoLogin = () => {
    console.log('navigate to signin');
    navigate('/signin');
  };
  const gotoRegister = () => {
    console.log('navigate to signup');
    navigate('/signup');
  };
  return (
    <div style={{ maxHeight: '100%', overflow: 'auto' }}>
      <div className="hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1 className="hello">CircleChain app</h1>
      <div>
        <h2>Introduction</h2>
        <p>
          CircleChain app is blockchain based application. Its token is circle
          coin, the unit of <i>cc</i> is <i>li</i>, 1<i>cc</i> = 100,000
          <i>li</i>.
        </p>
        <p>
          When a new block is mined, the coin base for miner is 10<i>cc</i>
          (1,000,000<i>li</i>). Not only circle coin is mined out, there are two
          other assets mined out: identity and ownership. So there are the three
          types of assets in new block:
        </p>
        <ul>
          <li>1. circle coin</li>
          <li>2. ownership uid</li>
          <li>3. idenity uid</li>
        </ul>

        <h2>What's the difference?</h2>
        <p>
          The circle coin is just the coin token used to exchange for virtual
          assets including ownership, identity, authority of usage etc. All the
          virtual assets will be exchanged by circle coin.
        </p>
        <p>
          The blockchain assets includes ownership and identity. The ownership
          is the certificate to own some virtual asset in the blockchain. The
          ownership is the certificate to show your idenity in the blockchain.
        </p>
        <p>
          The ownership can be transfered from one address to the other address
          with some coin fees(10<i>li</i>). When one ownership is transfered,
          the new ownership uid will be generated to the transferer. The
          transfer and recevier are not contrained except for the same address.
          So you can use your own two different addresses: one for the transfer,
          the other for the receiver, with some transfer coin fees, you can
          'buy' some ownership assets for you.
        </p>
        <p>
          The identity can also be transfered from one address to the other
          address with some coin fees(10<i>li</i>). When one identity is
          transfered, the new identity uid will be generated to the transfer.
          The transfer and receiver are not constrained exception for the same
          address. So you can use your own two different addresses: one for the
          transfer, the other for the receiver, with some transfer coin fees,
          you can 'buy' some identity assets for you.
        </p>
        <h2>How to use?</h2>
        <h3>Anonymous user</h3>
        <p>
          Anonymous user can use wallet functions: create wallet, list wallet
          info, show transactions etc. All the data are stored in local storage
          encrypted with high security algorithms.
        </p>
        <h4>Create wallet</h4>
        <p>
          Anonymous user can create local wallet with public and private keys.
          The wallet data is saved in local storaged encrypted with specific
          encryptions.
        </p>

        <h4>List wallet</h4>
        <p>
          Anonymous user can list his wallet information: wallet address, public
          key, balance, ownership and identity assets etc.
        </p>

        <h4>Transactions</h4>
        <p>
          Anonymous user can list recently transactions: income transactions and
          spent transactions
        </p>

        <h3>Account user</h3>
        <p>
          Account user is the user who register in the app and then login the
          app. Account user will post the encrypted wallet data which is
          ecrypted with high security algorithms to p2p and open source circle
          node data server. Account user should not remember or write down the
          private key relevant contents. He only use his registered email to
          enjoy all the blockchain services.
        </p>
        <h4>Create wallet</h4>
        <p>
          Account user can create cloud wallet with public and private keys. The
          wallet data is saved in the cloud server encrypted with specific high
          security encryptions.
        </p>

        <h4>List wallet</h4>
        <p>
          Account user can list his wallet information: wallet address, public
          key, balance, ownership and identity assets etc.
        </p>

        <h4>Transactions</h4>
        <p>
          Account user can list recently transactions: income transactions and
          spent transactions
        </p>

        {/*
        <h4>How to register or login?</h4>
        <p>
          Please click the following buttons: If you are new user, please click
          'Signup' to register, if you are old user, please click "Signin" to
          login.
        </p>
        */}
        {/**
        !login && (
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
                onClick={gotoLogin}
              >
                Login
              </Button>
              <Button
                variant="contained"
                startIcon={<AppRegistrationIcon />}
                color="secondary"
                onClick={gotoRegister}
              >
                Signup
              </Button>
            </Box>
          </div>
        )
        */}
      </div>
    </div>
  );
}
