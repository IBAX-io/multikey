import ChangeLanguage from '@/components/appBar/ChangeLanguage';
import ChangeTheme from '@/components/appBar/ChangeTheme';
import { ThemeModeContext } from '@/theme/content/providers/ThemeModeProvider';
import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import type { DrawerProps } from '@mui/material';
import { Box, Drawer, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { FC, memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import logoDark from '/public/logo-dark.png';
import logoLight from '/public/logo-light.png';

const MainDrawer: FC<DrawerProps> = (props) => {
  const { themeMode } = useContext(ThemeModeContext);
  const { t } = useTranslation();
  const logo = useMemo(() => {
    const img = themeMode === 'light' ? logoLight : logoDark;
    return img;
  }, [themeMode]);
  const { onClose, ...others } = props;
  type linkType = {
    key: number;
    text: string;
    href: string;
    active?: string;
    isOpen?: boolean;
    icon: React.ReactNode;
    iconOutlined: React.ReactNode;
  };
  const LINKS: linkType[] = [
    { key: 1, text: 'nav.assets', href: '/', active: '', icon: <HomeIcon />, iconOutlined: <HomeOutlinedIcon /> },
    {
      key: 2,
      text: 'nav.manage',
      href: '/manage',
      active: 'manage',
      icon: <SettingsIcon />,
      iconOutlined: <SettingsOutlinedIcon />
    }
  ];
  const handleRouteChange = useCallback((path: string) => {
    path = path.includes('/record') ? '/record' : path;
    let active = '';
    switch (path) {
      case '/':
      case '/transfer':
      case '/collection':
      case '/receive':
      case '/create':
      case '/record':
        active = '/';
        break;
      case '/manage':
        active = '/manage';
        break;
      /*   case '/colorSystem':
        active = '/colorSystem';
        break; */
      default:
        break;
    }
    console.log(active);
    setSelectedIndex(active.replace('/', ''));
  }, []);
  const location = useLocation();
  console.log('🚀 ~ file: MainDrawer.tsx:79 ~ location:', location);
  // console.log('🚀 ~ file: MainDrawer.tsx:56 ~ location:', location);
  const [selectedIndex, setSelectedIndex] = useState(location.pathname.replace('/', ''));
  useEffect(() => {
    handleRouteChange(location.pathname);
  }, [handleRouteChange, location.pathname]);

  const handleListItemClick = (index: string) => {
    console.log('🚀 ~ file: MainDrawer.tsx:59 ~ handleListItemClick ~ index:', index);
    onClose?.({}, 'backdropClick');
  };
  /*   const handleCloseDrawer = () => {
    onClose?.({}, 'backdropClick');
  };
  const teamIds = useAppSelector(selectTeamIds); */
  return (
    <Drawer {...others} onClose={onClose}>
      <Box
        component={Link}
        to="/"
        sx={{
          display: { xs: 'none', sm: 'block' },
          mr: 'auto',
          color: (theme) => theme.palette.onSurface.main,
          fontSize: 16
        }}>
        <Toolbar sx={{ display: { xs: 'none', sm: 'none', md: 'flex' } }}>
          <Box
            component="img"
            sx={{
              width: 220
            }}
            alt="logo"
            src={logo}
          />
        </Toolbar>
      </Box>
      <Toolbar sx={{ display: { xs: 'block', sm: 'block', md: 'none' }, my: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Toolbar>
              <Box
                component="img"
                sx={{
                  width: 220
                }}
                alt="logo."
                src={logo}
              />
            </Toolbar>
          </Grid>
          <Grid item sx={{ ml: 'auto' }}>
            <ChangeTheme></ChangeTheme>
          </Grid>
          <Grid item>
            <ChangeLanguage></ChangeLanguage>
          </Grid>
        </Grid>
      </Toolbar>
      {/*   <Box sx={{ display: { xs: 'block', sm: 'block', md: 'none' } }}>
        {teamIds.length ? <TeamName close={handleCloseDrawer}></TeamName> : ''}
      </Box> */}
      <List>
        <Box>
          {LINKS.map((item: linkType) => {
            return (
              <ListItem key={item.key}>
                <ListItemButton
                  component={Link}
                  to={item.href}
                  selected={selectedIndex === item.active}
                  onClick={() => handleListItemClick(item.href)}>
                  <ListItemIcon>{selectedIndex == item.active ? item.icon : item.iconOutlined}</ListItemIcon>
                  <ListItemText>{t(item.text)}</ListItemText>
                </ListItemButton>
              </ListItem>
            );
          })}
        </Box>
      </List>
    </Drawer>
  );
};

export default memo(MainDrawer);
