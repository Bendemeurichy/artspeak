import type { MetaFunction } from "react-router";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { motion } from "motion/react";

import ticketImage from "../../assets/tickets.png";

export const meta: MetaFunction = () => [
  { title: "ArtSpeak" },
  { name: "description", content: "Discover art events with ArtSpeak" },
];

export default function IndexRoute() {
  return (
    <Stack
      sx={{
        height: "100vh",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <Box sx={{ padding: 10 }}>
        <motion.h1
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: -50, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{
            textAlign: "center",
            margin: 0,
          }}
        >
          Welcome to ArtSpeak
        </motion.h1>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 5,
        }}
      >
        <motion.img
          src={ticketImage}
          alt="ticket"
          initial={{ x: -1000, rotate: 0, opacity: 0 }}
          animate={{ x: 0, rotate: 20, opacity: 1 }}
          transition={{ duration: 1.75, ease: "easeInOut" }}
          style={{
            maxWidth: "80%",
            maxHeight: "70vh",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </Box>
    </Stack>
  );
}
