import {
  Container,
  Grid,
  Box,
  Typography,
  Stack,
  FormControlLabel,
} from '@mui/material';
import * as React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { FC } from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../components/FormInput';
import styled from '@emotion/styled';

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
});

// 👇 Infer the Schema to get the TS Type
type IReset = TypeOf<typeof resetSchema>;

const ForgotPassword: FC = () => {
  const [resetSucc, setResetSucc] = React.useState(false);
  const [email, setEmail] = React.useState("");
  // 👇 Default Values
  const defaultValues: IReset = {
    email: '',
  };

  // 👇 The object returned from useForm Hook
  const methods = useForm<IReset>({
    resolver: zodResolver(resetSchema),
    defaultValues,
  });

  // 👇 Submit Handler
  const onSubmitHandler: SubmitHandler<IReset> = (values: IReset) => {
    console.log(values);
    setEmail(values.email);
    setResetSucc(true);
  };

  // 👇 JSX to be rendered
  return (
    <Container
      maxWidth="sm"
      sx={{ height: '100vh', maxWidth: "560px" }}
    >
      <Grid
        container
        justifyContent='center'
        alignItems='center'
        sx={{ width: '100%', height: 'auto' }}
      >
        <Grid
          item
          sx={{ maxWidth: '45rem', width: '100%' }}
        >
          <Typography
            variant='h4'
            component='h1'
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
                justifyContent='space-between'
                rowSpacing={5}
                sx={{
                  maxWidth: { sm: '45rem' },
                  marginInline: 'auto',
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={12}
                >
                  <Typography
                    variant='h6'
                    component='h1'
                    sx={{ textAlign: 'center', mb: '1.5rem' }}
                  >
                    RESET YOUR PASSWORD
                  </Typography>

                  {!resetSucc &&
                   <Box
                     display='flex'
                     flexDirection='column'
                     component='form'
                     noValidate
                     autoComplete='off'
                     sx={{ paddingRight: { sm: '3rem' } }}
                     onSubmit={methods.handleSubmit(onSubmitHandler)}
                   >
                     <FormInput
                       label='Enter your email'
                       type='email'
                       name='email'
                       required
                     />
                     <LoadingButton
                       loading={false}
                       type='submit'
                       variant='contained'
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
                  }
                  {resetSucc &&
                   <Typography sx={{ fontSize: '1rem', mb: '1rem' }}>
                     Your password is reset successfully.<br/>
                     Your reset password was sent to your email: {email}.<br/>
                     Please open your email and login using the reset password.<br/>
                     When you login with reset password, please change the password as soon as possible.
                   </Typography>
                  }
                </Grid>
              </Grid>
              <Grid container justifyContent='center'>
                <Stack sx={{ mt: '3rem', textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '0.9rem', mb: '1rem' }}>
                    Already have an account? <LinkItem to='/signin'>Login</LinkItem>
                  </Typography>

                  <Typography sx={{ fontSize: '0.9rem', mb: '1rem' }}>
                    Need an account?{' '}
                    <LinkItem to='/signup'>Sign up here</LinkItem>
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
