/**
 * @fileOverview
 * @name PayPasswordDialog.tsx
 * @author lidh04
 * @license copyright to shc
 */
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';
import TextField from '@mui/material/TextField';
import { checkPayPassword } from 'common/wallet-types';

export default function PayPasswordDialog({
  callback,
  initOpen,
}: {
  initOpen: boolean;
  callback: (payPassword: string) => Promise<void>;
}) {
  const [payPassword, setPayPassword] = React.useState<string>('');
  const [payPassword2, setPayPassword2] = React.useState<string>('');
  const [inited, setInited] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [error2, setError2] = React.useState<boolean>(false);

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setPayPassword(value);
    console.log('pay password:', value);
  };

  const handleValueChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setPayPassword2(value);
    console.log('pay password:', value);
  };

  const handleClose = async () => {
    setError(false);
    await callback('');
  };

  const handleInput = async () => {
    if (inited) {
      const oldPayPassword = await window.electron.ipcRenderer.getPayPassword();
      console.log('old pay password:', oldPayPassword, 'payPassword:', payPassword);
      if (oldPayPassword !== payPassword) {
        setError(true);
      } else {
        await callback(payPassword);
        setPayPassword(''); // reset pay password
        setError(false);
      }
      return;
    }

    if (payPassword !== payPassword2) {
      setError2(true);
    } else if (checkPayPassword(payPassword)) {
      await window.electron.ipcRenderer.setPayPassword(payPassword);
      await callback(payPassword);
      setPayPassword(''); // reset pay password
      setError(false);
    } else {
      setError(true);
    }
  };

  React.useEffect(() => {
    window.electron.ipcRenderer
      .getPayPassword()
      .then((oldPayPassword) => {
        setInited(!!oldPayPassword);
        return true;
      })
      .catch((err) => {
        console.error('getPayPassword error:', err);
        return false;
      });
  }, []);

  return (
    <div>
      <Dialog open={initOpen}>
        <DialogTitle>Pay Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {inited ? 'Please input pay password' : 'Pay password is not set, Please set pay password.'}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="input pay password"
            type="password"
            onChange={handleValueChange}
            fullWidth
            variant="standard"
            error={!!error}
            helperText={error ? 'invalid pay password!' : ''}
          />
          {!inited && (
            <TextField
              autoFocus
              margin="dense"
              id="reinput pay password"
              label="re-input pay password"
              type="password"
              onChange={handleValueChange2}
              fullWidth
              variant="standard"
              error={!!error2}
              helperText={error2 ? 'the two pay passwords are not same!' : ''}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleInput}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
