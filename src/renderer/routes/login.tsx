import { Box, Checkbox, Container, FormControlLabel, Grid, Stack, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { FC, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { boolean, object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import styled from '@emotion/styled';
import FormInput from '../components/FormInput';
import WalletError from '../../common/wallet-error';
import { buildMessageFromCode } from '../../common/wallet-constants';
import { WalletPackage } from '../../common/wallet-types';

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
const loginSchema = object({
  email: string().min(1, 'Email is required').email('Email is invalid'),
  password: string()
    .min(1, 'Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
  persistUser: boolean().optional(),
});

// 👇 Infer the Schema to get the TS Type
type ILogin = TypeOf<typeof loginSchema>;

const LoginPage: FC = () => {
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 👇 Default Values
  const defaultValues: ILogin = {
    email: '',
    password: '',
    persistUser: false,
  };

  // 👇 The object returned from useForm Hook
  const methods = useForm<ILogin>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  // 👇 Submit Handler
  const onSubmitHandler: SubmitHandler<ILogin> = async (values: ILogin) => {
    console.log('user input:', values, 'isBrowser:', typeof window);
    setIsLoading(true);
    const email = values.email.toLowerCase();
    try {
      const result = await window.electron.ipcRenderer.loginWitPassword({
        type: 'email',
        value: email,
        password: values.password,
      });
      console.log('login result:', result);
      if (result === 200) {
        const walletPackage: WalletPackage = (await window.electron.ipcRenderer.getWalletPackage(
          values.email
        )) as WalletPackage;
        await window.electron.ipcRenderer.saveAccount(walletPackage.account);
        window.electron.ipcRenderer.reload();
      } else {
        const message = buildMessageFromCode(result);
        setLoginError(message);
      }
      setIsLoading(false);

      return result;
    } catch (error) {
      setIsLoading(false);

      if (error instanceof WalletError) {
        const { code, message } = error;
        console.log('code:', code, 'message:', message);
      }
    }
    return false;
  };

  // 👇 JSX to be rendered
  return (
    <Container maxWidth="sm" sx={{ height: '100vh', maxWidth: '560px' }}>
      <Grid container justifyContent="center" alignItems="center" sx={{ width: '100%', height: 'auto' }}>
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
                      LOG INTO YOUR ACCOUNT
                    </Typography>

                    <FormInput label="Enter your email" type="email" name="email" required />
                    <FormInput type="password" label="Password" name="password" required />

                    <FormControlLabel
                      control={
                        <Checkbox size="small" aria-label="remember me" required {...methods.register('persistUser')} />
                      }
                      label={
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: '0.8rem',
                            fontWeight: 400,
                            color: '#5e5b5d',
                          }}
                        >
                          Remember me
                        </Typography>
                      }
                    />

                    {loginError && (
                      <Grid container justifyContent="center" rowSpacing={2}>
                        <Typography sx={{ fontSize: '0.9rem', mt: '1rem', mb: '1rem', color: 'red' }}>
                          {loginError}
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
                      Login
                    </LoadingButton>
                  </Box>
                </Grid>
              </Grid>

              <Grid container justifyContent="center">
                <Stack sx={{ mt: '3rem', textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '0.9rem', mb: '1rem' }}>
                    Need an account? <LinkItem to="/signup">Sign up here</LinkItem>
                  </Typography>
                  <Typography sx={{ fontSize: '0.9rem' }}>
                    <LinkItem to="/forgot-password">Forgot your Password?</LinkItem>
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

export default LoginPage;
