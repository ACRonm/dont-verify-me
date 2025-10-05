import { supabase } from "./supabase";

export interface Article {
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
}

export interface ArticleWithPlatform extends Article {
	platform?: {
		id: string;
		name: string;
		slug: string;
	};
}

// GET all articles (admin view)
export async function getAllArticles(): Promise<ArticleWithPlatform[]> {
	const { data, error } = await supabase
		.from("articles")
		.select(
			`
      *,
      platform:platforms (id, name, slug)
    `
		)
		.order("updated_at", { ascending: false });

	if (error) {
		console.error("Error fetching articles:", error);
		throw error;
	}

	return data;
}

// GET article by ID
export async function getArticleById(
	id: string
): Promise<ArticleWithPlatform | null> {
	const { data, error } = await supabase
		.from("articles")
		.select(
			`
      *,
      platform:platforms (id, name, slug)
    `
		)
		.eq("id", id)
		.single();

	if (error) {
		console.error("Error fetching article:", error);
		return null;
	}

	return data;
}

// GET article by platform ID
export async function getArticleByPlatformId(
	platformId: string
): Promise<Article | null> {
	const { data, error } = await supabase
		.from("articles")
		.select("*")
		.eq("platform_id", platformId)
		.single();

	if (error) {
		// No article exists for this platform yet
		if (error.code === "PGRST116") return null;
		console.error("Error fetching article by platform:", error);
		return null;
	}

	return data;
}

// CREATE article
export async function createArticle(
	article: Omit<Article, "id" | "created_at" | "updated_at" | "author_id">
): Promise<Article> {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) throw new Error("Not authenticated");

	const { data, error } = await supabase
		.from("articles")
		.insert({
			...article,
			author_id: user.id,
		})
		.select()
		.single();

	if (error) {
		console.error("Error creating article:", error);
		throw error;
	}

	return data;
}

// UPDATE article
export async function updateArticle(
	id: string,
	updates: Partial<Article>
): Promise<Article> {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) throw new Error("Not authenticated");

	const { data, error } = await supabase
		.from("articles")
		.update({
			...updates,
			author_id: user.id, // Track last editor
		})
		.eq("id", id)
		.select()
		.single();

	if (error) {
		console.error("Error updating article:", error);
		throw error;
	}

	return data;
}

// DELETE article
export async function deleteArticle(id: string): Promise<void> {
	const { error } = await supabase.from("articles").delete().eq("id", id);

	if (error) {
		console.error("Error deleting article:", error);
		throw error;
	}
}

// TOGGLE publish status
export async function toggleArticlePublish(id: string): Promise<Article> {
	const { data: current, error: fetchError } = await supabase
		.from("articles")
		.select("is_published")
		.eq("id", id)
		.single();

	if (fetchError) throw fetchError;

	const updates: Partial<Article> = {
		is_published: !current.is_published,
	};

	// Set published_at timestamp when publishing
	if (!current.is_published) {
		updates.published_at = new Date().toISOString();
	}

	return updateArticle(id, updates);
}

// Helper function to generate slug from title
export function generateSlug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^\w\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.trim();
}
