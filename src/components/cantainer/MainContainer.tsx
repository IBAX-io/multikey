import type { SxProps } from '@mui/material';
import { Paper, useMediaQuery, useTheme } from '@mui/material';
import { FC } from 'react';

const MainContainer: FC<{ children?: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();
  console.log('🚀 ~ file: MainContainer.tsx:7 ~ theme:', theme.palette.container);
  const isSmUp = useMediaQuery(theme.breakpoints.up('md'));
  const isSxUp = useMediaQuery(theme.breakpoints.up('sm'));
  const radiusTop = 30;
  const radiusBottom = isSxUp ? 25 : 0;

  const paperStyle: SxProps = {
    p: isSxUp ? 4 : 2,
    borderTopLeftRadius: radiusTop,
    borderTopRightRadius: radiusTop,
    borderBottomLeftRadius: radiusBottom,
    borderBottomRightRadius: radiusBottom,
    // height: isSxUp ? 'auto' : 1,
    m: isSxUp ? 2 : 0,
    // height: isSxUp ? 1 : 1,
    height: 'calc(100vh - 80px)',
    overflowY: 'auto',
    mt: 0,
    mb: isSxUp ? 2 : 0,
    mr: isSxUp ? 2 : 0,
    ml: isSxUp ? (isSmUp ? 0 : 2) : 0,
    backgroundColor: theme.palette.container.main
  };

  return (
    <Paper sx={paperStyle} elevation={0}>
      {children}
    </Paper>
  );
};

export default MainContainer;
