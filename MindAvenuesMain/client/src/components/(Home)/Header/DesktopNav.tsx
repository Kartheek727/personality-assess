// components/Header/DesktopNav.tsx
'use client'
import React, { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import NavItem from './NavItem';
import { NavItemType } from './types';

interface DesktopNavProps {
  navItems: NavItemType[];
}

const DesktopNav: React.FC<DesktopNavProps> = ({ navItems }) => {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleMouseEnter = (label: string) => {
    setOpenMenus(prev => ({ ...prev, [label]: true }));
  };

  const handleMouseLeave = (label: string) => {
    setTimeout(() => {
      if (!menuRefs.current[label]?.matches(':hover')) {
        setOpenMenus(prev => ({ ...prev, [label]: false }));
      }
    }, 100);
  };

  const handleClickAway = () => {
    setOpenMenus({});
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box 
        component="nav" 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 4,
          py: 1,
          px: 2,
          borderRadius: 2,
        }}
      >
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            item={item}
            isOpen={openMenus[item.label] || false}
            onMouseEnter={() => handleMouseEnter(item.label)}
            onMouseLeave={() => handleMouseLeave(item.label)}
            ref={(el) => {
              menuRefs.current[item.label] = el;
            }}
          />
        ))}
      </Box>
    </ClickAwayListener>
  );
};

export default DesktopNav;