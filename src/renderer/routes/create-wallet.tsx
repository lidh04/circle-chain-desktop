import { Box, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import React, { MouseEvent, useEffect } from 'react';

export default function CreateWallet() {
  const [showNext, setShowNext] = React.useState(false);
  const [step, setStep] = React.useState(0);

  const onSubmitHandler = (e: MouseEvent) => {
    e.preventDefault();
    console.log('click the next button.');
    setShowNext(step + 1 < 3);
    setStep(step + 1);
  };

  useEffect(() => {
    setTimeout(() => {
      setShowNext(true);
      setStep(1);
    }, 3000);
  }, []);

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      mt={2}
      spacing={2}
      sx={{ width: '100%', height: 'auto' }}
    >
      <Typography
        variant="h6"
        component="h1"
        sx={{ textAlign: 'center', mb: '1.5rem' }}
      >
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
        {step <= 1 && (
          <Typography
            sx={{
              fontSize: '1rem',
              mb: '1rem',
              height: '200px',
              textAlign: 'center',
            }}
          >
            {'Please move your mouse to generate private key...'}
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
              {
                'Please write down the following Chinese Characters which relate to private key...'
              }
            </Typography>
            <Typography
              sx={{
                fontSize: '2rem',
                mb: '2rem',
                height: 'auto',
                textAlign: 'center',
              }}
            >
              {'「申即静」'}
              <br />
              {'竞味聚识咸，'}
              <br />
              {'嚷气鞭兼即。'}
              <br />
              {'匙稀遗翼饱，'}
              <br />
              {'美肢遮台斗。'}
            </Typography>
          </>
        )}

        {step === 3 && (
          <React.Fragment>
            <Typography
              sx={{
                fontSize: '1rem',
                mb: '1rem',
                height: 'auto',
                textAlign: 'center',
              }}
            >
              {'Your wallet is created success!'}
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
                component="img"
                sx={{
                  height: 180,
                  width: 180,
                }}
                alt="The new address qrcode."
                src="https://circle-node.net/static/release/circle-node.jpg"
              />
              <Typography sx={{ fontSize: '12px' }}>
                address: {'1MVQfJrU3mK3M62hygJz9pmgBxVoGzPaKj'}
              </Typography>
            </Stack>
          </React.Fragment>
        )}

        {showNext && (
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
      </Box>
    </Stack>
  );
}
