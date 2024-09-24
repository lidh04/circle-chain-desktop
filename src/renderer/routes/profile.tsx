import Avatar from '@mui/material/Avatar';
import * as React from 'react';
import Stack from '@mui/material/Stack';

import { Account } from '../../common/account-types';

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  const items = name.split(' ');
  const first = items[0][0];
  let second = '';
  if (items.length > 1) {
    second = items[1][0];
  }

  return {
    sx: {
      bgcolor: stringToColor(name),
      width: '80px',
      height: '80px',
      fontSize: '2.5rem',
    },
    children: `${first}${second}`,
  };
}

export default function Profile() {
  const [account, setAccount] = React.useState<Account | null>(null);

  React.useEffect(() => {
    window.electron.ipcRenderer
      .getAccount()
      .then((account) => {
        console.info('account:', account);
        setAccount(account);
      })
      .catch((err) => {
        console.error('error:', err);
      });
  }, []);

  const getAccountName = () => {
    if (!account || !account.value) {
      return '';
    }
    const index = account.value.indexOf('@');
    if (index !== -1) {
      return account.value.substring(0, index);
    }
    return '';
  };
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      mt={2}
      spacing={2}
      sx={{ width: '100%', height: 'auto' }}
    >
      <Avatar {...stringAvatar(account ? account.value : '')} />
      <h1>{getAccountName()}</h1>
      <p className="title">{account ? account.value : ''}</p>
    </Stack>
  );
}
