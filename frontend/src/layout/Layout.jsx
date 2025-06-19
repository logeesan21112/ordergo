import React from "react";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";

const Layout = ({ children, isCollapsed, onToggle }) => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar isCollapsed={isCollapsed} onToggle={onToggle} />
      <Box component="main" sx={{ flexGrow: 1, p: 2, width: "100%" }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
