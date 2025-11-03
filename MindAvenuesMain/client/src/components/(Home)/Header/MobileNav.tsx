// components/Header/MobileNav.tsx
'use client'
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Divider from '@mui/material/Divider';
import Link from 'next/link';
import Image from 'next/image';
import { NavItemType } from './types';

interface MobileNavProps {
  navItems: NavItemType[];
  onClose: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ navItems, onClose }) => {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  const handleClick = (label: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <Box sx={{ width: '100%', pt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Image
          src="/logo.png"
          alt="Company Logo"
          width={120}
          height={40}
          priority
        />
      </Box>
      <Divider sx={{ bgcolor: '#1a62a4' }} /> {/* Blue divider */}
      <List component="nav" aria-label="main navigation">
        {navItems.map((item) => (
          <React.Fragment key={item.label}>
            <ListItem disablePadding>
              {item.children ? (
                <ListItemButton 
                  onClick={() => handleClick(item.label)}
                  sx={{ 
                    color: '#1a62a4', // Blue primary
                    '&:hover': { color: '#f47528' } // Orange highlight
                  }}
                >
                  <ListItemText primary={item.label} />
                  {openItems[item.label] ? 
                    <ExpandLessIcon sx={{ color: '#f47528' }} /> : 
                    <ExpandMoreIcon sx={{ color: '#1a62a4' }} />}
                </ListItemButton>
              ) : (
                <ListItemButton
                  component={Link}
                  href={item.href}
                  onClick={handleLinkClick}
                  sx={{ 
                    color: '#1a62a4', // Blue primary
                    '&:hover': { color: '#f47528' } // Orange highlight
                  }}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              )}
            </ListItem>
            
            {item.children && (
              <Collapse in={openItems[item.label]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <ListItemButton
                      key={child.label}
                      component={Link}
                      href={child.href}
                      onClick={handleLinkClick}
                      sx={{ 
                        pl: 4, 
                        color: '#045494', // Darker blue for sub-items
                        '&:hover': { color: '#fc9054' } // Bright orange accent
                      }}
                    >
                      <ListItemText primary={child.label} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default MobileNav;