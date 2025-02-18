import { Box, Stack, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import React, { useEffect } from 'react';
import QRCode from 'qrcode';

import { useNavigate } from 'react-router-dom';
import { Account } from 'common/account-types';
import { PrivatePoem, PublicWallet } from '../../common/wallet-types';

type Point2D = {
  x: number;
  y: number;
};

type GetRandom = (point: Point2D | null) => number;

const getRandom: GetRandom = (p) => {
  if (!p) {
    return 0;
  }

  return (new Date().getTime() % 100000) + parseInt(`${p.x}${p.y}`, 10);
};

async function generateQRcode(address: string): Promise<string> {
  if (!address) {
    return '';
  }

  const svg = await QRCode.toString(address, { type: 'svg' });
  // console.log("svg:", svg);
  return svg;
}

interface Props {
  account: Account | null;
}

export default function CreateWallet(props: Props) {
  const { account } = props;
  const [showNext, setShowNext] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [svg, setSvg] = React.useState('');
  const [error, setError] = React.useState('');
  const [point, setPoint] = React.useState<Point2D | null>(null);
  const [wallet, setWallet] = React.useState<PublicWallet | null>(null);
  const [poem, setPoem] = React.useState<PrivatePoem | null>(null);

  const navigate = useNavigate();

  const onSubmitHandler: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    console.log('click the next button.');
    // const walletPackage = await window.electron.ipcRenderer.getWalletPackage();
    // if (walletPackage && walletPackage.wallets && walletPackage.wallets.length >= 3) {
    //   setError('you already created 3 wallets, cannot create any wallet now!');
    //   return;
    // }
    setShowNext(step + 1 < 3);
    if (step === 1) {
      const r = await window.electron.ipcRenderer.createWallet();
      console.log('created new wallet:', r);
      setWallet(r);
      if (!r) {
        throw new Error('cannot create wallet!');
      }

      const { address } = r;
      console.log('new wallet address:', address);
      const poem1 = await window.electron.ipcRenderer.getEncodedPrivateKey(address);
      setPoem(poem1);
      console.log('new wallet private poem:', r);
      setStep(step + 1);
    } else if (step === 2) {
      if (wallet) {
        const svg1 = await generateQRcode(wallet.address);
        setSvg(svg1);
        setTimeout(() => setStep(3), 1000);
      } else {
        console.error('wallet is not initialized!');
      }
    } else {
      setStep(step + 1);
    }
  };

  const boxMouseOverHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    const [x, y] = [event.clientX, event.clientY];
    setPoint({ x, y });
    // console.log("move box:", [x, y]);
  };

  useEffect(() => {
    if (!account) {
      navigate('/signin');
      return;
    }

    setTimeout(() => {
      setShowNext(true);
      setStep(1);
    }, 3000);
  }, [account]);

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      mt={2}
      spacing={2}
      sx={{ width: '100%', height: 'auto' }}
      onMouseOver={boxMouseOverHandler}
    >
      <Typography variant="h4" component="h1" sx={{ textAlign: 'center', mb: '1.5rem' }}>
        Create Wallet
      </Typography>

      <Box
        display="flex"
        flexDirection="column"
        component="form"
        noValidate
        autoComplete="off"
        sx={{ paddingRight: { sm: '3rem' }, height: '300px' }}
        onSubmit={onSubmitHandler}
      >
        {step <= 1 && !error && (
          <>
            <Typography
              sx={{
                fontSize: '1rem',
                mb: '1rem',
                height: '100px',
                textAlign: 'center',
              }}
            >
              Please move your mouse to generate private key...
            </Typography>
            <Typography
              sx={{
                fontSize: '1rem',
                mb: '1rem',
                height: '100px',
                textAlign: 'center',
              }}
            >
              Random number: {getRandom(point)}
            </Typography>
          </>
        )}
        {step <= 1 && error && (
          <Typography
            sx={{
              fontSize: '1.5rem',
              color: 'red',
              mb: '1rem',
              height: '100px',
              textAlign: 'center',
            }}
          >
            {error}
          </Typography>
        )}

        {step === 2 && (
          <>
            <Typography
              sx={{
                fontSize: '1rem',
                mb: '1rem',
                height: 'auto',
                textAlign: 'center',
              }}
            >
              Please write down the following Chinese Poem which relate to private key...
            </Typography>
            {poem && (
              <Typography
                sx={{
                  fontSize: '1.5rem',
                  mb: '0',
                  height: 'auto',
                  textAlign: 'center',
                }}
              >
                {poem.title}
              </Typography>
            )}
            {poem &&
              poem.sentences.map((sen) => (
                <Typography
                  key={sen}
                  sx={{
                    fontSize: '1rem',
                    mb: '0',
                    height: 'auto',
                    textAlign: 'center',
                  }}
                >
                  {sen}
                </Typography>
              ))}
          </>
        )}

        {step === 3 && (
          <>
            <Typography
              sx={{
                fontSize: '1rem',
                mb: '1rem',
                height: 'auto',
                textAlign: 'center',
              }}
            >
              Your wallet is created success!
            </Typography>
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              mt={2}
              spacing={2}
              sx={{ width: '100%', height: 'auto' }}
            >
              <Box
                component="div"
                sx={{
                  height: 180,
                  width: 180,
                }}
              >
                <div className="Container" dangerouslySetInnerHTML={{ __html: svg }} />
              </Box>
              <Typography sx={{ fontSize: '12px' }}>
                address: {wallet && wallet.address ? wallet.address : ''}
              </Typography>
              <Button
                variant="contained"
                disableElevation
                onClick={() => {
                  window.electron.ipcRenderer.reload();
                }}
              >
                OK
              </Button>
            </Stack>
          </>
        )}

        {showNext && point && (
          <LoadingButton
            loading={false}
            type="submit"
            variant="contained"
            sx={{
              py: '0.4rem',
              mt: 2,
              width: '118px',
              marginInline: 'auto',
            }}
          >
            Next
          </LoadingButton>
        )}

        {step <= 1 && (
          <LoadingButton
            loading={false}
            variant="contained"
            sx={{
              py: '0.4rem',
              mt: 2,
              width: '118px',
              marginInline: 'auto',
            }}
            onClick={() => {
              navigate('/wallet-info');
            }}
          >
            Close
          </LoadingButton>
        )}
      </Box>
    </Stack>
  );
}
