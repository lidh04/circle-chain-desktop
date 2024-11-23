import React, { useEffect } from 'react';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import RunCircleIcon from '@mui/icons-material/RunCircle';
import Cookies from 'js-cookie';
import { PublicWallet, WalletPackage } from '../../common/wallet-types';
import CircleDialog from '../components/CircleDialog';
import { MINE_BLOCK_REPLY } from '../../common/wallet-constants';

export default function MineBlock() {
  const [core, setCore] = React.useState<number>(1);
  const [cpuList, setCpuList] = React.useState<number[]>([1]);
  const [addressList, setAddressList] = React.useState<string[]>(['']);
  const [address, setAddress] = React.useState<string>('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [openMineSuccess, setOpenMineSuccess] = React.useState(false);

  const stopMineBlock = async () => {
    await window.electron.ipcRenderer.stopMineBlock();
    setIsLoading(false);
    Cookies.remove('isLoading');
    Cookies.remove('address');
    Cookies.remove('core');
  };

  const onSubmitHandler: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    console.log('address:', address, 'cpu core:', core);
    setIsLoading(true);
    setError('');
    Cookies.set('isLoading', '1');
    await window.electron.ipcRenderer.mineBlock(address, core);
  };

  const handleCPUChange = (event: SelectChangeEvent) => {
    event.preventDefault();
    setCore(event.target.value as number);
    Cookies.set('core', `${event.target.value}`, { expires: 1 });
  };

  const handleAddressChange = (event: SelectChangeEvent) => {
    event.preventDefault();
    setAddress(event.target.value as string);
    Cookies.set('address', event.target.value as string, { expires: 1 });
  };

  useEffect(() => {
    window.electron.ipcRenderer.getCpuCount().then((cpuCount) => {
      const items = [];
      for (let i = 0; i < cpuCount; i += 1) {
        items.push(i + 1);
      }
      setCpuList(items);

      const coreInCookie = Cookies.get('core');
      if (coreInCookie) {
        setCore(parseInt(coreInCookie, 10));
      }
      return true;
    });
    window.electron.ipcRenderer.getWalletPackage('').then((result: WalletPackage) => {
      const addresses = result.wallets.map((wallet: PublicWallet) => wallet.address);
      setAddressList(addresses);
      const addressInCookie = Cookies.get('address');
      if (addressInCookie) {
        setAddress(addressInCookie);
      } else if (addresses.length > 0) {
        setAddress(addresses[0]);
      }
      return true;
    });

    const isLoadingInCookie = Cookies.get('isLoading');
    if (isLoadingInCookie) {
      setIsLoading(true);
    }

    window.electron.ipcRenderer.once(MINE_BLOCK_REPLY, (result: string) => {
      const response: { code: number; msg: string; data?: boolean } = JSON.parse(result);
      console.log('mine block response:', result);
      if (response.code === 200 && response.data) {
        console.log('mine block success!');
        setOpenMineSuccess(true);
      } else {
        const mineBlockError = response.code === 200 ? 'the mined blocked is obsoleted!' : response.msg;
        setError(mineBlockError);
      }
      stopMineBlock()
        .then(() => console.log('stop mine block success.'))
        .catch((err) => console.error('stop mine block error:', err));
    });
  }, [setAddressList, setCpuList]);

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      mt={2}
      spacing={2}
      sx={{ width: '100%', height: 'auto' }}
    >
      <Typography variant="h4" component="h1" sx={{ textAlign: 'center', mb: '1.5rem' }}>
        Mine Block
      </Typography>
      <Typography variant="h6" component="h1" sx={{ textAlign: 'center', mb: '1.5rem' }}>
        Get the mine data and mine the block locally, you will get the miner coin 100,000 LI each block.
      </Typography>
      <Box
        display="flex"
        flexDirection="column"
        component="form"
        noValidate
        autoComplete="off"
        sx={{ paddingRight: { sm: '3rem' }, height: 'auto', width: '100%' }}
        onSubmit={onSubmitHandler}
      >
        <Grid container spacing={2} sx={{ mb: '1rem', mt: '1rem', padding: '0.3rem 1rem' }}>
          <Grid item xs={3}>
            <Typography variant="h6" component="h1" sx={{ textAlign: 'right', mt: '0.5rem' }}>
              CPU
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <FormControl fullWidth disabled={isLoading}>
              <InputLabel id="demo-simple-select-label">Cores</InputLabel>
              <Select
                labelId="core-select-label"
                id="core-select"
                value={core}
                label="CPU Cores"
                onChange={handleCPUChange}
              >
                {cpuList.map((cpu) => (
                  <MenuItem value={cpu} key={`cpu-${cpu}`}>
                    {cpu}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: '1rem', mt: '1rem', padding: '0.3rem 1rem' }}>
          <Grid item xs={3}>
            <Typography variant="h6" component="h1" sx={{ textAlign: 'right', mt: '0.5rem' }}>
              Address
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <FormControl fullWidth disabled={isLoading}>
              <InputLabel id="demo-simple-select-label">Mined to the address</InputLabel>
              <Select
                labelId="mine-select-label"
                id="mine-select"
                value={address}
                label="Mined to the address"
                onChange={handleAddressChange}
              >
                {addressList.map((item) => (
                  <MenuItem value={item} key={`address-${item}`}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: '1rem', mt: '1rem', padding: '0.3rem 1rem' }}>
          <Grid item xs={12}>
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              mt={2}
              spacing={2}
              sx={{ width: '100%', height: 'auto' }}
            >
              <LoadingButton
                loading={isLoading}
                type="submit"
                variant="contained"
                startIcon={<RunCircleIcon />}
                sx={{
                  py: '0.4rem',
                  mt: 1,
                  width: '228px',
                  height: '60px',
                  marginInline: 'auto',
                }}
              >
                Start
              </LoadingButton>
              {isLoading && (
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  onClick={async () => {
                    await stopMineBlock();
                  }}
                >
                  Stop
                </Button>
              )}

              {error && (
                <Grid container justifyContent="center" rowSpacing={2}>
                  <Typography sx={{ fontSize: '0.9rem', mt: '1rem', mb: '1rem', color: 'red' }}>
                    {error}
                  </Typography>
                </Grid>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Box>
      <CircleDialog
        open={openMineSuccess}
        title="Success"
        body={['Congrats!', 'You mined one block success!']}
        btnText="Close"
        close={() => setOpenMineSuccess(false)}
      />
    </Stack>
  );
}
