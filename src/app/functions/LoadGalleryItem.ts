import type { LoaderFunctionArgs } from "react-router";
import { GalleryItem } from "../types/GalleryItem.ts";

export async function GalleryItemLoader({ params }: LoaderFunctionArgs) {
  const baseUrl = import.meta.env.BASE_URL || "/";

  try {
    let payload: any;

    if (typeof window !== "undefined") {
      // Client-side: fetch from the server
      const jsonUrl = `${window.location.origin}${baseUrl}data/data.json`;
      const response = await fetch(jsonUrl, {
        cache: "no-cache",
      });

      if (!response.ok) {
        throw new Response(`Failed to load data (${response.status})`, {
          status: response.status,
        });
      }

      payload = await response.json();
    } else {
      // Server-side (dev mode SSR): read file directly using Node.js
      const path = await import("node:path");
      const fs = await import("node:fs/promises");

      const dataPath = path.join(process.cwd(), "data", "data.json");
      const fileContent = await fs.readFile(dataPath, "utf-8");
      payload = JSON.parse(fileContent);
    }

    const items: GalleryItem[] = Array.isArray(payload)
      ? payload
      : (payload.items ?? []);

    const itemId = Number(params.id);
    const item = items.find((item) => item.id === itemId);

    if (!item) {
      throw new Response(`Item not found`, {
        status: 404,
      });
    }

    return { item } satisfies { item: GalleryItem };
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    console.error("Error loading gallery item:", error);
    throw new Response(`Failed to fetch data: ${error}`, {
      status: 500,
    });
  }
}
