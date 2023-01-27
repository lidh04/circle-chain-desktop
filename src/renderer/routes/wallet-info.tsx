import {
  Button,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
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

interface Column {
  id: 'address' | 'balance' | 'identity' | 'ownership' | 'keywords';
  label: string;
  minWidth?: number;
  align?: 'right';
  htmlContent?: boolean;
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
    id: 'keywords',
    label: 'Keywords',
    minWidth: 200,
    align: 'right',
    htmlContent: true,
  },
];

interface Data {
  address: string;
  balance: number;
  identity: number;
  ownership: number;
  keywords: string;
}

function createData(
  address: string,
  balance: number,
  identity: number,
  ownership: number,
): Data {
  const getKeywords = (address: string) => address;
  return { address, balance, identity, ownership, keywords: getKeywords(address) };
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

export default function WalletInfo() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [address, setAddress] = React.useState("");

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSelectChange = (event: Rreact.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    console.log("selected target vaule:", value);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    console.log("input address:", value);
    setAddress(value);
  };

  const handleSearch = () => {
    console.log("use click search button, search by address:", address);
  };

  const showKeywords = (address: string) => {
    console.log("click address:", address);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Typography
        variant='h6'
        component='h1'
        sx={{ textAlign: 'center', mb: '1rem', mt: "1rem" }}
      >
        Wallet Information
      </Typography>
      <Grid container spacing={2} sx={{ mb: '1rem', mt: '1rem', padding: '0.3rem 1rem' }}>
        <Grid item xs={3}>
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
        </Grid>
        <Grid item xs={7}>
          <TextField
            id="address-textfield"
            label=""
            variant="outlined"
            sx={{ width: "100%"}}
            onChange={handleAddressChange}
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
                          {column.htmlContent
                          ? <Button variant="text" onClick={() => showKeywords(value as string)}>{"Show"}</Button> : value}
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
    </Paper>
  );
}
