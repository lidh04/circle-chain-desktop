import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { blue } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import Autocomplete from '@mui/material/Autocomplete';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Avatar from '@mui/material/Avatar';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
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
  identity: number;
  ownership: number;
  operation: string;
  keywords: string;
}

function createData(
  address: string,
  balance: number,
  identity: number,
  ownership: number,
): Data {
  return {
    address,
    balance,
    identity,
    ownership,
    operation: address,
    keywords: address,
  };
}

const rows = [
  createData('1MVQfJrU3mK3M62hygJz9pmgBxVoGzPaKj', 100, 0, 0),
  createData('12UdA785W3Y6M3SR8HxxExe7PRcwvVg88S', 100, 1, 2),
  createData('1L8eRrBuWnBxcQ6DKCDkkPM7ozxDcmpho1', 200, 1, 3),
  createData('16rcESr6pm3x3PByQH6JEbJBzZkf5W5NQk', 321, 3, 98),
  createData('1745rpVqjXSntEniXdFhvuRHNESoYpyynp', 322, 37, 99),
  createData('1Jhf7pUtmqK2ZqR9du7xa6uL1Qxdc14atG', 343, 254, 76),
  createData('1rmzxfP5J1QjYXMa9zmSC7dCBLTDciBda', 300, 83, 35),
  createData('12vU588JA4zGMA7gKDRuu3HGLrr3BxhkBt', 2000, 48, 70),
  createData('12cSSRmfLMH8s5MrxeEdtgbKWnk28Si6cr', 43000, 126, 197),
  createData('1APGzvGwcDKWDobEEDiHtEehVz4G4jWeoR', 4000, 126, 37),
  createData('1HDv7a7PqbYugZjaVJtMxvsnvpk7GS554s', 5000, 67, 64),
  createData('1EnfGqqXhUgo2fU63JMxJf7jgM1cSQULKg', 6000, 67, 242),
  createData('1N7Y3QdRjm8KVEi2e2ejPjriAskHcxLFJu', 8000, 146, 170),
  createData('14hF1BynFVnBEFKxyo51FHmJksVwfxg4sg', 5000, 200, 923),
  createData('1NMhhRzQtyhocMa31kB5hhtXy2fRPy2rn', 3900, 210, 851),
];

interface AutocompleteOption {
  label: string;
}

const addresses: AutocompleteOption[] = rows.map((row) => ({
  label: row.address,
}));

function OperationsDialog(props: OperationsDialogProps) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose("");
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Operations on address</DialogTitle>
      <List sx={{ pt: 0 }}>
        <ListItem disableGutters>
          <ListItemButton
            key="searchByAddress"
            onClick={() => handleListItemClick('searchByAddress')}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                <SearchIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Search by address" />
          </ListItemButton>
        </ListItem>

        <ListItem disableGutters>
          <ListItemButton
            key="payWithAddress"
            onClick={() => handleListItemClick('payWithAddress')}
          >
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

function AddressDialog(props: AddressDialogProps) {
  const { onClose, open, address } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
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
            sx={{ width: "100%", height: "auto" }}
          >
            <Typography gutterBottom>
              {"「申即静」"}<br/>
              {"竞味聚识咸，"}<br/>
              {"嚷气鞭兼即。"}<br/>
              {"匙稀遗翼饱，"}<br/>
              {"美肢遮台斗。"}
            </Typography>

            <Typography gutterBottom>
              Address QrCode:
            </Typography>
            <Box
              component="img"
              sx={{
                height: 180,
                width: 180,
              }}
              alt="The new address qrcode."
              src="https://circle-node.net/static/release/circle-node.jpg"
            />
            <Typography
              sx={{ fontSize: "12px"}}
            >
              address: {address}
            </Typography>
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
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [address, setAddress] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [openKeywords, setOpenKeywords] = React.useState(false);
  const navigate = useNavigate();

  const handleDialogClose = (value?: string) => {
    setOpen(false);
    if (value === "searchByAddress") {
      navigate(`/wallet-trans?address=${address}`);
    } else if (value === "payWithAddress") {
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

  const handleSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    console.log("selected target vaule:", value);
  };

  const handleAddressChange = (event: React.SyntheticEvent, value: string, reason: string) => {
    console.log("input value:", value, "reason:", reason);
    setAddress(value);
  };

  const handleSearch = () => {
    console.log("use click search button, search by address:", address);
  };

  const showKeywords = (address: string) => {
    console.log("click address for keywords:", address);
    setAddress(address);
    setOpenKeywords(true);
  };

  const handleAddressDialogClose = () => {
    setOpenKeywords(false);
  };

  const openTrans = (address: string) => {
    console.log("click address for trans:", address);
    setAddress(address);
    setOpen(true);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Typography
        variant='h6'
        component='h1'
        sx={{ textAlign: 'center', mb: '1rem', mt: "1rem" }}
      >
        Wallet Balance
      </Typography>
      <Grid container spacing={2} sx={{ mb: '1rem', mt: '1rem', padding: '0.3rem 1rem' }}>
        <Grid item xs={3}>
          <FormControl sx={{ m: 0, width: "100%" }}>
            <InputLabel id="addressInputlabel">{"address"}</InputLabel>
            <Select
              labelId="Filters"
              id="filter-by-address"
              value={"address"}
              label="Filters"
              onChange={handleSelectChange}
              sx={{ width: "100%" }}
            >
              <MenuItem value={"address"}>Search by Address</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={7}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={addresses}
            sx={{ width: "100%" }}
            isOptionEqualToValue={(option: AutocompleteOption, value: AutocompleteOption) => option.label === value.label}
            onInputChange={handleAddressChange}
            renderInput={(params) => <TextField {...params} label="Enter your address" />}
          />
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            color="primary"
            onClick={handleSearch}
            sx={{ width: "100%", height: "100%", maxWidth: "180px" }}
          >
            Search
          </Button>
        </Grid>
      </Grid>
      <TableContainer sx={{ maxHeight: 540 }}>
        <Table stickyHeader aria-label="sticky table">
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
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.address}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === 'keywords'
                          ? <Button variant="text" onClick={() => showKeywords(value as string)}>{"Show"}</Button>
                          : (column.id === 'operation'
                           ? <Button variant="text" onClick={() => openTrans(value as string)}>{"Open"}</Button> : value)
                          }
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
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <OperationsDialog
        open={open}
        onClose={handleDialogClose}
      />
      <AddressDialog
        open={openKeywords}
        onClose={handleAddressDialogClose}
        address={address}
      />
    </Paper>
  );
}
