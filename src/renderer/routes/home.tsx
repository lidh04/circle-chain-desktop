import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from 'react-router-dom';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { Account } from 'common/account-types';
import icon from '../../../assets/icon.png';

interface Props {
  account: Account | null;
}

export default function Home(props: Props) {
  const { account } = props;
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
        <img width="256" alt="icon" src={icon} />
      </div>
      <h1 className="hello">CircleChain app</h1>
      <div>
        <h2>Introduction</h2>
        <p>
          CircleChain app is an blockchain based application. Its token is circle coin, the unit of <i>cc</i> is{' '}
          <i>li</i>, 1<i>cc</i> = 100,000
          <i>li</i>.
        </p>
        <p>
          When a new block is mined, the coin base for miner is 10<i>cc</i>
          (1,000,000<i>li</i>). Not only circle coin is mined out, there are two other assets mined out: identity and
          ownership. So there are the three types of assets in new block:
        </p>
        <ul>
          <li>1. circle coin</li>
          <li>2. ownership asset</li>
          <li>3. identity asset</li>
        </ul>

        <h2>What is the difference?</h2>
        <p>
          The circle coin is just the coin token used to exchange for virtual assets including ownership, identity,
          authority of usage etc. All the virtual assets will be exchanged by circle coin.
        </p>
        <p>
          The blockchain assets includes ownership and identity. The ownership is the certificate to own some virtual
          asset in the blockchain. The ownership is the certificate to show your identity in the blockchain.
        </p>
        <p>
          The ownership can be transferred from one address to the other address with some coin fees(10<i>li</i>). When
          one ownership is transferred, the new ownership uid will be generated to the transfer. The transfer and
          receiver are not constrained except for the same address. So you can use your own two different addresses: one
          for the transfer, the other for the receiver, with some transfer coin fees, you can &apos;buy&apos; some
          ownership assets for you.
        </p>
        <p>
          The identity can also be transferred from one address to the other address with some coin fees(10<i>li</i>).
          When one identity is transferred, the new identity uid will be generated to the transfer. The transfer and
          receiver are not constrained exception for the same address. So you can use your own two different addresses:
          one for the transfer, the other for the receiver, with some transfer coin fees, you can &apos;buy&apos; some
          assets for you.
        </p>
        <h2>How to use?</h2>
        <h3>Register and Login</h3>
        <p>You must register with your email and login the app, then you can use the local services of the app.</p>
        <h3>Why register and login?</h3>
        <p>
          The app links all your local wallet data by your email. So you must register your valid email and login the
          app with the right email which was proved to be owned by you.
        </p>
        <p>
          We also send the wallet addresses(which are free to be open) with your email to cloud server. So in our cloud
          server, your addresses will be searched by your email. The function will be very convenient for people who
          want to send you assets, he only remember your email, not remember your complicated addresses.
        </p>
        <h3>Functions</h3>
        <h4>1. Create wallet</h4>
        <p>
          Logged user can create wallet by public and private keys. The wallet data is saved in local machine securely
          encrypted with specific high security encryption.
        </p>

        <h4>2. List wallet</h4>
        <p>
          Logged user can list his wallet information: wallet address, public key, balance, ownership and identity
          assets etc.
        </p>

        <h4>3. Transactions</h4>
        <p>Logged user can list recently transactions: income transactions and spent transactions</p>

        <h4>4. Payment</h4>
        <p>Logged user can pay circle coin or assets to others by using payment function.</p>

        <h4>5. Mine block locally</h4>
        <p>When you register and then logged in, you can mine your block locally in your machine.</p>

        <h4>How to register or login?</h4>
        <p>
          Please click the following buttons: If you are new user, please click &apos;Signup&apos; to register, if you
          user, please click &quot;Signin&quot; to login.
        </p>

        {!account && (
          <div className="hello">
            <Box
              sx={{
                '& > :not(style)': {
                  m: 1,
                },
              }}
            >
              <Button variant="contained" startIcon={<LoginIcon />} color="primary" onClick={gotoLogin}>
                Login
              </Button>
              <Button variant="contained" startIcon={<AppRegistrationIcon />} color="secondary" onClick={gotoRegister}>
                Signup
              </Button>
            </Box>
          </div>
        )}
      </div>
    </div>
  );
}
