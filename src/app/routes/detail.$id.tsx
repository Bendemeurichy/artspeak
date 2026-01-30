import { Alert, Button, Container } from "@mui/material";
import { useLoaderData, useNavigate } from "react-router";
import { useParams } from "react-router";

import backgroundImage from "../../assets/brick_wall.png";
import { GalleryLoader } from "../functions/LoadGallery.ts";
import { GalleryLoaderData } from "../types/GalleryLoaderData.ts";
import { GalleryItem } from "../types/GalleryItem.ts";

export const loader = GalleryLoader;

export default function OverviewDetailRoute() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { items } = useLoaderData() as GalleryLoaderData; //TEMP LOADING ALL ITEMS, CHANGE TO LOADING BY ID
    const item: GalleryItem | undefined = items.find((item) => item.id === Number(id));

    if (!items.length) {
        return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Alert severity="info">No items found in the JSON file.</Alert>
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
            <h1>{item?.name ?? "Error loading name"}</h1>
            <p>Item ID: {id}</p>
        </Container>
    )
}
