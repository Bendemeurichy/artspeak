import "./App.css";
import { motion } from "motion/react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

function App() {
	return (
		<Stack
			sx={{
				height: "100vh",
				overflow: "hidden",
			}}>
			<Box sx={{ padding: 2, paddingTop: 4 }}>
				<motion.h1
					initial={{ y: -50, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 1.5, ease: "easeInOut" }}
					style={{
						textAlign: "center",
						margin: 0,
					}}>
					Welcome to ArtSpeak
				</motion.h1>
			</Box>
			<Box
				sx={{
					flexGrow: 1,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					padding: 2,
				}}>
				<motion.img
					src="src/assets/tickets.png"
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

export default App;
