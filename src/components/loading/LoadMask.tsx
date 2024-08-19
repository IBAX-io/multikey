import { memo } from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

const LoadMask = ({ loading }: { loading: boolean }) => {
  return (
    <Backdrop open={loading} className="MuiBackdrop-root-loading">
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default memo(LoadMask);
