import React, { useEffect } from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import RunCircleIcon from '@mui/icons-material/RunCircle';

export default function MineBlock() {
  const [core, setCore] = React.useState<number>(1);
  const [cpuList, setCpuList] = React.useState<number[]>([1]);
  const [error, setError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmitHandler: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    console.log('user clicked Submit button');
  };

  const handleCPUChange = (event: SelectChangeEvent) => {
    event.preventDefault();
    setCore(event.target.value as number);
  };

  const handleMineNow = async () => {};

  useEffect(() => {
    setCpuList([1, 2, 3]);
  }, []);

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
        Get the mine data and mine the block locally, you will the miner coin 100,000 LI each block.
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
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Cores</InputLabel>
              <Select
                labelId="core-select-label"
                id="core-select"
                value={core}
                label="CPU Cores"
                onChange={handleCPUChange}
              >
                {cpuList.map((cpu) => (
                  <MenuItem value={cpu}>{cpu}</MenuItem>
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
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
}
