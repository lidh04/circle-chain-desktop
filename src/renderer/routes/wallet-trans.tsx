import { makeAssetLabel } from '../../common/wallet-types';

import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import { useSearchParams } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';
import * as React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import {
  AddressType,
  AutocompleteOption,
  PublicWallet,
  WalletPackage,
  checkValidAddress,
  makeWalletLabel,
} from '../../common/wallet-types';

const Note = styled('div')(({ theme }) => ({
  ...theme.typography.body1,
  // backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
  textAlign: 'center',
  fontSize: '13px',
  margin: '10px 5px',
}));

interface Column {
  id: 'from' | 'to' | 'trans' | 'timestamp';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'from', label: 'From', minWidth: 150 },
  { id: 'to', label: 'To', minWidth: 150 },
  {
    id: 'trans',
    label: 'Trans',
    minWidth: 100,
    align: 'right',
  },
  {
    id: 'timestamp',
    label: 'Timestamp',
    minWidth: 120,
    align: 'right',
  },
];

const types: AutocompleteOption[] = [
  { label: 'CRY', value: 'CRY' },
  { label: 'IDT', value: 'IDT' },
  { label: 'OWN', value: 'OWN' },
];

interface Data {
  from: string;
  to: string;
  trans: string;
  timestamp: string;
}

export default function WalletTrans() {
  const [page, setPage] = React.useState(0);
  const [filter, setFilter] = React.useState('from');
  const [input, setInput] = React.useState<AutocompleteOption>({
    label: '',
    value: '',
  });
  const [searchedData, setSearchedData] = React.useState<Data[] | null>(null);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [addressList, setAddressList] = React.useState<string[]>(
    [] as string[]
  );
  const [addresses, setAddresses] = React.useState<AutocompleteOption[]>(
    [] as AutocompleteOption[]
  );
    const [uuids, setUuids] = React.useState<AutocompleteOption[]>([] as AutocompleteOption[]);
    const [queryParameters] = useSearchParams();

  React.useEffect(() => {
    let addr = queryParameters.get('address') || "";
    if (addr && !checkValidAddress(addr)) {
      addr = '';
    }
    window.electron.ipcRenderer
      .searchTransaction(addr, filter as AddressType)
      .then((result) => {
        setSearchedData(result);
      });
  }, [queryParameters, setSearchedData, filter]);

  React.useEffect(() => {
    window.electron.ipcRenderer
      .getWalletPackage('')
      .then((result: WalletPackage) => {
        console.log('wallet-trans walletPackage:', result);
        const addr = queryParameters.get('address');
        const addressList = result.wallets.map((w: PublicWallet) => w.address);
        if (addr && checkValidAddress(addr)) {
          if (!addressList.includes(addr)) {
            addressList.push(addr);
            setInput({
              label: makeWalletLabel(addr, addressList.length - 1),
              value: addr,
            });
          } else {
            const index = addressList.indexOf(addr);
            setInput({ label: makeWalletLabel(addr, index), value: addr });
          }
        }
        setAddressList(addressList);

        const allUuids = result.wallets.flatMap((w: PublicWallet) => {
          const idts = (w.identities || []).map((idt) => ({ asset: idt.uuid, type: "IDT" }));
          const owns = (w.ownerships || []).map((own) => ({ asset: own.uuid, type: "OWN" }));
          return [...idts, ...owns];
        });
        const uuids = allUuids.map((item: { asset: string, type: string}) => ({
          label: makeAssetLabel(item.asset, item.type),
          value: item.asset,
        }));
        setUuids(uuids);

        setAddresses(
          addressList.map((addr, index) => ({
            label: makeWalletLabel(addr, index),
            value: addr,
          }))
        );
      });
  }, [queryParameters, setInput, setAddressList, setAddresses]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event;
    console.log('selected target vaule:', value);
    setFilter(value);
    setInput({ label: '', value: '' });
  };

  const handleInputChange = (
    event: React.SyntheticEvent,
    value: string,
    reason: string
  ) => {
    console.log('input value:', value, 'reason:', reason, 'filter:', filter);
    if (!value) {
      setInput({ label: '', value: '' });
      return;
    }

    if (filter === 'from' || filter === 'to') {
      if (!checkValidAddress(value)) {
        return;
      }
      if (addressList.includes(value)) {
        const index = addressList.indexOf(value);
        setInput({ label: makeWalletLabel(value, index), value });
      } else {
        addressList.push(value);
        setInput({
          label: makeWalletLabel(value, addressList.length - 1),
          value,
        });
      }
    } else if (filter === 'type') {
      setInput({ label: value, value });
    } else if (filter === 'uuid') {
      setInput({ label: value, value });
    }
  };

  const handleSearch = async () => {
    console.log(
      'use click search button, search by input:',
      input,
      'filter:',
      filter
    );
    if (filter === 'from' || filter === 'to') {
      const rows = await window.electron.ipcRenderer.searchTransaction(
        input.value,
        filter as AddressType
      );
      console.info(
        `search address: ${input.value}, type: ${filter}, transactions:`,
        rows
      );
      setSearchedData(rows);
    } else if (filter === 'type') {
      let txType = input.value === 'CRY' ? 0 : 1;
      if (input.value === 'IDT') {
        txType = 2;
      }
      const rows = await window.electron.ipcRenderer.searchTransaction(
        '',
        'from',
        txType
      );
      setSearchedData(rows);
    } else if (filter === 'uuid') {
      const rows = await window.electron.ipcRenderer.searchTransaction(
        '',
        'from',
        undefined,
        input.value
      );
      setSearchedData(rows);
    }
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Typography
        variant="h6"
        component="h1"
        sx={{ textAlign: 'center', mb: '1rem', mt: '1rem' }}
      >
        Wallet Transactions
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{ mb: '1rem', mt: '1rem', padding: '0.3rem 1rem' }}
      >
        <Grid item xs={3}>
          <FormControl sx={{ m: 0, width: '100%' }}>
            <InputLabel id="assetType">{filter}</InputLabel>
            <Select
              labelId="Filters"
              id="filter-by-address"
              value={filter}
              label="Filters"
              onChange={handleSelectChange}
              sx={{ width: '100%' }}
            >
              <MenuItem value="from">Search by From</MenuItem>
              <MenuItem value="to">Search by To</MenuItem>
              <MenuItem value="type">Search by Type</MenuItem>
              <MenuItem value="uuid">Search by AssetId</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={7}>
          {filter === 'type' && (
            <Autocomplete
              disablePortal
              id="type-auto-complete"
              options={types}
              sx={{ width: '100%' }}
              isOptionEqualToValue={(
                option: AutocompleteOption,
                value: AutocompleteOption
              ) => option.value === value.value}
              onInputChange={handleInputChange}
              renderInput={(params) => (
                <TextField {...params} label="Enter type" />
              )}
            />
          )}
          {(filter === 'from' || filter === 'to') && (
            <Autocomplete
              disablePortal
              id="address-box-demo"
              options={addresses}
              value={input}
              sx={{ width: '100%' }}
              freeSolo
              isOptionEqualToValue={(
                option: AutocompleteOption,
                value: AutocompleteOption
              ) => option.value === value.value}
              onInputChange={handleInputChange}
              getOptionLabel={(option) => typeof (option) === "string" ? option : option.value}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  {option.label}
                </Box>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Enter wallet address" />
              )}
            />
          )}
          {filter === 'uuid' && (
            <Autocomplete
              disablePortal
              id="uuid-box-demo"
              options={uuids}
              value={input}
              sx={{ width: '100%' }}
              freeSolo
              isOptionEqualToValue={(
                option: AutocompleteOption,
                value: AutocompleteOption
              ) => option.value === value.value}
              onInputChange={handleInputChange}
              getOptionLabel={(option) => typeof (option) === "string" ? option : option.value}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  {option.label}
                </Box>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Enter uuid" />
              )}
            />
          )}
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            color="primary"
            onClick={handleSearch}
            sx={{ width: '100%', height: '100%', maxWidth: '180px' }}
          >
            Search
          </Button>
        </Grid>
      </Grid>

      <TableContainer sx={{ maxHeight: 540 }}>
        <Note>
          CRY: stands for currency value of the transaction; IDT: stands for
          identity id of the transaction; OWN: stands for owership id of the
          transaction.
        </Note>
        <Table stickyHeader aria-label="transaction table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {searchedData &&
              searchedData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={`${row.from}-${row.to}`}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={searchedData ? searchedData.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
