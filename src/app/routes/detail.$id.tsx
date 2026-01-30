import { Alert, Button, Container } from "@mui/material";
import { useLoaderData, useNavigate } from "react-router";
import { useParams } from "react-router";

import backgroundImage from "../../assets/brick_wall.png";
import { GalleryItem } from "../types/GalleryItem.ts";
import { GalleryItemLoader } from "../functions/LoadGalleryItem.ts";

export const loader = GalleryItemLoader;

export default function OverviewDetailRoute() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { item }= useLoaderData() as { item: GalleryItem };

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
            }}
        >
            <Button 
                onClick={() => navigate(-1)}
                variant="contained"
            >
                Back
            </Button>
            <h1>{item.name ?? "Error loading name"}</h1>
            <p>Item ID: {id}</p>
        </Container>
    )
}
