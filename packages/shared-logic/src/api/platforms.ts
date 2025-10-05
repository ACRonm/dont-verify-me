import { supabase } from "./supabase";

export interface Platform {
	id: string;
	slug: string;
	name: string;
	description?: string;
	icon_url?: string;
	is_published: boolean;
	display_order: number;
	created_at: string;
	updated_at: string;
}

export interface PlatformWithArticle extends Platform {
	article?: {
		id: string;
		platform_id: string;
		title: string;
		slug: string;
		content: string;
		summary?: string;
		author_id?: string;
		is_published: boolean;
		published_at?: string;
		created_at: string;
		updated_at: string;
	};
}

// GET all platforms (admin view - includes unpublished)
export async function getAllPlatforms(): Promise<Platform[]> {
	const { data, error } = await supabase
		.from("platforms")
		.select("*")
		.order("display_order", { ascending: true })
		.order("name", { ascending: true });

	if (error) {
		console.error("Error fetching platforms:", error);
		throw error;
	}

	return data;
}

// GET published platforms only (public view)
export async function getPublishedPlatforms(): Promise<Platform[]> {
	const { data, error } = await supabase
		.from("platforms")
		.select("*")
		.eq("is_published", true)
		.order("display_order", { ascending: true })
		.order("name", { ascending: true });

	if (error) {
		console.error("Error fetching published platforms:", error);
		throw error;
	}

	return data;
}

// GET platform by slug with article
export async function getPlatformBySlug(
	slug: string
): Promise<PlatformWithArticle | null> {
	const { data, error } = await supabase
		.from("platforms")
		.select(
			`
      *,
      articles (*)
    `
		)
		.eq("slug", slug)
		.eq("is_published", true)
		.single();

	if (error) {
		console.error("Error fetching platform by slug:", error);
		return null;
	}

	// Handle the articles array from Supabase
	const articles = (data as any).articles;
	return {
		...data,
		article: articles && articles.length > 0 ? articles[0] : undefined,
	};
}

// GET platform by slug for admin (includes unpublished)
export async function getPlatformBySlugAdmin(
	slug: string
): Promise<PlatformWithArticle | null> {
	const { data, error } = await supabase
		.from("platforms")
		.select(
			`
      *,
      articles (*)
    `
		)
		.eq("slug", slug)
		.single();

	if (error) {
		console.error("Error fetching platform by slug:", error);
		return null;
	}

	// Handle the articles array from Supabase
	const articles = (data as any).articles;
	return {
		...data,
		article: articles && articles.length > 0 ? articles[0] : undefined,
	};
}

// CREATE platform
export async function createPlatform(
	platform: Omit<Platform, "id" | "created_at" | "updated_at">
): Promise<Platform> {
	const { data, error } = await supabase
		.from("platforms")
		.insert(platform)
		.select()
		.single();

	if (error) {
		console.error("Error creating platform:", error);
		throw error;
	}

	return data;
}

// UPDATE platform
export async function updatePlatform(
	id: string,
	updates: Partial<Platform>
): Promise<Platform> {
	const { data, error } = await supabase
		.from("platforms")
		.update(updates)
		.eq("id", id)
		.select()
		.single();

	if (error) {
		console.error("Error updating platform:", error);
		throw error;
	}

	return data;
}

// DELETE platform
export async function deletePlatform(id: string): Promise<void> {
	const { error } = await supabase.from("platforms").delete().eq("id", id);

	if (error) {
		console.error("Error deleting platform:", error);
		throw error;
	}
}

// TOGGLE publish status
export async function togglePlatformPublish(id: string): Promise<Platform> {
	// First, get current status
	const { data: current, error: fetchError } = await supabase
		.from("platforms")
		.select("is_published")
		.eq("id", id)
		.single();

	if (fetchError) throw fetchError;

	// Then toggle it
	return updatePlatform(id, { is_published: !current.is_published });
}
