import type { LoaderFunctionArgs } from "react-router";
import { GalleryItem } from "../types/GalleryItem.ts";
import { GalleryLoaderData } from "../types/GalleryLoaderData.ts";

const JSON_URL = "/data/data.json";

export async function GalleryLoader({ request }: LoaderFunctionArgs) {
	const response = await fetch(new URL(JSON_URL, request.url), {
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
