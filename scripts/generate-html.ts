import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const buildDir = join(import.meta.dirname!, "..", "build", "client");
const manifestPath = join(buildDir, ".vite", "manifest.json");
const outputPath = join(buildDir, "index.html");

// Read the manifest
const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));

// Find the entry client file
const entryClient = manifest["src/app/entry.client.tsx"];
const rootRoute =
  manifest["src/app/root.tsx?__react-router-build-client-route"];

if (!entryClient) {
  console.error("Could not find entry.client.tsx in manifest");
  Deno.exit(1);
}

const baseUrl = "/artspeak/";

// Get CSS files from root route
const cssFiles = rootRoute?.css || [];

// Generate simple HTML for client-side rendering
const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>ArtSpeak</title>
    <link rel="icon" href="${baseUrl}favicon.ico" type="image/x-icon" />
    <link rel="apple-touch-icon" href="${baseUrl}apple-touch-icon.png" />
    ${cssFiles.map((css) => `<link rel="stylesheet" href="${baseUrl}${css}" />`).join("\n    ")}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="${baseUrl}${entryClient.file}"></script>
  </body>
</html>
`;

// Write the HTML file
writeFileSync(outputPath, html, "utf-8");

console.log(`✓ Generated index.html at ${outputPath}`);
console.log(`  Entry: ${entryClient.file}`);
if (cssFiles.length > 0) {
  console.log(`  CSS: ${cssFiles.join(", ")}`);
}
