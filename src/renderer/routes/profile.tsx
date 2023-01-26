import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      width: "80px",
      height: "80px",
      fontSize: "2.5rem",
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

export default function Profile() {
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      mt={2}
      spacing={2}
      sx={{ width: "100%", height: "auto" }}
    >
      <Avatar {...stringAvatar('Charles li')} />
      <h1>Charles li</h1>
      <p className="title">lidh04@gmail.com</p>
    </Stack>
  );
}
