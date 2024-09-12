import { Box, Button, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
function NoMatch() {
  return (
    <Box p={5}>
      <Typography variant="body1" component="h2" textAlign="center" mb={5}>
        Network service connection failed
      </Typography>
      <Stack direction="row" alignItems="center" justifyContent="center">
        <Button component={Link} to="/" variant="filled">
          Go to the home page
        </Button>
      </Stack>
    </Box>
  );
}
export default NoMatch;
