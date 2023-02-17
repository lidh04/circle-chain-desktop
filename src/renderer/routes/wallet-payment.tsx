import {
  Box,
  Button,
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
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';
import PaymentIcon from '@mui/icons-material/Payment';
import * as React from 'react';
import SearchIcon from '@mui/icons-material/Search';

import {
  AutocompleteOption,
  checkValidAddress,
  makeAssetLabel,
  makeWalletLabel
} from '../../common/wallet-types';

const addressList = [
  '1MVQfJrU3mK3M62hygJz9pmgBxVoGzPaKj',
  '12UdA785W3Y6M3SR8HxxExe7PRcwvVg88S',
  '1L8eRrBuWnBxcQ6DKCDkkPM7ozxDcmpho1',
];
const addresses: AutocompleteOption = addressList.map((address, index) => ({
  label: makeWalletLabel(address, index),
  value: address,
}));
const identityList = [
  '1MVQfJrU3mK3M62hygJz9pmgBxVoGzPaKj',
  '12UdA785W3Y6M3SR8HxxExe7PRcwvVg88S',
  '1L8eRrBuWnBxcQ6DKCDkkPM7ozxDcmpho1',
  '16rcESr6pm3x3PByQH6JEbJBzZkf5W5NQk',
  '1745rpVqjXSntEniXdFhvuRHNESoYpyynp',
  '1Jhf7pUtmqK2ZqR9du7xa6uL1Qxdc14atG',
];
const identities: AutocompleteOption[] = identityList.map((identity) => ({
  label: makeAssetLabel(identity, 'IDT'),
  value: identity,
}));
const ownershipList = [
  '12cSSRmfLMH8s5MrxeEdtgbKWnk28Si6cr',
  '1APGzvGwcDKWDobEEDiHtEehVz4G4jWeoR',
  '1HDv7a7PqbYugZjaVJtMxvsnvpk7GS554s',
  '1EnfGqqXhUgo2fU63JMxJf7jgM1cSQULKg',
  '1N7Y3QdRjm8KVEi2e2ejPjriAskHcxLFJu',
  '14hF1BynFVnBEFKxyo51FHmJksVwfxg4sg',
  '1NMhhRzQtyhocMa31kB5hhtXy2fRPy2rn',
];
const ownerships: AutocompleteOption[] = ownershipList.map((ownership) => ({
  label: makeAssetLabel(ownership, "OWN"),
  value: ownership,
}));

const assetTypes = ['CRY', 'OWN', 'IDT'];

export default function WalletPayment() {
  const [payType, setPayType] = React.useState('from');
  const [payType2, setPayType2] = React.useState('to');
  const [otherEmail, setOtherEmail] = React.useState('');
  const [address, setAddress] = React.useState<AutocompleteOption>({ label: "", value: "" });
  const [assetType, setAssetType] = React.useState(0);
  const [currencyValue, setCurrencyValue] = React.useState(0);
  const [asset, setAsset] = React.useState('');
  const [queryParameters] = useSearchParams();

  React.useEffect(() => {
    const addr = queryParameters.get('address');
    if (checkValidAddress(addr)) {
      if (!addressList.includes(addr)) {
        addressList.push(addr);
        addresses.push({ label: makeWalletLabel(addr, addressList.length-1), value: addr });
      }
      const address: AutocompleteOption = addresses.find((item) => item.value === addr) || { label: "", value: "" };
      setAddress(address);
    }
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

  const handleAddressChange = (
    event: React.SyntheticEvent,
    value: string,
    reason: string
  ) => {
    console.log('input value:', value, 'reason:', reason);
    if (!value) {
      setAddress({ label: "", value: "" });
      return;
    }
    if (checkValidAddress(value)) {
      if (!addressList.includes(value)) {
        addressList.push(value);
        const newAddress = { label: makeWalletLabel(value, addressList.length-1), value }
        addresses.push(newAddress);
        setAddress(newAddress);
      }
    } else {
      const address = addresses.find((item) => item.value === value) || { label: "", value: "" };
      setAddress(address);
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
  };

  const handleInputAssetChange = (
    event: React.SyntheticEvent,
    value: string,
    reason: string
  ) => {
    console.log('input value:', value, 'reason:', reason);
    setAsset(value);
  };

  const handlePayNow = () => {
    console.log("user clicks the pay now");
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
            getOptionLabel={(option: AutocompleteOption) => option.value}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                {option.label}
              </Box>
            )}
            value={address}
            freeSolo
            renderInput={(params) => (
              <TextField {...params} label="Enter your address" />
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
          <TextField
            id="address-textfield"
            label="Input other's email"
            variant="outlined"
            sx={{ width: '100%' }}
            value={otherEmail}
            onChange={handleEmailChange}
          />
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
              onChange={handleValueChange}
            />
          )}
          {assetType === 1 && (
            <Autocomplete
              disablePortal
              id="ownership-auto-complete"
              options={ownerships}
              sx={{ width: '100%' }}
              isOptionEqualToValue={(
                option: AutocompleteOption,
                value: AutocompleteOption
              ) => option.value === value.value}
              onInputChange={handleInputAssetChange}
              getOptionLabel={(option: AutocompleteOption) => option.value}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  {option.label}
                </Box>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Enter your ownership asset" />
              )}
            />
          )}
          {assetType === 2 && (
            <Autocomplete
              disablePortal
              id="identity-auto-complete"
              options={identities}
              sx={{ width: '100%' }}
              isOptionEqualToValue={(
                option: AutocompleteOption,
                value: AutocompleteOption
              ) => option.value === value.value}
              onInputChange={handleInputAssetChange}
              getOptionLabel={(option: AutocompleteOption) => option.value}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  {option.label}
                </Box>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Enter your identity asset" />
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
              loading={false}
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
      </Grid>
    </Paper>
  );
}
