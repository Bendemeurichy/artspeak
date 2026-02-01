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

  console.error("Route error:", error);

  let message: string;
  let details: string | undefined;
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = `${error.status} ${error.statusText}`;
    details = error.data?.message || JSON.stringify(error.data);
  } else if (error instanceof Error) {
    message = error.message;
    stack = error.stack;
  } else {
    message = "Unknown error";
    details = JSON.stringify(error);
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Alert severity="error">
        <div>
          <strong>Error:</strong> {message}
        </div>
        {details && (
          <div style={{ marginTop: "8px", fontSize: "0.9em" }}>
            <strong>Details:</strong> {details}
          </div>
        )}
        {stack && (
          <pre
            style={{ marginTop: "8px", fontSize: "0.8em", overflow: "auto" }}
          >
            {stack}
          </pre>
        )}
        <div style={{ marginTop: "8px", fontSize: "0.9em" }}>
          <strong>Current URL:</strong> {window.location.href}
        </div>
        <div style={{ marginTop: "4px", fontSize: "0.9em" }}>
          <strong>Base URL:</strong> {import.meta.env.BASE_URL || "/"}
        </div>
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
