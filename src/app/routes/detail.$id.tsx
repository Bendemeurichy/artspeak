import { Button, Container } from "@mui/material";
import { useNavigate } from "react-router";
import { useParams } from "react-router";

export default function OverviewDetailRoute() {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <Container sx={{ py: 4 }}>
            <Button 
                onClick={() => navigate(-1)}
                variant="contained"
            >
                Back
            </Button>
            <h1>Overview Detail Route</h1>
            <p>Item ID: {id}</p>
        </Container>
    )
}
