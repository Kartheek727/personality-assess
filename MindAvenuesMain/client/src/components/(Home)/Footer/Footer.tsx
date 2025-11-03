// src/components/(Home)/Footer/Footer.tsx
"use client";
import React from "react";
import { Box, Container, Grid, Typography, Divider, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";

const FooterLink = styled(Box)(({ theme }) => ({
  color: "#045494", // Darker blue for readability
  display: "block",
  marginBottom: theme.spacing(1.5),
  transition: "color 0.3s ease-in-out, transform 0.3s ease-in-out",
  "&:hover": {
    color: "#f47528", // Orange highlight on hover
    transform: "translateX(8px)",
  },
}));

const FooterTitle = styled(Typography)(({ theme }) => ({
  color: "#1a62a4", // Blue primary
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  position: "relative",
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: "-8px",
    left: 0,
    width: "40px",
    height: "3px",
    backgroundColor: "#f47528", // Orange underline
  },
}));

const SocialIconButton = styled(IconButton)(({ }) => ({
  color: "#1a62a4", // Blue primary
  "&:hover": {
    color: "#fc9054", // Bright orange accent on hover
    backgroundColor: "transparent",
    transform: "scale(1.1)",
  },
  transition: "color 0.3s ease, transform 0.3s ease",
}));

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#ffffff", // White background
        pt: 8,
        pb: 6,
        borderTop: "2px solid #1a62a4", // Blue top border
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  color: "#1a62a4", // Blue primary
                  fontWeight: 800,
                  letterSpacing: "1px",
                }}
              >
                Mind Avenues
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#045494", mt: 1, maxWidth: "300px" }} // Darker blue for text
              >
                Unlocking potential through innovative solutions and transformative learning.
              </Typography>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={4}>
            <FooterTitle variant="h6">Quick Links</FooterTitle>
            <Box component="ul" sx={{ listStyle: "none", p: 0 }}>
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Terms & Conditions", href: "/terms-and-conditions" },
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Contact Us", href: "/contact-us" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} passHref legacyBehavior>
                    <Link href={item.href} passHref legacyBehavior>
                      <FooterLink>
                        {item.label}
                      </FooterLink>
                    </Link>
                  </Link>
                </li>
              ))}
            </Box>
          </Grid>

          {/* Contact & Social */}
          <Grid item xs={12} sm={6} md={4}>
            <FooterTitle variant="h6">Connect With Us</FooterTitle>
            <Typography variant="body2" sx={{ color: "#045494", mb: 2 }}>
              Email: info@mindavenues.com
            </Typography>
            <Typography variant="body2" sx={{ color: "#045494", mb: 3 }}>
              Phone: +1 (555) 123-4567
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <SocialIconButton aria-label="Facebook">
                <Facebook />
              </SocialIconButton>
              <SocialIconButton aria-label="Twitter">
                <Twitter />
              </SocialIconButton>
              <SocialIconButton aria-label="Instagram">
                <Instagram />
              </SocialIconButton>
              <SocialIconButton aria-label="LinkedIn">
                <LinkedIn />
              </SocialIconButton>
            </Box>
          </Grid>
        </Grid>

        <Divider
          sx={{
            my: 6,
            borderColor: "#1a62a4", // Blue divider
            opacity: 0.3,
          }}
        />

        {/* Bottom Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#045494", mb: { xs: 2, sm: 0 } }} // Darker blue
          >
            © {new Date().getFullYear()} Mind Avenues Potential System Private Limited. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Link href="/privacy-policy" passHref legacyBehavior>
              <Typography
                variant="body2"
                component="a"
                sx={{
                  color: "#045494",
                  textDecoration: "none",
                  "&:hover": { color: "#f47528" }, // Orange on hover
                }}
              >
                Privacy Policy
              </Typography>
            </Link>
            <Link href="/terms-and-conditions" passHref legacyBehavior>
              <Typography
                variant="body2"
                component="a"
                sx={{
                  color: "#045494",
                  textDecoration: "none",
                  "&:hover": { color: "#f47528" }, // Orange on hover
                }}
              >
                Terms of Service
              </Typography>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;