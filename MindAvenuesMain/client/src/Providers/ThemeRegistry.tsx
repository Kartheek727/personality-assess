// providers/themeregistry.tsx
"use client";
import React, { ReactNode, useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import { useServerInsertedHTML } from "next/navigation";
import CssBaseline from "@mui/material/CssBaseline";
import { Inter } from 'next/font/google';
import createEmotionCache from "@/lib/emotionCache";

const inter = Inter({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

export const theme = createTheme({
    palette: {
      primary: {
        main: '#f47528',    // Main orange
        light: '#fc9054',   // Lighter orange variant
        dark: '#f88048',    // Darker orange variant
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#1a62a4',    // Main blue
        light: '#749cc7',   // Lighter blue variant
        dark: '#045494',    // Darker blue variant
        contrastText: '#ffffff',
      },
      background: {
        default: '#cfdae6', // Light blue-gray background
        paper: '#ffffff',
      },
      text: {
        primary: '#1a1a1a',
        secondary: '#045494', // Using dark blue as secondary text
      },
      error: {
        main: '#f88048',    // Using darker orange for error
      },
      warning: {
        main: '#faac81',    // Using light orange for warning
      },
      info: {
        main: '#6b9cc5',    // Using medium blue for info
      },
      success: {
        main: '#749cc7',    // Using light blue for success
      },
      mode: 'light',
    },
    typography: {
      fontFamily: inter.style.fontFamily,
      h1: {
        fontWeight: 700,
        fontSize: '3.5rem',
      },
      h2: {
        fontWeight: 700,
        fontSize: '2.75rem',
      },
      h3: {
        fontWeight: 600,
        fontSize: '2.25rem',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.75rem',
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.25rem',
      },
      h6: {
        fontWeight: 600,
        fontSize: '1rem',
      },
      button: {
        fontWeight: 500,
        textTransform: 'none',
      },
      overline: {
        fontWeight: 600,
        fontSize: '0.75rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '9999px',
            textTransform: 'none',
            fontWeight: 500,
            padding: '8px 20px',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            borderWidth: 2,
            borderColor: 'white',
            borderStyle: 'solid',
          },
        },
      },
    },
});

export const darkTheme = createTheme({
    ...theme,
    palette: {
      ...theme.palette,
      mode: 'dark',
      primary: {
        ...theme.palette.primary,
      },
      secondary: {
        ...theme.palette.secondary,
      },
      background: {
        default: '#1a1a1a',
        paper: '#2d2d2d',
      },
      text: {
        primary: '#f7f7f7',
        secondary: '#fbc7a9', // Using light peach for dark mode secondary text
      },
    },
});

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const cache = React.useMemo(() => createEmotionCache(), []);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(" ")}`}
      dangerouslySetInnerHTML={{
        __html: Object.values(cache.inserted).join(" "),
      }}
    />
  ));
  
  if (!isMounted) return null;

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}