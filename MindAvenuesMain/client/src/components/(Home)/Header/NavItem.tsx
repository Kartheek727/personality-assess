// components/Header/NavItem.tsx
import React, { forwardRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Grow from '@mui/material/Grow';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import { NavItemType } from './types';

interface NavItemProps {
  item: NavItemType;
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const NavItem = forwardRef<HTMLDivElement, NavItemProps>(
  ({ item, isOpen, onMouseEnter, onMouseLeave }, ref) => {
    const anchorRef = React.useRef<HTMLDivElement>(null);
    
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;
    
    return (
      <Box
        ref={ref}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        sx={{ position: 'relative' }}
      >
        <Box
          ref={anchorRef}
          component={hasChildren ? 'div' : Link}
          href={hasChildren ? undefined : item.href}
          sx={{
            p: 2,
            cursor: 'pointer',
            color: '#1a62a4', // Blue primary
            fontWeight: 500,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            '&:hover': {
              color: '#f47528', // Orange highlight
            },
          }}
        >
          <Typography variant="subtitle1">{item.label}</Typography>
        </Box>

        {hasChildren && (
          <Popper
            open={isOpen}
            anchorEl={anchorRef.current}
            role={undefined}
            placement="bottom-start"
            transition
            disablePortal
            style={{ zIndex: 1300 }}
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === 'bottom-start' ? 'left top' : 'left bottom',
                }}
              >
                <Paper 
                  elevation={3} 
                  sx={{ 
                    minWidth: 180,
                    bgcolor: '#ffffff', // White background
                    border: '1px solid #1a62a4', // Blue border
                  }}
                >
                  <MenuList
                    autoFocusItem={isOpen}
                    id={`menu-list-${item.label}`}
                    aria-labelledby={`menu-button-${item.label}`}
                  >
                    {item.children?.map((child) => (
                      <MenuItem 
                        key={child.label} 
                        component={Link} 
                        href={child.href}
                        sx={{
                          color: '#1a62a4', // Blue primary
                          '&:hover': {
                            color: '#fc9054', // Bright orange accent
                          }
                        }}
                      >
                        <Typography variant="body2">{child.label}</Typography>
                      </MenuItem>
                    ))}
                  </MenuList>
                </Paper>
              </Grow>
            )}
          </Popper>
        )}
      </Box>
    );
  }
);

NavItem.displayName = 'NavItem';

export default NavItem;