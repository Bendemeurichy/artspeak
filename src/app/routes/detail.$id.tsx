import { Button, Container } from "@mui/material";
import { useNavigate } from "react-router";
import { useParams } from "react-router";

import backgroundImage from "../../assets/brick_wall.png";

export default function OverviewDetailRoute() {
    const { id } = useParams();
    const navigate = useNavigate();

    

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
            <h1>{}</h1>
            <p>Item ID: {id}</p>
        </Container>
    )
}
