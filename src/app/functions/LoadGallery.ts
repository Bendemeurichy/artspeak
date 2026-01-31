import { GalleryItem } from "../types/GalleryItem.ts";
import { GalleryLoaderData } from "../types/GalleryLoaderData.ts";

const JSON_URL = "/artspeak/data/data.json";

export async function GalleryLoader() {
  const response = await fetch(JSON_URL, {
    cache: "no-cache",
  });

  if (!response.ok) {
    throw new Response(`Failed to load data (${response.status})`, {
      status: response.status,
    });
  }

  const payload = await response.json();
  const items: GalleryItem[] = Array.isArray(payload)
    ? payload
    : (payload.items ?? []);

  return { items } satisfies GalleryLoaderData;
}
