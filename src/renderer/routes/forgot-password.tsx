import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import * as React from 'react';
import { FC, useEffect } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import styled from '@emotion/styled';
import FormInput from '../components/FormInput';
import Button from '@mui/material/Button';
import WalletError from '../../common/wallet-error';
import { buildMessageFromCode } from '../../common/wallet-constants';

// 👇 Styled React Route Dom Link Component
export const LinkItem = styled(Link)`
  text-decoration: none;
  color: #3683dc;
  &:hover {
    text-decoration: underline;
    color: #5ea1b6;
  }
`;

// 👇 Login Schema with Zod
const resetSchema = object({
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
});

// 👇 Infer the Schema to get the TS Type
type IReset = TypeOf<typeof resetSchema>;

const ForgotPassword: FC = () => {
  const [resetSucc, setResetSucc] = React.useState(false);
  const [sendLabel, setSendLabel] = React.useState('Send');
  const [timeoutValue, setTimeoutValue] = React.useState(300);
  const [startTimer, setStartTimer] = React.useState(false);
  const [verifyCodeError, setVerifyCodeError] = React.useState('');
  const [resetPasswordError, setResetPasswordError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const navigate = useNavigate();

  // 👇 Default Values
  const defaultValues: IReset = {
    email: '',
    password1: '',
    password2: '',
    verifyCode: '',
  };

  // 👇 The object returned from useForm Hook
  const methods = useForm<IReset>({
    resolver: zodResolver(resetSchema),
    defaultValues,
  });

  // 👇 Submit Handler
  const onSubmitHandler: SubmitHandler<IReset> = async (values: IReset) => {
    console.log(JSON.stringify(values, null, 4));
    setIsLoading(true);
    if (!values.verifyCode) {
      console.error('verify code should not be empty!');
      setVerifyCodeError('verify code empty!');
      setIsLoading(false);
      return false;
    }
    if (values.verifyCode.length !== 6) {
      console.error('verify code should be 6 digits');
      setVerifyCodeError('verify code should be 6 digits');
      setIsLoading(false);
      return false;
    }
    try {
      const result = await window.electron.ipcRenderer.resetPassword({
        account: {
          email: values.email,
        },
        password1: values.password1,
        password2: values.password2,
        verifyCode: values.verifyCode || '',
      });
      console.log('reset password result:', result);
      if (result === 200) {
        setResetSucc(true);
        setTimeout(() => navigate('/signin'), 3000);
      } else {
        const message = buildMessageFromCode(result);
        setResetPasswordError(message);
      }
      setIsLoading(false);
      return result;
    } catch (error) {
      if (error instanceof WalletError) {
        const { code, message } = error;
        setResetPasswordError(message);
        console.log('code:', code, 'message:', message);
      }
      setIsLoading(false);
    }
    return false;
  };

  const handleSendVerifyCode: SubmitHandler<IReset> = async (values: IReset) => {
    console.log('send reset password verify code...');
    if (!startTimer) {
      try {
        const result = await window.electron.ipcRenderer.sendResetPasswordVerifyCode({
          type: 'email',
          value: values.email,
        });
        console.log('send reset password verify code result:', result);
        if (result !== 200) {
          const message = buildMessageFromCode(result);
          setResetPasswordError(message);
        } else {
          setStartTimer(true);
        }
        return result;
      } catch (error) {
        if (error instanceof WalletError) {
          const { code, message } = error;
          setResetPasswordError(message);
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

  // 👇 JSX to be rendered
  return (
    <Container maxWidth="sm" sx={{ height: '100vh', maxWidth: '560px' }}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ width: '100%', height: 'auto' }}
      >
        <Grid item sx={{ maxWidth: '45rem', width: '100%' }}>
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
          <FormProvider {...methods}>
            <Grid
              container
              sx={{
                boxShadow: { sm: '0 0 0px #ddd' },
                py: '1rem',
                px: '1rem',
              }}
            >
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
                  <Typography variant="h6" component="h1" sx={{ textAlign: 'center', mb: '1.5rem' }}>
                    RESET YOUR PASSWORD
                  </Typography>

                  {!resetSucc && (
                    <Box
                      display="flex"
                      flexDirection="column"
                      component="form"
                      noValidate
                      autoComplete="off"
                      sx={{ paddingRight: { sm: '3rem' } }}
                      onSubmit={methods.handleSubmit(onSubmitHandler)}
                    >
                      <FormInput label="Enter your email" type="email" name="email" required />
                      <FormInput type="Password" label="New Password" name="password1" required />
                      <FormInput label="Confirm new password" type="password" name="password2" required />
                      <Grid container spacing={2}>
                        <Grid item xs={8}>
                          {verifyCodeError && (
                            <FormInput
                              label="Enter your reset verifyCode"
                              type="text"
                              name="verifyCode"
                              fullWidth
                              error
                              helperText={verifyCodeError}
                              required
                            />
                          )}
                          {!verifyCodeError && (
                            <FormInput
                              label="Enter your reset verifyCode"
                              type="text"
                              name="verifyCode"
                              fullWidth
                              required
                            />
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

                      {resetPasswordError && (
                        <Grid container justifyContent="center" rowSpacing={2}>
                          <Typography sx={{ fontSize: '0.9rem', mt: '1rem', mb: '1rem', color: 'red' }}>
                            {resetPasswordError}
                          </Typography>
                        </Grid>
                      )}

                      <LoadingButton
                        loading={isLoading}
                        type="submit"
                        variant="contained"
                        sx={{
                          py: '0.8rem',
                          mt: 2,
                          width: '32%',
                          marginInline: 'auto',
                        }}
                      >
                        Reset
                      </LoadingButton>
                    </Box>
                  )}
                  {resetSucc && (
                    <Box
                      display="flex"
                      flexDirection="column"
                      component="form"
                      noValidate
                      autoComplete="off"
                      sx={{ paddingRight: { sm: '3rem' } }}
                    >
                      <Typography sx={{ fontSize: '1rem', mb: '1rem', textAlign: 'center' }}>
                        Your password is reset successfully!
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
              <Grid container justifyContent="center">
                <Stack sx={{ mt: '3rem', textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '0.9rem', mb: '1rem' }}>
                    Already have an account? <LinkItem to="/signin">Login</LinkItem>
                  </Typography>

                  <Typography sx={{ fontSize: '0.9rem', mb: '1rem' }}>
                    Need an account? <LinkItem to="/signup">Sign up here</LinkItem>
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </FormProvider>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ForgotPassword;
