/**
 * @fileOverview
 * @name InputAccountDialog.tsx
 * @author lidh04
 * @license copyright to shc
 */
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { validateEmail } from 'common/wallet-types';

export default function InputAccountDialog(props: { initOpen: boolean, callback: (email: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState<string>("");
  const [error, setError] = React.useState<boolean>(false);

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setEmail(value);
    console.log('email:', value);
  }

  const handleInput = () => {
    if (validateEmail(email)) {
      props.callback(email);
      setOpen(false);
    } else {
      setError(true);
    }
  };

  React.useEffect(() => {
    setOpen(props.initOpen);
  }, [setOpen]);

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle>Email Input</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To use the circle chain desktop, please enter your email address here. So circle chain desktop will use it to create local wallets.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            onChange={handleValueChange}
            fullWidth
            variant="standard"
            error={!!error}
            helperText={error ? "invalid email" : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleInput}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
