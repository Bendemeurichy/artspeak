import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import {
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useRouteError,
} from "react-router";
import {
	Alert,
	Card,
	CardContent,
	CardMedia,
	CircularProgress,
	Container,
	List,
	ListItem,
	Stack,
	Typography,
} from "@mui/material";

const JSON_URL = "/data/data.json";

type JsonItem = {
  id: string;
  name?: string;
  imagePath?: string;
};

type LoaderData = {
  items: JsonItem[];
};

export const meta: MetaFunction = () => [
  { title: "Overview | ArtSpeak" },
  {
    name: "description",
    content: "Browse items from the overview JSON feed.",
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const response = await fetch(new URL(JSON_URL, request.url), {
    cache: "no-cache",
  });

  if (!response.ok) {
    throw new Response(`Failed to load data (${response.status})`, {
      status: response.status,
    });
  }

  const payload = await response.json();
  const items: JsonItem[] = Array.isArray(payload)
    ? payload
    : (payload.items ?? []);

  return { items } satisfies LoaderData;
}

export default function OverviewRoute() {
  const { items } = useLoaderData() as LoaderData;

  if (!items.length) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">No items found in the JSON file.</Alert>
      </Container>
    );
  }

	return (
		<Container maxWidth="md" sx={{ py: 4 }}>
			<Stack spacing={2}>
				<Typography variant="h4" component="h1">
					Galerij
				</Typography>
				<List>
					{items.map((item) => (
						<ListItem
							key={item.id}
							divider
							sx={{ width: "100%" }}>
							<Card
								sx={{ 
                  width: "100%", 
                  backgroundColor: "ivory",
                  border: "1px solid #ccc",
                }}
								component={Link}
								to={`/detail/${item.id}`}>
								<CardMedia
                  component="img"
                  sx={{
                    height: 250,
                    objectFit: "contain",
                    padding: 2,
                  }}
                  image={item.imagePath}
                  alt={item.name}
                />
								<CardContent>
									<Typography
										gutterBottom
										variant="h5"
										component="div">
										{item.name}
									</Typography>
								</CardContent>
							</Card>
						</ListItem>
					))}
				</List>
			</Stack>
		</Container>
	);
}

export function HydrateFallback() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack alignItems="center">
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Loading data...
        </Typography>
      </Stack>
    </Container>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? error.statusText
    : error instanceof Error
      ? error.message
      : "Unexpected error loading overview.";

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Alert severity="error">{message}</Alert>
    </Container>
  );
}
