import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import React, { FC, useEffect } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../components/FormInput';
import { LinkItem } from './login';
import WalletError from '../../common/wallet-error';
import { WalletPackage } from '../../common/wallet-types';
import { useNavigate } from 'react-router-dom';
import { buildMessageFromCode } from 'common/wallet-constants';

// 👇 SignUp Schema with Zod
const signupSchema = object({
  email: string().min(1, 'Email is required').email('Email is invalid'),
  password1: string()
    .min(1, 'Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
  password2: string()
    .min(1, 'Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
  verifyCode: string().optional(),
}).refine((data) => data.password1 === data.password2, {
  path: ['password2'],
  message: 'Passwords do not match',
});

const verifyCodeSchema = object({
  email: string().min(1, 'Email is required').email('Email is invalid'),
});

// 👇 Infer the Schema to get TypeScript Type
type ISignUp = TypeOf<typeof signupSchema>;
type IVerifyCode = TypeOf<typeof verifyCodeSchema>;

const SignupPage: FC = () => {
  const [sendLabel, setSendLabel] = React.useState('Send');
  const [timeoutValue, setTimeoutValue] = React.useState(30);
  const [startTimer, setStartTimer] = React.useState(false);
  const [verifyCodeError, setVerifyCodeError] = React.useState('');
  const [registerError, setRegisterError] = React.useState('');

  const navigate = useNavigate();

  // 👇 Default Values
  const defaultValues: ISignUp = {
    email: '',
    password1: '',
    password2: '',
    verifyCode: '',
  };

  // 👇 Object containing all the methods returned by useForm
  const methods = useForm<ISignUp>({
    resolver: zodResolver(signupSchema),
    defaultValues,
  });

  // 👇 Form Handler
  const onSubmitHandler: SubmitHandler<ISignUp> = async (values: ISignUp) => {
    console.log(JSON.stringify(values, null, 4));
    if (!values.verifyCode) {
      console.error('verify code should not be empty!');
      setVerifyCodeError('verify code empty!');
      return false;
    }
    if (values.verifyCode.length !== 6) {
      console.error('verify code should be 6 digits');
      setVerifyCodeError('verify code should be 6 digits');
      return false;
    }
    try {
      const result = await window.electron.ipcRenderer.register({
        type: 'email',
        value: values.email,
        passwordInput1: values.password1,
        passwordInput2: values.password2,
        verifyCode: values.verifyCode || '',
      });
      console.log('register result:', result);
      if (result === 200) {
        const walletPackage: WalletPackage = (await window.electron.ipcRenderer.getWalletPackage(
          values.email
        )) as WalletPackage;
        await window.electron.ipcRenderer.saveAccount(walletPackage.account);
        navigate('/home');
      } else {
        const message = buildMessageFromCode(result);
        setRegisterError(message);
      }
      return result;
    } catch (error) {
      if (error instanceof WalletError) {
        const { code, message } = error;
        console.log('code:', code, 'message:', message);
      }
    }
    return false;
  };

  const handleSendVerifyCode: SubmitHandler<ISignUp> = async (values: ISignUp) => {
    console.log('send register verify code...');
    if (!startTimer) {
      setStartTimer(true);
      try {
        const result = await window.electron.ipcRenderer.sendRegisterVerifyCode({
          type: 'email',
          value: values.email,
        });
        console.log('send register verify code result:', result);
        return result;
      } catch (error) {
        if (error instanceof WalletError) {
          const { code, message } = error;
          console.log('code:', code, 'message:', message);
        }
      }
      return false;
    }

    return false;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!startTimer) {
        return;
      }

      if (timeoutValue >= 0) {
        setSendLabel(`(${timeoutValue > 1 ? timeoutValue - 1 : 0})`);
        setTimeoutValue(timeoutValue - 1);
      } else {
        setSendLabel('Send');
        setTimeoutValue(300);
        setStartTimer(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [startTimer, timeoutValue]);

  // 👇 Returned JSX
  return (
    <Container maxWidth="sm" sx={{ height: '100vh', maxWidth: '560px' }}>
      <Grid container justifyContent="center" alignItems="center" sx={{ width: '100%', height: 'auto' }}>
        <Grid item sx={{ maxWidth: '45rem', width: '100%' }}>
          <Grid
            container
            sx={{
              borxShadow: { sm: '0 0 0px #ddd' },
              py: '1rem',
              px: '1rem',
            }}
          >
            <FormProvider {...methods}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  textAlign: 'center',
                  width: '100%',
                  mb: '0.5rem',
                  pb: { sm: '3rem' },
                }}
              >
                Welcome To CircleChain!
              </Typography>
              <Grid
                item
                container
                justifyContent="space-between"
                rowSpacing={5}
                sx={{
                  maxWidth: { sm: '45rem' },
                  marginInline: 'auto',
                }}
              >
                <Grid item xs={12} sm={12}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    component="form"
                    noValidate
                    autoComplete="off"
                    sx={{ paddingRight: { sm: '3rem' } }}
                    onSubmit={methods.handleSubmit(onSubmitHandler)}
                  >
                    <Typography variant="h6" component="h1" sx={{ textAlign: 'center', mb: '1.5rem' }}>
                      CREATE NEW YOUR ACCOUNT
                    </Typography>

                    <FormInput label="Enter your email" type="text" name="email" required />
                    <FormInput type="Password" label="Password" name="password1" required />
                    <FormInput label="Confirm your password" type="password" name="password2" required />
                    <Grid container spacing={2}>
                      <Grid item xs={8}>
                        {verifyCodeError && (
                          <FormInput
                            label="Enter your verifyCode"
                            type="text"
                            name="verifyCode"
                            fullWidth
                            error
                            helperText={verifyCodeError}
                            required
                          />
                        )}
                        {!verifyCodeError && (
                          <FormInput label="Enter your verifyCode" type="text" name="verifyCode" fullWidth required />
                        )}
                      </Grid>
                      <Grid item xs={4}>
                        {startTimer && (
                          <Button
                            variant="text"
                            sx={{ mt: '10px' }}
                            disabled
                            onClick={methods.handleSubmit(handleSendVerifyCode)}
                          >
                            {sendLabel}
                          </Button>
                        )}
                        {!startTimer && (
                          <Button
                            variant="text"
                            sx={{ mt: '10px' }}
                            onClick={methods.handleSubmit(handleSendVerifyCode)}
                          >
                            {sendLabel}
                          </Button>
                        )}
                      </Grid>
                    </Grid>

                    <LoadingButton
                      loading={false}
                      type="submit"
                      variant="contained"
                      sx={{
                        py: '0.8rem',
                        mt: 2,
                        width: '32%',
                        marginInline: 'auto',
                      }}
                    >
                      Sign Up
                    </LoadingButton>
                  </Box>
                </Grid>
              </Grid>
              {registerError && (
                <Grid container justifyContent="center">
                  <Typography sx={{ fontSize: '0.9rem', mb: '1rem', color: 'red' }}>{registerError}</Typography>
                </Grid>
              )}

              <Grid container justifyContent="center">
                <Stack sx={{ mt: '3rem', textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '0.9rem', mb: '1rem' }}>
                    Already have an account? <LinkItem to="/signin">Login</LinkItem>
                  </Typography>
                </Stack>
              </Grid>
            </FormProvider>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SignupPage;
