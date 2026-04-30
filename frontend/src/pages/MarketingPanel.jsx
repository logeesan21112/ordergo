import React from "react";
import { Box } from "@mui/material";
import logoImg from "../assets/logo.png";

export default function MarketingPanel() {
  return (
    <Box
      sx={{
        flex: "0 0 45%",
        background: "linear-gradient(145deg, #1e40af, #2563eb)",
        display: { xs: "none", md: "flex" },
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        component="img"
        src={logoImg}
        alt="logo"
        sx={{
          width: 260,
          height: 260,
          objectFit: "contain",
        }}
      />
    </Box>
  );
}
