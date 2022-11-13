import AggregatesIcon from '@/icons/AggregatesIcon.svg';
import CuratorsIcon from '@/icons/CuratorsIcon.svg';
import DashboardIcon from '@/icons/DashboardIcon.svg';
import GoalsIcon from '@/icons/GoalsIcon.svg';
import ImplementersIcon from '@/icons/ImplementersIcon.svg';
import LogoutIcon from '@/icons/LogoutIcon.svg';
import RewardsIcon from '@/icons/RewardsIcon.svg';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SvgIcon from '@mui/material/SvgIcon';

import {signOut} from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <Box
      component="div"
      sx={{
        width: '100%',
        height: '100vh',
        maxWidth: 221,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        background:
          'linear-gradient(177.83deg, rgba(230, 0, 122, 0.99) -5.55%, rgba(230, 0, 122, 0.99) 53.24%, rgba(96, 0, 51, 0.85) 131.15%);',
      }}
    >
      <div className="flex justify-center items-center mb-12 mt-6">
        <Image src="/icons/PolkadotWhiteIcon.svg" alt="Polkadot-logo" width={83} height={83} />
      </div>
      <div>
        <nav id="main-sidebar" aria-label="main-sidebar">
          <List>
            <Link href="/dashboard" passHref>
              <ListItem disablePadding button>
                <ListItemButton>
                  <ListItemIcon>
                    <SvgIcon component={DashboardIcon} inheritViewBox />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" primaryTypographyProps={{color: 'white'}} />
                </ListItemButton>
              </ListItem>
            </Link>
            <Link href="/implementers" passHref>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <SvgIcon component={ImplementersIcon} inheritViewBox />
                  </ListItemIcon>
                  <ListItemText primary="Implementers" primaryTypographyProps={{color: 'white'}} />
                </ListItemButton>
              </ListItem>
            </Link>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <SvgIcon component={CuratorsIcon} inheritViewBox />
                </ListItemIcon>
                <ListItemText primary="Curators" primaryTypographyProps={{color: 'white'}} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <SvgIcon component={RewardsIcon} inheritViewBox />
                </ListItemIcon>
                <ListItemText primary="Rewards" primaryTypographyProps={{color: 'white'}} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <SvgIcon component={AggregatesIcon} inheritViewBox />
                </ListItemIcon>
                <ListItemText primary="Aggregates" primaryTypographyProps={{color: 'white'}} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <SvgIcon component={GoalsIcon} inheritViewBox />
                </ListItemIcon>
                <ListItemText primary="Goals" primaryTypographyProps={{color: 'white'}} />
              </ListItemButton>
            </ListItem>
          </List>
        </nav>
      </div>
      <div className="mt-auto mb-12">
        <nav id="logout-nav" aria-label="logout-nav">
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  console.log('called');
                  signOut();
                }}
              >
                <ListItemIcon>
                  <SvgIcon component={LogoutIcon} inheritViewBox />
                </ListItemIcon>
                <ListItemText primary="Logout" primaryTypographyProps={{color: 'white'}} />
              </ListItemButton>
            </ListItem>
          </List>
        </nav>
      </div>
    </Box>
  );
};

export default Sidebar;
