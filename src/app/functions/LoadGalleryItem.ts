import type { LoaderFunctionArgs } from "react-router";
import { GalleryItem } from "../types/GalleryItem.ts";

const JSON_URL = "/artspeak/data/data.json";

export async function GalleryItemLoader({ params }: LoaderFunctionArgs) {
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

  const itemId = Number(params.id);
  const item = items.find((item) => item.id === itemId);

  if (!item) {
    throw new Response(`Item not found`, {
      status: 404,
    });
  }

  return { item } satisfies { item: GalleryItem };
}
