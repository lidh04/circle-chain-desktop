import { Box, Button, Grid, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import { blue } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import PaymentIcon from '@mui/icons-material/Payment';
import * as React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RunCircleIcon from '@mui/icons-material/RunCircle';
import QRCode from 'qrcode';

import Divider from '@mui/material/Divider';
import {
  AutocompleteOption,
  makeWalletLabel,
  PrivatePoem,
  PublicWallet,
  WalletPackage
} from '../../common/wallet-types';
import CircleDialog from '../components/CircleDialog';

interface Column {
  id: 'address' | 'balance' | 'identity' | 'ownership' | 'operation' | 'keywords';
  label: string;
  minWidth?: number;
  align?: 'right';
}

interface OperationsDialogProps {
  open: boolean;
  onClose: (value?: string) => void;
}

interface AddressDialogProps {
  open: boolean;
  onClose: (value?: string) => void;
  address: string;
}

const columns: readonly Column[] = [
  { id: 'address', label: 'Address', minWidth: 150 },
  { id: 'balance', label: 'Balance', minWidth: 60 },
  { id: 'unconfirmed', label: 'unconfirmed', minWidth: 60 },
  {
    id: 'identity',
    label: 'Identity',
    minWidth: 60,
    align: 'right',
  },
  {
    id: 'ownership',
    label: 'Ownership',
    minWidth: 60,
    align: 'right',
  },
  {
    id: 'operation',
    label: 'Operation',
    minWidth: 100,
    align: 'right',
  },
  {
    id: 'keywords',
    label: 'Keywords',
    minWidth: 100,
    align: 'right',
  },
];

interface Data {
  address: string;
  balance: number;
  unconfirmed: number;
  identity: number;
  ownership: number;
  operation: string;
  keywords: string;
}

function createData(address: string, balance: number, unconfirmed: number, identity: number, ownership: number): Data {
  return {
    address,
    balance,
    unconfirmed,
    identity,
    ownership,
    operation: address,
    keywords: address,
  };
}

function OperationsDialog(props: OperationsDialogProps) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose('');
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Operations on address</DialogTitle>
      <List sx={{ pt: 0 }}>
        <ListItem disableGutters>
          <ListItemButton key="searchByAddress" onClick={() => handleListItemClick('searchByAddress')}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                <SearchIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Search by address" />
          </ListItemButton>
        </ListItem>

        <ListItem disableGutters>
          <ListItemButton key="payWithAddress" onClick={() => handleListItemClick('payWithAddress')}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                <PaymentIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Pay with address" />
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  );
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme: any) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

async function generateQRcode(address: string): Promise<string> {
  if (!address) {
    return '';
  }

  const svg = await QRCode.toString(address, { type: 'svg' });
  // console.log("svg:", svg);
  return svg;
}

function AddressDialog(props: AddressDialogProps) {
  const [poem, setPoem] = React.useState<PrivatePoem | null>(null);
  const [svg, setSvg] = React.useState<string>('');
  const { onClose, open, address } = props;

  React.useEffect(() => {
    window.electron.ipcRenderer.getEncodedPrivateKey(address).then((r) => {
      setPoem(r);
    });
    generateQRcode(address).then((svg) => setSvg(svg));
  }, [address, setPoem]);

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Address Keywords
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            mt={2}
            spacing={2}
            sx={{ width: '100%', height: 'auto' }}
          >
            {poem && (
              <Typography
                sx={{
                  fontSize: '1.5rem',
                  mb: '0',
                  mt: '0',
                  height: 'auto',
                  textAlign: 'center',
                }}
              >
                {poem.title}
              </Typography>
            )}
            {poem &&
              poem.sentences.map((sen) => (
                <Typography
                  key={sen}
                  sx={{
                    fontSize: '1rem',
                    mb: '0',
                    mt: '0',
                    height: 'auto',
                    textAlign: 'center',
                  }}
                >
                  {sen}
                </Typography>
              ))}

            <Typography gutterBottom>Address QrCode:</Typography>
            <Box
              component="div"
              sx={{
                height: 180,
                width: 180,
              }}
            >
              <div className="Container" dangerouslySetInnerHTML={{ __html: svg }} />
            </Box>
            <Typography sx={{ fontSize: '12px' }}>address: {address}</Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}

export default function WalletInfo() {
  const [page, setPage] = React.useState(0);
  const [searchedRows, setSearchedRows] = React.useState<Data[] | null>(null);
  const [rows, setRows] = React.useState<Data[] | null>(null);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [address, setAddress] = React.useState('');
  const [newKeywords, setNewKeyworkds] = React.useState('');
  const [importError, setImportError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [openKeywords, setOpenKeywords] = React.useState(false);
  const [openImportSuccess, setOpenImportSuccess] = React.useState(false);
  const [addresses, setAddresses] = React.useState([] as AutocompleteOption[]);
  const [allBalance, setAllBalance] = React.useState(0);
  const [identityCnt, setIdentityCnt] = React.useState(0);
  const [ownershipCnt, setOwnershipCnt] = React.useState(0);
  const [walletCnt, setWalletCnt] = React.useState(0);

  const navigate = useNavigate();

  React.useEffect(() => {
    window.electron.ipcRenderer.getWalletPackage('').then((result: WalletPackage) => {
      console.log('wallet-info walletPackage:', result);
      const totalRows = result.wallets.map((wallet: PublicWallet) =>
        createData(
          wallet.address,
          wallet.balance,
          wallet.unconfirmed,
          wallet.identities.length,
          wallet.ownerships.length
        )
      );
      const balanceTotal = result.wallets
        .map((wallet) => wallet.balance + wallet.unconfirmed)
        .reduce((total, balance) => total + balance, 0);
      setAllBalance(balanceTotal);
      const identityTotal = result.wallets
        .map((wallet) => wallet.identities.length)
        .reduce((total, identity) => total + identity, 0);
      setIdentityCnt(identityTotal);
      const ownershipsTotal = result.wallets
        .map((wallet) => wallet.ownerships.length)
        .reduce((total, ownership) => total + ownership, 0);
      setOwnershipCnt(ownershipsTotal);
      setWalletCnt(result.wallets.length);
      setSearchedRows(totalRows);
      setRows(totalRows);
      setAddresses(
        totalRows.map((row, index) => ({
          value: row.address,
          label: makeWalletLabel(row.address, index),
        }))
      );
    });
  }, [setAllBalance, setOwnershipCnt, setIdentityCnt, setSearchedRows, setRows, setAddresses]);

  const handleDialogClose = (value?: string) => {
    setOpen(false);
    if (value === 'searchByAddress') {
      navigate(`/wallet-trans?address=${address}`);
    } else if (value === 'payWithAddress') {
      navigate(`/wallet-payment?address=${address}`);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangeKeyWords = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    console.log('keywords:', value);
    setNewKeyworkds(value);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    console.log('selected target vaule:', value);
  };

  const handleAddressChange = (event: React.SyntheticEvent, value: string, reason: string) => {
    console.log('input value:', value, 'reason:', reason);
    setAddress(value);
  };

  const handleSearch = async () => {
    console.log('use click search button, search by address:', address);
    if (address) {
      const findRows = (rows || []).filter((row) => row.address === address);
      setSearchedRows(findRows);
    } else {
      setSearchedRows(rows);
    }
  };

  const handleImport = async () => {
    if (!newKeywords) {
      console.error('please input new keywords');
      return;
    }
    try {
      const [address, _] = await window.electron.ipcRenderer.importWallet(newKeywords);
      setImportError(false);
      setErrorMessage('');
      setNewKeyworkds('');
      setOpenImportSuccess(true);
      console.log('import address:', address, 'success!');
    } catch (err: any) {
      console.error('cannot import wallet by keywords:', newKeywords, 'error:', err.message, err);
      setImportError(true);
      setErrorMessage(err.message);
    }
  };

  const showKeywords = (addr: string) => {
    console.log('click address for keywords:', addr);
    setAddress(addr);
    setOpenKeywords(true);
  };

  const handleAddressDialogClose = () => {
    setOpenKeywords(false);
  };

  const openTrans = (addr: string) => {
    console.log('click address for trans:', addr);
    setAddress(addr);
    setOpen(true);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Typography variant="h4" component="h1" sx={{ textAlign: 'center', mb: '1rem', mt: '1rem' }}>
        Wallet Information
      </Typography>
      <Grid container spacing={2} sx={{ mb: '2rem', mt: '1rem', padding: '0.3rem 1rem' }}>
        <Grid item xs={2}>
          <Typography variant="h6" component="h2" sx={{ textAlign: 'right', mb: '0.5rem', mt: '0.5rem' }}>
            Balance
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="h6" component="h2" sx={{ textAlign: 'left', mb: '0.5rem', mt: '0.5rem' }}>
            {allBalance} LI
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="h6" component="h2" sx={{ textAlign: 'right', mb: '0.5rem', mt: '0.5rem' }}>
            Ownerships
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="h6" component="h2" sx={{ textAlign: 'left', mb: '0.5rem', mt: '0.5rem' }}>
            {ownershipCnt}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="h6" component="h2" sx={{ textAlign: 'right', mb: '0.5rem', mt: '0.5rem' }}>
            Identities
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="h6" component="h2" sx={{ textAlign: 'left', mb: '0.5rem', mt: '0.5rem' }}>
            {identityCnt}
          </Typography>
        </Grid>

        <Grid item xs={2}>
          <Typography variant="h6" component="h2" sx={{ textAlign: 'right', mb: '0.5rem', mt: '0.5rem' }}>
            Wallets
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h6" component="h2" sx={{ textAlign: 'left', mb: '0.5rem', mt: '0.5rem' }}>
            {walletCnt}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            onClick={() => {
              navigate('/create-wallet');
            }}
            startIcon={<AddCircleIcon />}
          >
            Create wallet
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            onClick={() => {
              navigate('/mine-block');
            }}
            startIcon={<RunCircleIcon />}
          >
            Mine Block
          </Button>
        </Grid>
      </Grid>
      <Divider />
      <Grid container spacing={2} sx={{ mb: '1rem', mt: '1rem', padding: '0.3rem 1rem' }}>
        <Grid item xs={3}>
          <FormControl sx={{ m: 0, width: '100%' }}>
            <InputLabel id="addressInputlabel">address</InputLabel>
            <Select
              labelId="Filters"
              id="filter-by-address"
              value="address"
              label="Filters"
              onChange={handleSelectChange}
              sx={{ width: '100%' }}
            >
              <MenuItem value="address">Search by wallet</MenuItem>
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
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.value)}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                {option.label}
              </Box>
            )}
            onInputChange={handleAddressChange}
            renderInput={(params) => <TextField {...params} label="Enter your wallet address" />}
          />
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
      <TableContainer sx={{ maxHeight: 420 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {searchedRows &&
              searchedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.address}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === 'keywords' ? (
                            <Button variant="text" onClick={() => showKeywords(value as string)}>
                              Show
                            </Button>
                          ) : column.id === 'operation' ? (
                            <Button variant="text" onClick={() => openTrans(value as string)}>
                              Open
                            </Button>
                          ) : (
                            value
                          )}
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
        count={(rows || []).length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Divider />

      <Grid container spacing={2} sx={{ mb: '1rem', mt: '1rem', padding: '0.3rem 1rem' }}>
        <Grid item xs={2}>
          <Typography variant="subtitle1" component="h6">
            Address keywords:
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <TextareaAutosize
            aria-label="keywords"
            minRows={3}
            value={newKeywords}
            placeholder="Please paste address keyworkds here."
            onChange={handleChangeKeyWords}
            style={{ width: '100%', height: 50 }}
          />
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            startIcon={<ImportExportIcon />}
            color="primary"
            onClick={handleImport}
            sx={{ width: '100%', maxWidth: '180px', height: 50 }}
          >
            Import
          </Button>
        </Grid>
      </Grid>
      {importError && (
        <Grid container spacing={2} sx={{ padding: '0.3rem 1rem', margin: '1rem auto', width: '100%' }}>
          <Alert severity="error">import wallet error: {errorMessage}</Alert>
        </Grid>
      )}
      <CircleDialog
        open={openImportSuccess}
        title="Import Success!"
        body={['Congrats!', 'Import the new wallet success!']}
        btnText="Close"
        close={() => setOpenImportSuccess(false)}
      />
      <OperationsDialog open={open} onClose={handleDialogClose} />
      <AddressDialog open={openKeywords} onClose={handleAddressDialogClose} address={address} />
    </Paper>
  );
}
