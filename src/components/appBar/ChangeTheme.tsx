import { ThemeModeContext } from '@/theme/content/providers/ThemeModeProvider';
import DarkIcon from '@mui/icons-material/DarkModeOutlined';
import LightIcon from '@mui/icons-material/LightModeOutlined';
import { IconButton } from '@mui/material';
import { useContext } from 'react';

const ChangeTheme = () => {
  const { toggleTheme, themeMode } = useContext(ThemeModeContext);
  return (
    <IconButton size="large" color="inherit" onClick={toggleTheme}>
      {themeMode == 'light' ? <LightIcon /> : <DarkIcon />}
    </IconButton>
  );
};

export default ChangeTheme;
