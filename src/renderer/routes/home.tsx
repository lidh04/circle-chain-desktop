import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from 'react-router-dom';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import icon from '../../../assets/icon.svg';

export default function Home() {
  const navigate = useNavigate();

  const gotoLogin = () => {
    console.log("navigate to signin");
    navigate("/signin");
  };
  const gotoRegister = () => {
    console.log("navigate to signup");
    navigate("/signup");
  };
  return (
    <div>
      <div className="hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1 className="hello">
        {"circle chain app"}
      </h1>
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
            onClick={gotoLogin}>
            Login
          </Button>
          <Button
            variant="contained"
            startIcon={<AppRegistrationIcon />}
            color="secondary"
            onClick={gotoRegister}>
            Signup
          </Button>
        </Box>
      </div>
    </div>
  );
};
