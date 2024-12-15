import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import RunCircleIcon from '@mui/icons-material/RunCircle';
import { Account } from 'common/account-types';
import { PublicWallet, WalletPackage } from '../../common/wallet-types';
import CircleDialog from '../components/CircleDialog';
import { MINE_BLOCK_LOG_CHANNEL, MINE_BLOCK_REPLY_CHANNEL } from '../../common/wallet-constants';
import MinHeightTextarea from '../components/MinHeightTextarea';

interface MineBlockInfo {
  isLoading: boolean;
  address: string;
  core: number;
}

interface Props {
  account: Account | null;
}

export default function MineBlock(props: Props) {
  const { account } = props;
  const [core, setCore] = React.useState<number>(1);
  const [cpuList, setCpuList] = React.useState<number[]>([1]);
  const [addressList, setAddressList] = React.useState<string[]>(['']);
  const [address, setAddress] = React.useState<string>('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [openMineSuccess, setOpenMineSuccess] = React.useState(false);
  const [mineBlockLog, setMineBlockLog] = React.useState([] as string[]);
  const [logStore, setLogStore] = React.useState([] as string[]);

  const navigate = useNavigate();

  const record = (log: string) => {
    return `${new Date().toISOString()} - ${log}`;
  };

  const stopMineBlock = async () => {
    await window.electron.ipcRenderer.stopMineBlock();
    setIsLoading(false);
    await window.electron.ipcRenderer.setMineBlockInfo('');
    logStore.push(record('mine block task is stopped.'));
    setMineBlockLog([...logStore]);
  };

  const onSubmitHandler: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    console.log('address:', address, 'cpu core:', core);
    if (!address) {
      setError('address cannot be empty!');
      return;
    }
    if (!core || cpuList.indexOf(core) === -1) {
      setError('invalid cpu core!');
      return;
    }

    setIsLoading(true);
    setError('');
    logStore.push(record(`begin to mine block task using ${core} cpus with address: ${address}`));
    setMineBlockLog([...logStore]);
    window.electron.ipcRenderer.mineBlock(address, core);
    logStore.push(record(`mine block task using ${core} cpus with address: ${address} started`));
    setMineBlockLog([...logStore]);
  };

  const handleCPUChange = (event: SelectChangeEvent) => {
    event.preventDefault();
    setCore(parseInt(event.target.value as string, 10));
  };

  const handleAddressChange = (event: SelectChangeEvent) => {
    event.preventDefault();
    setAddress(event.target.value as string);
  };

  useEffect(() => {
    if (!account) {
      navigate('/signin');
      return;
    }

    window.electron.ipcRenderer
      .getMineBlockInfo()
      .then((mineBlockInfo) => {
        console.log('getMineBlockInfo:', mineBlockInfo);
        let info: MineBlockInfo = {
          core: 1,
          address: '',
          isLoading: false,
        };
        if (mineBlockInfo) {
          info = JSON.parse(mineBlockInfo);
        }
        window.electron.ipcRenderer
          .getCpuCount()
          .then((cpuCount) => {
            const items = [];
            for (let i = 0; i < cpuCount; i += 1) {
              items.push(i + 1);
            }
            setCpuList(items);
            setCore(info.core);
            return true;
          })
          .catch((err) => console.error(err));

        // set address list and selected address.
        window.electron.ipcRenderer
          .getWalletPackage('')
          .then((result: WalletPackage) => {
            const addresses = result.wallets.map((wallet: PublicWallet) => wallet.address);
            setAddressList(addresses);
            if (info.address) {
              setAddress(info.address);
            } else if (addresses.length > 0) {
              setAddress(addresses[0]);
            }
            return true;
          })
          .catch((err) => console.error(err));

        // set loading.
        setIsLoading(info.isLoading);

        window.electron.ipcRenderer
          .readMineBlockLog()
          .then((logs: string[]) => {
            if (logs.length > 0 && info.isLoading) {
              setLogStore(logs);
              setMineBlockLog([...logs]);
            }
            return true;
          })
          .catch((err) => console.error('readMineBlockLog error:', err));

        return true;
      })
      .catch((err) => console.error('getMineBlockInfo error:', err));

    window.electron.ipcRenderer.on(MINE_BLOCK_REPLY_CHANNEL, (result: string) => {
      const response: { code: number; msg: string; data?: boolean } = JSON.parse(result);
      console.log('mine block response:', result);
      logStore.push(record(`mine the block task response: ${JSON.stringify(response)}`));
      if (response.code === 200 && response.data) {
        console.log('mine block success!');
        logStore.push(record('mine block task success!'));
        setOpenMineSuccess(true);
      } else {
        const mineBlockError = response.code === 200 ? 'the mined blocked is obsoleted!' : response.msg;
        logStore.push(record(`mine block task failure: ${response.msg}`));
        setError(mineBlockError);
      }
      setMineBlockLog([...logStore]);
      stopMineBlock()
        .then(() => console.log('stop mine block success.'))
        .catch((err) => console.error('stop mine block error:', err));
    });

    window.electron.ipcRenderer.on(MINE_BLOCK_LOG_CHANNEL, (log: string) => {
      console.log('receive mine block log:', log);
      const formattedLog = log
        .split('\n')
        .filter((it) => !!it)
        .map((it) => record(it))
        .join('\n');
      const exist = logStore.find((line) => line === formattedLog);
      if (!exist) {
        logStore.push(formattedLog);
        setMineBlockLog([...logStore]);
      }
    });

    return () => {
      console.log('mine block page is unmounted.');
      if (logStore.length > 0) {
        window.electron.ipcRenderer
          .saveMineBlockLog(logStore)
          .then((result) => console.log('saveMineBlockLog result:', result))
          .catch((err) => console.error('saveMineBlockLog error:', err));
      }
      return true;
    };
  }, [account]);

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
                value={`${core}`}
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

        <Grid container spacing={2} sx={{ mb: '0.1rem', mt: '1rem', padding: '0.2rem 1rem' }}>
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

        <Grid container spacing={2} sx={{ mb: '0.5rem', mt: '0.1rem', padding: '0.2rem 1rem' }}>
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
                  <Typography sx={{ fontSize: '0.9rem', mt: '1rem', mb: '1rem', color: 'red' }}>{error}</Typography>
                </Grid>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              mt={2}
              spacing={2}
              sx={{ width: '100%', height: 'auto' }}
            >
              <MinHeightTextarea
                placeholder="mine block console"
                disabled
                minRows={2}
                maxRows={8}
                value={mineBlockLog.join('\n')}
              />
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
