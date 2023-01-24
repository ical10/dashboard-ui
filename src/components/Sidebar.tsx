import CuratorsIcon from '@/icons/CuratorsIcon.svg';
import DashboardIcon from '@/icons/DashboardIcon.svg';
import ImplementersIcon from '@/icons/ImplementersIcon.svg';
import LogoutIcon from '@/icons/LogoutIcon.svg';
// import AggregatesIcon from '@/icons/AggregatesIcon.svg';
// import GoalsIcon from '@/icons/GoalsIcon.svg';
// import RewardsIcon from '@/icons/RewardsIcon.svg';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SvgIcon,
} from '@mui/material';

import React from 'react';

import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

type PureSidebarProps = {
  isAuthenticated: boolean;
  onConnect: () => void;
};

function PureSidebar({ isAuthenticated, onConnect }: PureSidebarProps) {
  const menuOptions = [
    {
      icon: DashboardIcon,
      title: 'Dashboard',
      href: '/',
    },
    {
      icon: ImplementersIcon,
      title: 'Implementers',
      href: '/implementers',
    },
    {
      icon: CuratorsIcon,
      title: 'Curators',
      href: '/curators',
    },
  ];

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
            {menuOptions.map(option => (
              <Link key={option.href} href={option.href} passHref>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <SvgIcon component={option.icon} inheritViewBox />
                    </ListItemIcon>
                    <ListItemText
                      primary={option.title}
                      primaryTypographyProps={{ color: 'white' }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
          </List>
        </nav>
      </div>
      <div className="mt-auto mb-12">
        <nav id="logout-nav" aria-label="logout-nav">
          <List>
            <ListItem disablePadding className="flex justify-center items-center">
              {isAuthenticated ? (
                <>
                  <ListItemButton
                    onClick={() => {
                      signOut();
                    }}
                  >
                    <ListItemIcon>
                      <SvgIcon component={LogoutIcon} inheritViewBox />
                    </ListItemIcon>
                    <ListItemText primary="Logout" primaryTypographyProps={{ color: 'white' }} />
                  </ListItemButton>
                </>
              ) : (
                <>
                  <button
                    className="btn-connect px-4 py-2 flex flex-row justify-center items-center gap-2"
                    onClick={() => {
                      onConnect && onConnect();
                    }}
                  >
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        className="icon-svg"
                        fill="none"
                      >
                        <path
                          d="M22 12v5c0 3-2 5-5 5H7c-3 0-5-2-5-5v-5c0-2.72 1.64-4.62 4.19-4.94.26-.04.53-.06.81-.06h10c.26 0 .51.01.75.05C20.33 7.35 22 9.26 22 12Z"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          d="M17.751 7.05c-.24-.04-.49-.05-.75-.05h-10c-.28 0-.55.02-.81.06.14-.28.34-.54.58-.78l3.25-3.26a3.525 3.525 0 0 1 4.96 0l1.75 1.77c.64.63.98 1.43 1.02 2.26ZM22 12.5h-3c-1.1 0-2 .9-2 2s.9 2 2 2h3"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </span>
                    Connect wallet
                  </button>
                </>
              )}
            </ListItem>
          </List>
        </nav>
      </div>
    </Box>
  );
}

const Sidebar = React.memo(PureSidebar);

export default Sidebar;
