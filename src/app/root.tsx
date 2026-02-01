import { ReactNode } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { Theme } from "../theme.ts";
import "../index.css";

const isDev = import.meta.env.DEV;

export function Layout({ children }: { children: ReactNode }) {
  if (isDev) {
    // In dev mode, render full HTML structure for HydratedRouter
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
          <Meta />
          <Links />
        </head>
        <body>
          <ThemeProvider theme={Theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    );
  }

  // In production, render just the app content (no html/body tags)
  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default function Root() {
  // In dev mode, HydratedRouter uses the Layout export automatically
  // In production, we need to wrap manually
  if (isDev) {
    return <Outlet />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
