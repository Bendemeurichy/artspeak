import type { MetaFunction } from "react-router";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { useState } from "react";

import ticketImageLeft from "../../assets/tickets_left.png";
import ticketImageRight from "../../assets/tickets_right.png";

export const meta: MetaFunction = () => [
  { title: "ArtSpeak" },
  { name: "description", content: "Learn to pronounce art terms." },
];

export default function IndexRoute() {
  const navigate = useNavigate();
  const [isRouting, setIsRouting] = useState(false);

  return (
    <Stack
      sx={{
        height: "100vh",
        minHeight: "100vh",
        overflow: "hidden",
        backgroundColor: "background.paper",
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
        <motion.div
          role="link"
          tabIndex={0}
          aria-label="Go to overview"
          title="Go to overview"
          onClick={() => {
            if (isRouting) return;
            setIsRouting(true);
          }}
          onKeyDown={(e) => {
            if (e.key !== "Enter" && e.key !== " ") return;
            if (isRouting) return;
            e.preventDefault();
            setIsRouting(true);
          }}
          initial={{ x: -1000, rotate: 0, opacity: 0 }}
          animate={{ x: 0, rotate: 20, opacity: 1 }}
          whileHover={!isRouting ? { scale: 1.04 } : undefined}
          whileTap={!isRouting ? { scale: 0.97 } : undefined}
          transition={{
            duration: 1.75,
            ease: "easeInOut",
            scale: { duration: 0.12, ease: "easeOut" },
          }}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            maxWidth: "min(90%, 640px)",
            width: "100%",
            maxHeight: "70vh",
            height: "auto",
            cursor: isRouting ? "default" : "pointer",
            userSelect: "none",
            outline: "none",
            borderRadius: 12,
          }}
        >
          <motion.img
            src={ticketImageLeft}
            alt="ticket"
            style={{ pointerEvents: "none", width: "50%", height: "auto" }}
          />
          <motion.img
            src={ticketImageRight}
            alt="ticket"
            style={{ pointerEvents: "none", width: "21%", height: "auto" }}
            animate={
              isRouting
                ? { x: 250, rotate: 10, opacity: 0 }
                : { x: 0, rotate: 0, opacity: 1 }
            }
            transition={{ duration: 0.5, ease: "easeInOut" }}
            onAnimationComplete={() => {
              if (isRouting) navigate("/overview");
            }}
          />
        </motion.div>
      </Box>
    </Stack>
  );
}
