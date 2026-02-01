import { StrictMode, startTransition } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { HydratedRouter } from "react-router/dom";
import Root from "./root.tsx";
import IndexRoute from "./routes/_index.tsx";
import OverviewRoute from "./routes/overview.tsx";
import DetailRoute from "./routes/detail.$id.tsx";
import { GalleryLoader } from "./functions/LoadGallery.ts";
import { GalleryItemLoader } from "./functions/LoadGalleryItem.ts";
import { Container, Alert } from "@mui/material";
import { useRouteError, isRouteErrorResponse } from "react-router";

// Error Boundary Component
function ErrorBoundary() {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? error.statusText
    : error instanceof Error
      ? error.message
      : "Unknown error";

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Alert severity="error">
        <strong>Error:</strong> {message}
      </Alert>
    </Container>
  );
}

// Check if we're in development mode (using Vite's dev server)
const isDev = import.meta.env.DEV;

if (isDev) {
  // In dev mode, use HydratedRouter which works with React Router's Vite plugin
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <HydratedRouter />
      </StrictMode>,
    );
  });
} else {
  // In production, use createBrowserRouter with manual route configuration
  const routes = [
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          index: true,
          element: <IndexRoute />,
        },
        {
          path: "overview",
          element: <OverviewRoute />,
          loader: GalleryLoader,
          errorElement: <ErrorBoundary />,
        },
        {
          path: "detail/:id",
          element: <DetailRoute />,
          loader: GalleryItemLoader,
          errorElement: <ErrorBoundary />,
        },
      ],
    },
  ];

  const router = createBrowserRouter(routes, {
    basename: import.meta.env.BASE_URL || "/",
  });

  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }

  createRoot(rootElement).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
}
