import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useLoaderData, useNavigate } from "react-router";

import backgroundImage from "../../assets/brick_wall.png";
import { GalleryItem } from "../types/GalleryItem.ts";
import { GalleryItemLoader } from "../functions/LoadGalleryItem.ts";
import { Alert, Button, Container } from "@mui/material";

export const loader = GalleryItemLoader;

export default function OverviewDetailRoute() {
	const navigate = useNavigate();

	const { item } = useLoaderData() as { item: GalleryItem };

	if (!item) {
		return (
			<Container maxWidth="md" sx={{ py: 4 }}>
				<Alert severity="info">No item found for given id.</Alert>
			</Container>
		);
	}

	return (
		<Container
			maxWidth="md"
			sx={{
				py: 4,
				minHeight: "100vh",
				backgroundImage: `url(${backgroundImage})`,
				backgroundRepeat: "repeat",
				backgroundSize: "auto",
				color: "white",
			}}>
			<Button onClick={() => navigate(-1)} variant="contained">
				Back
			</Button>
			<h1>{item.name ?? "Error loading name"}</h1>
			<Card sx={{ display: "flex" }}>
				<Box sx={{ display: "flex", flexDirection: "column" }}>
					<CardContent sx={{ flex: "1 0 auto", width: 200 }}>
						<Typography component="div" variant="h5" sx={{ textAlign: "center" }}>
							{item.name}
						</Typography>
					</CardContent>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							pl: 1,
							pb: 1,
						}}>
						<IconButton aria-label="play/pause">
							<PlayArrowIcon sx={{ height: 50, width: 50 }} />
						</IconButton>
					</Box>
				</Box>
				<CardMedia
					component="img"
					sx={{ width: 150, padding: 2 }}
					image={item.imagePath}
					alt={item.name}
				/>
			</Card>
		</Container>
	);
}
