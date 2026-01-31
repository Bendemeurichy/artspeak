import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { MetaFunction, useLoaderData, useNavigate } from "react-router";

import Grid from "@mui/material/Grid";
import backgroundImage from "../../assets/brick_wall.png";
import { GalleryItem } from "../types/GalleryItem.ts";
import { GalleryItemLoader } from "../functions/LoadGalleryItem.ts";
import { Alert, Button, Container } from "@mui/material";
import AudioPlayer from "../components/tts/audioPlayer.tsx";

export const meta: MetaFunction = () => [
  { title: "Detail | ArtSpeak" },
  {
    name: "description",
    content: "Browse items from the overview JSON feed.",
  },
];

export const clientLoader = GalleryItemLoader;

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
    <Grid
      maxWidth="md"
      sx={{
        py: 4,
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
        color: "white",
        padding: 2,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <Button
        onClick={() => navigate(-1)}
        variant="contained"
        size="large"
        sx={{ width: "fit-content" }}
      >
        Back
      </Button>
      <Box>
        {item.audioPath ? (
          <AudioPlayer
            word={item.name}
            img={item.imagePath}
            path={item.audioPath}
          />
        ) : (
          <Typography variant="h1">"Error loading item"</Typography>
        )}
      </Box>
    </Grid>
  );
}
