import { serveDir } from "jsr:@std/http@1/file-server";
import { join } from "jsr:@std/path@1";

const port = 8080;
const buildDir = "./build/client";

console.log(`\n🚀 Preview server starting...\n`);
console.log(`   Local: http://localhost:${port}/artspeak/`);
console.log(`   Build directory: ${buildDir}\n`);

Deno.serve({ port }, async (req) => {
  const url = new URL(req.url);

  // Redirect root to /artspeak/
  if (url.pathname === "/") {
    return Response.redirect(`http://localhost:${port}/artspeak/`, 302);
  }

  // Handle /artspeak/ paths
  if (url.pathname.startsWith("/artspeak/")) {
    // Remove /artspeak prefix
    const filePath = url.pathname.slice("/artspeak".length) || "/";

    // Create a new request with the modified path
    const newUrl = new URL(req.url);
    newUrl.pathname = filePath;
    const newReq = new Request(newUrl, req);

    try {
      const response = await serveDir(newReq, {
        fsRoot: buildDir,
        quiet: true,
      });

      // If file not found and it's not an asset, serve index.html for client-side routing
      if (response.status === 404 && !filePath.includes(".")) {
        const indexPath = join(buildDir, "index.html");
        const indexFile = await Deno.readFile(indexPath);
        return new Response(indexFile, {
          status: 200,
          headers: {
            "content-type": "text/html; charset=utf-8",
          },
        });
      }

      return response;
    } catch (error) {
      console.error("Error serving file:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }

  // Any other path
  return new Response("Not Found - Try http://localhost:8080/artspeak/", {
    status: 404,
  });
});
