import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Toolbar,
  Divider,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from "@mui/icons-material/Article";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StoreIcon from "@mui/icons-material/Store";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

import ApiService from "../service/ApiService";

const drawerWidth = 240;
const collapsedWidth = 72;

const Sidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const navigate = useNavigate();

  const [open, setOpen] = useState(!isMobile);
  const [collapsed, setCollapsed] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAuth(ApiService.isAuthenticated());
    setIsAdmin(ApiService.isAdmin());
  }, []);

  useEffect(() => {
    setOpen(!isMobile);
    setCollapsed(false);
  }, [isMobile]);

  const toggleDrawer = () => setOpen((prev) => !prev);
  const toggleCollapse = () => setCollapsed((prev) => !prev);

  const handleLogout = () => {
    ApiService.logout();
    navigate("/login");
  };

  const listItemButtonSx = {
    justifyContent: collapsed ? "center" : "initial",
    px: collapsed ? 1.5 : 2.5,
  };

  const listItemIconSx = {
    minWidth: 0,
    mr: collapsed ? 0 : 3,
    justifyContent: "center",
  };

  return (
    <>
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          edge="start"
          sx={{ m: 1 }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        open={open}
        onClose={toggleDrawer}
        sx={{
          width: collapsed ? collapsedWidth : drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: collapsed ? collapsedWidth : drawerWidth,
            boxSizing: "border-box",
            overflowX: "hidden",
          },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            px: 2,
          }}
        >
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              width: "100%",
            }}
          >
            <img
              src="logo.png"
              alt="App Logo"
              style={{ height: 80, display: collapsed ? "none" : "block" }}
            />
          </Box>
          {!isMobile && (
            <IconButton onClick={toggleCollapse}>
              {collapsed ? <MenuIcon /> : <ChevronLeftIcon />}
            </IconButton>
          )}
        </Toolbar>

        <Divider />

        <List component="nav" aria-label="main navigation">
          {isAuth && (
            <>
              <ListItemButton
                component={Link}
                to="/orders"
                onClick={() => isMobile && toggleDrawer()}
                sx={listItemButtonSx}
              >
                <ListItemIcon sx={listItemIconSx}>
                  <ArticleIcon />
                </ListItemIcon>
                {!collapsed && <ListItemText primary="Orders" />}
              </ListItemButton>

              <ListItemButton
                component={Link}
                to="/expenses"
                onClick={() => isMobile && toggleDrawer()}
                sx={listItemButtonSx}
              >
                <ListItemIcon sx={listItemIconSx}>
                  <ReceiptLongIcon />
                </ListItemIcon>
                {!collapsed && <ListItemText primary="Expenses" />}
              </ListItemButton>

              {isAdmin && (
                <>
                  <ListItemButton
                    component={Link}
                    to="/dashboard"
                    onClick={() => isMobile && toggleDrawer()}
                    sx={listItemButtonSx}
                  >
                    <ListItemIcon sx={listItemIconSx}>
                      <DashboardIcon />
                    </ListItemIcon>
                    {!collapsed && <ListItemText primary="Dashboard" />}
                  </ListItemButton>

                  <ListItemButton
                    component={Link}
                    to="/vendors"
                    onClick={() => isMobile && toggleDrawer()}
                    sx={listItemButtonSx}
                  >
                    <ListItemIcon sx={listItemIconSx}>
                      <StoreIcon />
                    </ListItemIcon>
                    {!collapsed && <ListItemText primary="Vendors" />}
                  </ListItemButton>

                  <ListItemButton
                    component={Link}
                    to="/riders"
                    onClick={() => isMobile && toggleDrawer()}
                    sx={listItemButtonSx}
                  >
                    <ListItemIcon sx={listItemIconSx}>
                      <TwoWheelerIcon />
                    </ListItemIcon>
                    {!collapsed && <ListItemText primary="Riders" />}
                  </ListItemButton>

                  <ListItemButton
                    component={Link}
                    to="/locations"
                    onClick={() => isMobile && toggleDrawer()}
                    sx={listItemButtonSx}
                  >
                    <ListItemIcon sx={listItemIconSx}>
                      <LocationOnIcon />
                    </ListItemIcon>
                    {!collapsed && <ListItemText primary="Locations" />}
                  </ListItemButton>
                </>
              )}
            </>
          )}
        </List>

        <Divider />

        {isAuth && (
          <List>
            <ListItemButton
              component={Link}
              to="/profile"
              onClick={() => isMobile && toggleDrawer()}
              sx={listItemButtonSx}
            >
              <ListItemIcon sx={listItemIconSx}>
                <AccountCircleIcon />
              </ListItemIcon>
              {!collapsed && <ListItemText primary="Profile" />}
            </ListItemButton>

            <ListItemButton
              onClick={handleLogout}
              sx={listItemButtonSx}
            >
              <ListItemIcon sx={listItemIconSx}>
                <LogoutIcon />
              </ListItemIcon>
              {!collapsed && <ListItemText primary="Logout" />}
            </ListItemButton>
          </List>
        )}
      </Drawer>
    </>
  );
};

export default Sidebar;
