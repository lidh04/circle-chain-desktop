import { Box, Grid, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';
import PaymentIcon from '@mui/icons-material/Payment';
import * as React from 'react';

import {
  addressListOf,
  AutocompleteOption,
  checkValidAddress,
  checkValidAsset,
  makeAssetLabel,
  makeWalletLabel,
  PublicWallet,
  validateEmail,
  WalletPackage,
} from '../../common/wallet-types';
import CircleDialog from '../components/CircleDialog';
import { TxType } from '../../common/block-types';
import PayPasswordDialog from '../components/PayPasswordDialog';
import { Account } from 'common/account-types';

const makeAddressOptionList = (addressList: string[]) =>
  addressList.map((address, index) => ({
    label: makeWalletLabel(address, index),
    value: address,
  }));

const makeAssetOptionList = (assetList: string[], type: string) =>
  assetList.map((asset) => ({
    label: makeAssetLabel(asset, type),
    value: asset,
  }));


const assetTypes = ['CRY', 'OWN', 'IDT'];

type MyError = {
  address?: boolean;
  email?: boolean;
  currency?: boolean;
  identity?: boolean;
  ownership?: boolean;
};

type MyDialog = {
  title: string;
  body: string[];
  btnText: string;
  open: boolean;
};

interface Props {
  account: Account | null;
  walletPackage: WalletPackage | null;
}

export default function WalletPayment(props: Props) {
  const { account, walletPackage } = props;
  const [payType, setPayType] = React.useState('from');
  const [payType2, setPayType2] = React.useState('to');
  const [otherEmail, setOtherEmail] = React.useState('');
  const [address, setAddress] = React.useState<AutocompleteOption>({
    label: '',
    value: '',
  });
  const [assetType, setAssetType] = React.useState(0);
  const [currencyValue, setCurrencyValue] = React.useState(0);
  const [asset, setAsset] = React.useState<AutocompleteOption>({
    label: '',
    value: '',
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<MyError>({} as MyError);
  const [dialog, setDialog] = React.useState<MyDialog>({} as MyDialog);
  const [payPasswordOpen, setPayPasswordOpen] = React.useState<boolean>(false);
  const [addresses, setAddresses] = React.useState<AutocompleteOption[]>([]);
  const [identities, setIdentities] = React.useState<AutocompleteOption[]>([]);
  const [ownerships, setOwnerships] = React.useState<AutocompleteOption[]>([]);
  const [queryParameters] = useSearchParams();

  const navigate = useNavigate();

  const selectWallet = (wp: WalletPackage | null, addr: string) => {
    if (!wp) {
      return;
    }

    const wallet = wp.wallets.find((w: PublicWallet) => w.address === addr);
    if (!wallet) {
      return;
    }

    const identityList = wallet.identities.map((item) => item.uuid);
    console.log('identityList:', identityList);
    const walletIdentities = makeAssetOptionList(identityList, 'IDT');
    setIdentities(walletIdentities);

    const ownershipList = wallet.ownerships.map((item) => item.uuid);
    const walletOwnerships = makeAssetOptionList(ownershipList, 'OWN');
    setOwnerships(walletOwnerships);
  };

  React.useEffect(() => {
    if (!account) {
      navigate('/login');
      return;
    }

    const addr = queryParameters.get('address');
    const walletAddressList = addressListOf(walletPackage);
    if (addr && checkValidAddress(addr)) {
      if (walletAddressList && walletAddressList.includes(addr)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const walletAddress = walletAddressList.find((item) => item === addr)!;
        if (walletAddress) {
          setAddress({
            label: makeWalletLabel(walletAddress, walletAddressList.indexOf(walletAddress)),
            value: walletAddress,
          });
        }

        selectWallet(walletPackage, addr);
      }
    }

    const allAddresses = makeAddressOptionList(walletAddressList);
    setAddresses(allAddresses);
  }, [queryParameters, account]);

  const handlePayTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setPayType(value);
    if (value === 'from') {
      setPayType2('to');
    } else {
      setPayType2('from');
    }
    console.log('pay type:', value);
  };

  const clearSubAddressMenu = () => {
    setAssetType(0);
    setAsset({ label: '', value: '' });
    setCurrencyValue(0);
  };

  const clearAddressMenu = () => {
    setAddress({ label: '', value: '' });
    setOtherEmail('');
    clearSubAddressMenu();
  };

  const handleAddressChange = (event: React.SyntheticEvent, value: string, reason: string) => {
    console.log('input value:', value, 'reason:', reason);
    if (!value) {
      clearAddressMenu();
      return;
    }
    if (checkValidAddress(value)) {
      const walletAddressList = walletPackage ? addressListOf(walletPackage) : [];
      if (walletAddressList.includes(value)) {
        const walletAddress = addresses.find((item) => item.value === value)!;
        console.log('selected address:', walletAddress);
        setAddress(walletAddress);
        if (walletPackage) {
          selectWallet(walletPackage, value);
        }
        clearSubAddressMenu();
      }
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setOtherEmail(value);
    console.log('email:', value);
  };

  const handleSearch = () => {
    console.log('use click search button, handle by payType:', payType);
  };

  const handleAssetTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setAssetType(parseInt(value, 10));
    console.log('asset type:', value);
  };

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setCurrencyValue(parseInt(value));
    console.log('asset:', value);
  };

  const handleInputAssetChange = (event: React.SyntheticEvent, value: string, reason: string) => {
    console.log('input value:', value, 'reason:', reason);
    if (!value) {
      setAsset({ label: '', value: '' });
      return;
    }

    if (assetType === 1) {
      setAsset({ label: makeAssetLabel(value, 'OWN'), value });
    } else if (assetType === 2) {
      setAsset({ label: makeAssetLabel(value, 'IDT'), value });
    }
  };

  const payWithCurrency = async (from: string, toEmail: string, value: number, payPassword: string) => {
    const [result, msg] = await window.electron.ipcRenderer.sendTo(from, toEmail, 0, value, payPassword);
    console.log('payWithCurrency result:', result, 'msg:', msg);
    if (result) {
      setDialog({
        title: 'SUCCESS',
        body: ['Your payment is processing, please check the transaction'],
        btnText: 'Close',
        open: true,
      });
    } else {
      setDialog({
        title: 'FAILURE',
        body: [`Your payment failed, error: ${msg}`],
        btnText: 'Close',
        open: true,
      });
    }
    setIsLoading(false);
    clearAddressMenu();
  };

  const sendWithAsset = async (
    from: string,
    toEmail: string,
    value: string,
    assetType: TxType,
    payPassword: string
  ) => {
    const [result, msg] = await window.electron.ipcRenderer.sendTo(from, toEmail, assetType, value, payPassword);
    console.log('sendWithAsset result:', result, 'msg:', msg);
    if (result) {
      setDialog({
        title: 'pay success',
        body: ['Your payment is processing, please check the transaction'],
        btnText: 'Close',
        open: true,
      });
    } else {
      setDialog({
        title: 'FAILURE',
        body: [`Your payment failed, error: ${msg}`],
        btnText: 'Close',
        open: true,
      });
    }
    setIsLoading(false);
    clearAddressMenu();
  };

  const handlePayPasswordCallback = async (payPassword: string) => {
    setPayPasswordOpen(false);
    setIsLoading(true);
    if (payPassword === '') {
      setIsLoading(false);
      return;
    }

    switch (assetType) {
      case 0:
        await payWithCurrency(address.value, otherEmail, currencyValue, payPassword);
        break;
      case 1:
      case 2:
        await sendWithAsset(address.value, otherEmail, asset.value, assetType, payPassword);
        break;
      default:
        break;
    }
    console.log('user clicks the pay now');
  };

  const handlePayNow = async () => {
    if (!checkValidAddress(address.value)) {
      setError({ address: true });
      console.error(`${address.value} is not valid address!`);
      return;
    }
    if (!validateEmail(otherEmail)) {
      setError({ email: true });
      console.error(`${otherEmail} is not valid email!`);
      return;
    }
    if (assetType === 0) {
      if (currencyValue <= 0) {
        setError({ currency: true });
        console.error(`${currencyValue} must be larger than 0!`);
        return;
      }
    } else if (assetType === 1) {
      if (!checkValidAsset(asset.value)) {
        setError({ ownership: true });
        console.error(`${asset.value} is not valid ownership id!`);
        return;
      }
    } else if (assetType === 2) {
      if (!checkValidAsset(asset.value)) {
        setError({ identity: true });
        console.error(`${asset.value} is not valid identity id!`);
        return;
      }
    }
    // clear error
    setError({});
    setPayPasswordOpen(true);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Typography variant="h4" component="h1" sx={{ textAlign: 'center', mb: '1rem', mt: '1rem' }}>
        Wallet Payment
      </Typography>
      <Grid container spacing={2} sx={{ mb: '1rem', mt: '1rem', padding: '0.3rem 1rem' }}>
        <Grid item xs={3}>
          <FormControl sx={{ m: 0, width: '100%' }} disabled>
            <InputLabel id="demo-simple-select-error-label1">{payType}</InputLabel>
            <Select
              labelId="Filters"
              id="filter-by-address"
              value={payType}
              label="Filters"
              onChange={handlePayTypeChange}
              sx={{ width: '100%' }}
            >
              <MenuItem value="from">Pay From</MenuItem>
              <MenuItem value="to">Pay To</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={7}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={addresses}
            sx={{ width: '100%' }}
            isOptionEqualToValue={(option: AutocompleteOption, value: AutocompleteOption) =>
              option.value === value.value
            }
            onInputChange={handleAddressChange}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.value)}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                {option.label}
              </Box>
            )}
            value={address}
            freeSolo
            renderInput={(params) => (
              <TextField
                {...params}
                label="Enter your address"
                error={!!error.address}
                helperText={error.address ? 'Invalid wallet address' : ''}
              />
            )}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: '1rem', mt: '1rem', padding: '0.3rem 1rem' }}>
        <Grid item xs={3}>
          <FormControl sx={{ m: 0, width: '100%' }} disabled>
            <InputLabel id="demo-simple-select-error-label2">{payType2}</InputLabel>
            <Select labelId="Filters2" id="filter-by-address" value={payType2} label="Filters" sx={{ width: '100%' }}>
              <MenuItem value="from">Pay From</MenuItem>
              <MenuItem value="to">Pay To</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={7}>
          <FormControl sx={{ m: 0, width: '100%' }}>
            <TextField
              id="email-textfield"
              label="Input receiver's email"
              variant="outlined"
              sx={{ width: '100%' }}
              value={otherEmail}
              onChange={handleEmailChange}
              error={!!error.email}
              helperText={error.email ? 'Invalid email' : ''}
            />
          </FormControl>
        </Grid>
        <Grid item xs={2} />
      </Grid>

      <Grid container spacing={2} sx={{ mb: '1rem', mt: '1rem', padding: '0.3rem 1rem' }}>
        <Grid item xs={3}>
          <FormControl sx={{ m: 0, width: '100%' }}>
            <InputLabel id="assetType">{assetTypes[assetType]}</InputLabel>
            <Select
              labelId="Filters"
              id="filter-by-address"
              value={assetType}
              label="Filters"
              onChange={handleAssetTypeChange}
              sx={{ width: '100%' }}
            >
              <MenuItem value={0}>CURRENCY</MenuItem>
              <MenuItem value={1}>OWNERSHIP</MenuItem>
              <MenuItem value={2}>IDENTITY</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={7}>
          {assetType === 0 && (
            <TextField
              id="asset-field"
              label="Enter vaue"
              variant="outlined"
              sx={{ width: '100%' }}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              value={currencyValue}
              onChange={handleValueChange}
              error={!!error.currency}
              helperText={error.currency ? 'currency value must be larger than 0!' : ''}
            />
          )}
          {assetType === 1 && (
            <Autocomplete
              disablePortal
              id="ownership-auto-complete"
              options={ownerships}
              value={asset}
              sx={{ width: '100%' }}
              freeSolo
              isOptionEqualToValue={(option: AutocompleteOption, value: AutocompleteOption) =>
                option.value === value.value
              }
              onInputChange={handleInputAssetChange}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.value)}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  {option.label}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Enter your ownership asset"
                  error={!!error.ownership}
                  helperText={error.ownership ? 'ownership id is invalid!' : ''}
                />
              )}
            />
          )}
          {assetType === 2 && (
            <Autocomplete
              disablePortal
              id="identity-auto-complete"
              options={identities}
              value={asset}
              sx={{ width: '100%' }}
              freeSolo
              isOptionEqualToValue={(option: AutocompleteOption, value: AutocompleteOption) =>
                option.value === value.value
              }
              onInputChange={handleInputAssetChange}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.value)}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  {option.label}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Enter your identity asset"
                  error={!!error.identity}
                  helperText={error.identity ? 'identity id is invalid!' : ''}
                />
              )}
            />
          )}
        </Grid>
        <Grid item xs={2} />
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
              startIcon={<PaymentIcon />}
              onClick={handlePayNow}
              sx={{
                py: '0.4rem',
                mt: 1,
                width: '228px',
                height: '60px',
                marginInline: 'auto',
              }}
            >
              Pay Now
            </LoadingButton>
          </Stack>
        </Grid>
        <CircleDialog
          open={!!dialog.open}
          title={dialog.title || ''}
          body={dialog.body || ''}
          btnText={dialog.btnText || ''}
          close={() => setDialog({ ...dialog, open: false })}
        />
      </Grid>
      <PayPasswordDialog initOpen={payPasswordOpen} callback={handlePayPasswordCallback} />
    </Paper>
  );
}
