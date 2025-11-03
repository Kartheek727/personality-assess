// components/Header/Header.tsx
'use client'
import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import Drawer from '@mui/material/Drawer';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import LoginButton from './LoginButton';
import { navItems } from './navItems';
import Link from 'next/link';

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={1} 
      sx={{ 
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #1a62a4', // Blue border
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {isMobile && (
            <IconButton
              sx={{ 
                color: '#1a62a4', // Blue primary
                '&:hover': { color: '#f47528' }, // Orange highlight on hover
                mr: 2
              }}
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Link href="/" passHref>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: isMobile ? 'center' : 'flex-start',
              flexGrow: isMobile ? 1 : 0
            }}>
              <Image
                src="/adityalogo.jpg" 
                alt="Company Logo"
                width={100}
                height={50}
                priority
              />
            </Box>
          </Link>
          
          {!isMobile && <DesktopNav navItems={navItems} />}
          
          <LoginButton />
          
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: 280,
                backgroundColor: '#ffffff', // White background
              },
            }}
          >
            <MobileNav navItems={navItems} onClose={handleDrawerToggle} />
          </Drawer>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;