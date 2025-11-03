"use client";

import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
} from "@mui/material";
import {
  Assessment,
  Payment,
  People,
  BarChart,
  MonetizationOn,
  Person,
  ExitToApp,
  Image as ImageIcon, // New icon for PDF Logo
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";

interface SidebarProps {
  activeSection:
    | "assessments"
    | "paymentStats"
    | "assessmentStats"
    | "payments"
    | "paidUsers"
    | "users"
    | "pdfLogo"; // Added new section
  setActiveSection: (
    section:
      | "assessments"
      | "paymentStats"
      | "assessmentStats"
      | "payments"
      | "paidUsers"
      | "users"
      | "pdfLogo" // Added new section
  ) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  setActiveSection,
}) => {
  const router = useRouter();
  const { logout } = useAuth();

  const menuItems = [
    { text: "Assessments", icon: <Assessment />, section: "assessments" },
    {
      text: "Payment Stats",
      icon: <MonetizationOn />,
      section: "paymentStats",
    },
    {
      text: "Assessment Stats",
      icon: <BarChart />,
      section: "assessmentStats",
    },
    { text: "Payments", icon: <Payment />, section: "payments" },
    { text: "Paid Users", icon: <People />, section: "paidUsers" },
    { text: "All Users", icon: <People />, section: "users" },
    { text: "Upload PDF Logo", icon: <ImageIcon />, section: "pdfLogo" }, // New menu item
  ] as const;

  const handleProfileClick = () => {
    router.push("/profile");
  };

  const handleLogoutClick = () => {
    logout();
    router.push("/login");
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Link href="/">
        <Box sx={{ p: 2 }}>
          <Image
            src="/logo.png"
            alt="MindAvenues Logo"
            width={200}
            height={50}
            style={{ width: "100%", maxWidth: 200 }}
            priority
          />
        </Box>
      </Link>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.section}
            selected={activeSection === item.section}
            onClick={() => setActiveSection(item.section)}
            sx={{
              "&.Mui-selected": { backgroundColor: "#9333ea", color: "white" },
              "&.Mui-selected:hover": { backgroundColor: "#7e2ed1" },
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
          >
            <ListItemIcon
              sx={{
                color: activeSection === item.section ? "white" : "inherit",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <List>
        <ListItemButton
          key="profile"
          onClick={handleProfileClick}
          sx={{
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <Person />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItemButton>
        <ListItemButton
          key="logout"
          onClick={handleLogoutClick}
          sx={{
            "&:hover": { backgroundColor: "#f5f5f5" },
            "&:active": { backgroundColor: "#d32f2f" },
          }}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;