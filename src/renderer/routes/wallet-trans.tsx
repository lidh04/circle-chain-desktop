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
  id: 'name' | 'code' | 'population' | 'size' | 'density';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'from', label: 'From', minWidth: 150 },
  { id: 'to', label: 'To', minWidth: 150 },
  {
    id: 'type',
    label: 'Type',
    minWidth: 60,
    align: 'right',
  },
  {
    id: 'content',
    label: 'Content',
    minWidth: 60,
    align: 'right',
  },
  {
    id: 'timestamp',
    label: 'Timestamp',
    minWidth: 100,
    align: 'right',
  },
];

interface Data {
  from: string;
  to: string;
  type: string;
  content: string;
  timestamp: string;
}

function createData(
  from: string,
  to: number,
  type: string,
  content: string,
): Data {
  return { from, to, type, content, timestamp: '2022-10-11 22:00:00' };
}

const rows = [
  createData('1MVQfJrU3mK3M62hygJz9pmgBxVoGzPaKj', "1Lnj3A96SEix2nyY3RTm5rbqCX4tNuAXLn", "BAL", "100"),
  createData('12UdA785W3Y6M3SR8HxxExe7PRcwvVg88S', "14q7erUx3bMWjzhjrx5NeK1LUKSiWe5UMY", "IDT", "0de5a851ef1cda49de81689cb1"),
  createData('1L8eRrBuWnBxcQ6DKCDkkPM7ozxDcmpho1', "1FYnGyxYA5XyyjiPSGGgGJgjX8VnvQ4xw", "IDT", "0de5a851ef1cda49de81689cb1"),
  createData('16rcESr6pm3x3PByQH6JEbJBzZkf5W5NQk', "1AVJGYtEKaS6P39yNGCuEPPy2xXL9Tzw5T", "OWN", "0de5a851ef1cda49de81689cb1"),
  createData('1745rpVqjXSntEniXdFhvuRHNESoYpyynp', "1HQeLrWD7n9rp95aTRF9iZzE9NvtVCeXTN", "OWN", "0de5a851ef1cda49de81689cb1"),
  createData('1Jhf7pUtmqK2ZqR9du7xa6uL1Qxdc14atG', "1NHYhHDdgoiMXcWCxtEceADyTCjGw5b4Gy", "OWN", "0de5a851ef1cda49de81689cb1"),
  createData('1rmzxfP5J1QjYXMa9zmSC7dCBLTDciBda', "15GNsHp8AJFWacHNb1RA8gmMm4Zmh1mX2A", "OWN", "0de5a851ef1cda49de81689cb1"),
  createData('12vU588JA4zGMA7gKDRuu3HGLrr3BxhkBt', "12GYQK9nSDBxn3TDy9uj9rnxGVuVbEDwWr", "BAL", "300"),
  createData('12cSSRmfLMH8s5MrxeEdtgbKWnk28Si6cr', "1J4KmSGEjrjK81ciYuA9vxA46eRLYMTQB3", "IDT", "0de5a851ef1cda49de81689cb1"),
  createData('1APGzvGwcDKWDobEEDiHtEehVz4G4jWeoR', "18xGLNHgwb29PTnoRqcNEFouNS9PV1yJG1", "IDT", "0de5a851ef1cda49de81689cb1"),
  createData('1HDv7a7PqbYugZjaVJtMxvsnvpk7GS554s', "16dZa5gevGk9zeKf9f6ARnkdN7cDRz9bCj", "BAL", "200"),
  createData('1EnfGqqXhUgo2fU63JMxJf7jgM1cSQULKg', "1GchqM3Ujw1gqEf3cuDDsxNEDHMnnui2kw", "BAL", "300"),
  createData('1N7Y3QdRjm8KVEi2e2ejPjriAskHcxLFJu', "1AH3MHtDTWLCysJvVVhPC6nHJ9ZVJhEetx", "IDT", "0de5a851ef1cda49de81689cb1"),
  createData('14hF1BynFVnBEFKxyo51FHmJksVwfxg4sg', "1XDbzJqry3nuNmtDEHZ16yZK2HGpcSdbc", "OWN", "0de5a851ef1cda49de81689cb1"),
  createData('1NMhhRzQtyhocMa31kB5hhtXy2fRPy2rn', "1L3iLnooMexN3SLz6sDvYaWNtZ7nxZvwXn", "OWN", "0de5a851ef1cda49de81689cb1"),
];

export default function WalletInfo() {
  const [page, setPage] = React.useState(0);
  const [filter, setFilter] = React.useState("from");
  const [input, setInput] = React.useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSelectChange= (event: Rreact.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    console.log("selected target vaule:", value);
    setFilter(value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    console.log("input:", value);
    setInput(value);
  };

  const handleSearch = () => {
    console.log("use click search button, search by input:", input, "filter:", filter);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Typography
        variant='h6'
        component='h1'
        sx={{ textAlign: 'center', mb: '1rem', mt: "1rem" }}
      >
        Wallet Transactions
      </Typography>
      <Grid container spacing={2} sx={{ mb: '1rem', mt: '1rem', padding: '0.3rem 1rem' }}>
        <Grid item xs={3}>
          <Select
            labelId="Filters"
            id="filter-by-address"
            value={filter}
            label="Filters"
            onChange={handleSelectChange}
            sx={{ width: "100%" }}
          >
            <MenuItem value={"from"}>Search by From</MenuItem>
            <MenuItem value={"to"}>Search by to</MenuItem>
            <MenuItem value={"type"}>Search by Type</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={7}>
          <TextField
            id="input-textfield"
            label=""
            variant="outlined"
            sx={{ width: "100%"}}
            onChange={handleInputChange}
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
                  <TableRow hover role="checkbox" tabIndex={-1} key={`${row.from}-${row.to}`}>
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
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
