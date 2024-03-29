import {
  Box,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSearchParams } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl, { useFormControl } from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';
import PaymentIcon from '@mui/icons-material/Payment';
import * as React from 'react';

import {
  AutocompleteOption,
  PublicWallet,
  WalletPackage,
  addressListOf,
  checkValidAddress,
  checkValidAsset,
  makeAssetLabel,
  makeWalletLabel,
  validateEmail
} from '../../common/wallet-types';
import CircleDialog from '../components/CircleDialog';
import { TxType } from '../../common/block-types';
import PayPasswordDialog from '../components/PayPasswordDialog';

const makeAddressOptionList = (addressList: string[]) => addressList.map((address, index) => ({
  label: makeWalletLabel(address, index),
  value: address,
}));

let addressList: string[] = [
  '1MVQfJrU3mK3M62hygJz9pmgBxVoGzPaKj',
  '12UdA785W3Y6M3SR8HxxExe7PRcwvVg88S',
  '1L8eRrBuWnBxcQ6DKCDkkPM7ozxDcmpho1',
];
let addresses: AutocompleteOption[] = makeAddressOptionList(addressList);

const makeAssetOptionList = (assetList: string[], type: string) => assetList.map((asset) => ({
  label: makeAssetLabel(asset, type),
  value: asset,
}));

let identityList: string[] = [
  '1MVQfJrU3mK3M62hygJz9pmgBxVoGzPaKj',
  '12UdA785W3Y6M3SR8HxxExe7PRcwvVg88S',
  '1L8eRrBuWnBxcQ6DKCDkkPM7ozxDcmpho1',
  '16rcESr6pm3x3PByQH6JEbJBzZkf5W5NQk',
  '1745rpVqjXSntEniXdFhvuRHNESoYpyynp',
  '1Jhf7pUtmqK2ZqR9du7xa6uL1Qxdc14atG',
];
let identities: AutocompleteOption[] = makeAssetOptionList(identityList, 'IDT');
let ownershipList: string[] = [
  '12cSSRmfLMH8s5MrxeEdtgbKWnk28Si6cr',
  '1APGzvGwcDKWDobEEDiHtEehVz4G4jWeoR',
  '1HDv7a7PqbYugZjaVJtMxvsnvpk7GS554s',
  '1EnfGqqXhUgo2fU63JMxJf7jgM1cSQULKg',
  '1N7Y3QdRjm8KVEi2e2ejPjriAskHcxLFJu',
  '14hF1BynFVnBEFKxyo51FHmJksVwfxg4sg',
  '1NMhhRzQtyhocMa31kB5hhtXy2fRPy2rn',
];
let ownerships: AutocompleteOption[] = makeAssetOptionList(ownershipList, 'OWN');

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

export default function WalletPayment() {
  const [payType, setPayType] = React.useState('from');
  const [payType2, setPayType2] = React.useState('to');
  const [otherEmail, setOtherEmail] = React.useState('');
  const [address, setAddress] = React.useState<AutocompleteOption>({ label: "", value: "" });
  const [assetType, setAssetType] = React.useState(0);
  const [currencyValue, setCurrencyValue] = React.useState(0);
  const [asset, setAsset] = React.useState<AutocompleteOption>({ label: "", value: "" });
  const [walletPackage, setWalletPackage] = React.useState<WalletPackage | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<MyError>({} as MyError);
  const [dialog, setDialog] = React.useState<MyDialog>({} as MyDialog);
  const [payPasswordOpen, setPayPasswordOpen] = React.useState<boolean>(false);
  const [queryParameters] = useSearchParams();

  const selectWallet = (walletPackage: WalletPackage, addr: string) => {
    const wallet = walletPackage.wallets.find((w: PublicWallet) => w.address === addr);
    if (!wallet) {
      return;
    }

    identityList = wallet.identities.map((item) => item.uuid);
    console.log("identityList:", identityList);
    identities = makeAssetOptionList(identityList, 'IDT');

    ownershipList = wallet.ownerships.map((item) => item.uuid);
    ownerships = makeAssetOptionList(ownershipList, 'OWN');
  }

  React.useEffect(() => {
    window.electron.ipcRenderer.getWalletPackage('').then((result: WalletPackage) => {
      console.log("wallet-payment walletPackage:", result);
      setWalletPackage(result);
      const addr = queryParameters.get('address');
      addressList = addressListOf(result);
      if (addr && checkValidAddress(addr)) {
        if (addressList.includes(addr)) {
          const address: AutocompleteOption = addresses.find((item) => item.value === addr)!;
          setAddress(address);
          selectWallet(result, addr);
        }
      }

      addresses = makeAddressOptionList(addressList);
    });
  }, [queryParameters, setAddress]);

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
    setAsset({ label: "", value: "" });
    setCurrencyValue(0);
  };

  const clearAddressMenu = () => {
    setAddress({ label: "", value: "" });
    setOtherEmail("");
    clearSubAddressMenu();
  };

  const handleAddressChange = (
    event: React.SyntheticEvent,
    value: string,
    reason: string
  ) => {
    console.log('input value:', value, 'reason:', reason);
    if (!value) {
      clearAddressMenu();
      return;
    }
    if (checkValidAddress(value)) {
      if (addressList.includes(value)) {
        const address = addresses.find((item) => item.value === value)!
        console.log("selected address:", address);
        setAddress(address);
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

  const handleAssetTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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
  }

  const handleInputAssetChange = (
    event: React.SyntheticEvent,
    value: string,
    reason: string
  ) => {
    console.log('input value:', value, 'reason:', reason);
    if (!value) {
      setAsset({ label: "", value: "" });
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
    console.log("payWithCurrency result:", result, "msg:", msg);
    if (result) {
      setDialog({
        title: "SUCCESS",
        body: ["Your payment is processing, please check the transaction"],
        btnText: "Close",
        open: true,
      });
    } else {
      setDialog({
        title: "FAILURE",
        body: [`Your payment failed, error: ${msg}`],
        btnText: "Close",
        open: true,
      });
    }
    setIsLoading(false);
    clearAddressMenu();
  };

  const sendWithAsset = async (from: string, toEmail: string, value: string, assetType: TxType, payPassword: string) => {
    const [result, msg] = await window.electron.ipcRenderer.sendTo(from, toEmail, assetType, value, payPassword);
    console.log("sendWithAsset result:", result, "msg:", msg);
    if (result) {
      setDialog({
        title: "pay success",
        body: ["Your payment is processing, please check the transaction"],
        btnText: "Close",
        open: true,
      });
    } else {
      setDialog({
        title: "FAILURE",
        body: [`Your payment failed, error: ${msg}`],
        btnText: "Close",
        open: true,
      });
    }
    setIsLoading(false);
    clearAddressMenu();
  };

  const handlePayPasswordCallback = async (payPassword: string) => {
    setPayPasswordOpen(false);
    setIsLoading(true);
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
    console.log("user clicks the pay now");
  };

  const handlePayNow = async () => {
    if (!checkValidAddress(address.value)) {
      setError({ address: true });
      console.error(`${address.value} is not valid address!`);
      return;
    }
    if (!validateEmail(otherEmail)) {
      setError({ email: true});
      console.error(`${otherEmail} is not valid email!`);
      return;
    }
    if (assetType === 0) {
      if (currencyValue <= 0) {
        setError({ currency: true});
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
      <Typography
        variant="h6"
        component="h1"
        sx={{ textAlign: 'center', mb: '1rem', mt: '1rem' }}
      >
        Wallet Payment
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{ mb: '1rem', mt: '1rem', padding: '0.3rem 1rem' }}
      >
        <Grid item xs={3}>
          <FormControl sx={{ m: 0, width: '100%' }} disabled>
            <InputLabel id="demo-simple-select-error-label1">
              {payType}
            </InputLabel>
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
            isOptionEqualToValue={(
              option: AutocompleteOption,
              value: AutocompleteOption
            ) => option.value === value.value}
            onInputChange={handleAddressChange}
            getOptionLabel={(option) => typeof (option) === "string" ? option : option.value}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                {option.label}
              </Box>
            )}
            value={address}
            freeSolo
            renderInput={(params) => (
              <TextField {...params} label="Enter your address"
                error={!!error.address}
                helperText={ error.address ? "Invalid wallet address" : "" }
              />
            )}
          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2}
        sx={{ mb: '1rem', mt: '1rem', padding: '0.3rem 1rem' }}
      >
        <Grid item xs={3}>
          <FormControl sx={{ m: 0, width: '100%' }} disabled>
            <InputLabel id="demo-simple-select-error-label2">
              {payType2}
            </InputLabel>
            <Select
              labelId="Filters2"
              id="filter-by-address"
              value={payType2}
              label="Filters"
              sx={{ width: '100%' }}
            >
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
              helperText={ error.email ? "Invalid email" : "" }
            />
          </FormControl>
        </Grid>
        <Grid item xs={2}>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2}
        sx={{ mb: '1rem', mt: '1rem', padding: '0.3rem 1rem' }}
      >
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
              helperText={ error.currency ? "currency value must be larger than 0!" : "" }
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
              isOptionEqualToValue={(
                option: AutocompleteOption,
                value: AutocompleteOption
              ) => option.value === value.value}
              onInputChange={handleInputAssetChange}
              getOptionLabel={(option) => typeof (option) === "string" ? option : option.value}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  {option.label}
                </Box>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Enter your ownership asset"
                  error={!!error.ownership}
                  helperText={ error.ownership ? "ownership id is invalid!" : "" }
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
              isOptionEqualToValue={(
                option: AutocompleteOption,
                value: AutocompleteOption
              ) => option.value === value.value}
              onInputChange={handleInputAssetChange}
              getOptionLabel={(option) => typeof(option) === "string" ? option : option.value}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  {option.label}
                </Box>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Enter your identity asset"
                  error={!!error.identity}
                  helperText={ error.identity ? "identity id is invalid!" : "" }
                />
              )}
            />
          )}
        </Grid>
        <Grid item xs={2}>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        sx={{ mb: '1rem', mt: '1rem', padding: '0.3rem 1rem' }}
      >
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
          title={dialog.title || ""}
          body={dialog.body || ""}
          btnText={dialog.btnText || ""}
          close={() => setDialog({ ...dialog, open: false })}
        />
      </Grid>
      <PayPasswordDialog initOpen={payPasswordOpen} callback={handlePayPasswordCallback} />
    </Paper>
  );
}
