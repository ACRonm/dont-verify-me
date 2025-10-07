/**
 * Platform Icon Storage Utilities
 * Helper functions for managing platform icons in Supabase Storage
 */

import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET_NAME = "platform-icons";
const MAX_FILE_SIZE = 512 * 1024; // 512KB
const ACCEPTED_MIME_TYPES = [
	"image/svg+xml",
	"image/png",
	"image/jpeg",
	"image/webp",
];

export interface UploadIconResult {
	success: boolean;
	publicUrl?: string;
	error?: string;
}

export interface DeleteIconResult {
	success: boolean;
	error?: string;
}

/**
 * Upload a platform icon to Supabase Storage
 * @param supabase - Supabase client instance
 * @param file - The file to upload
 * @param platformSlug - The platform slug for naming
 * @param oldIconUrl - Optional existing icon URL to delete
 * @returns Upload result with public URL or error
 */
export async function uploadPlatformIcon(
	supabase: SupabaseClient,
	file: File,
	platformSlug: string,
	oldIconUrl?: string | null
): Promise<UploadIconResult> {
	try {
		// Validate file type
		if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
			return {
				success: false,
				error: "Invalid file type. Please upload SVG, PNG, JPEG, or WebP.",
			};
		}

		// Validate file size
		if (file.size > MAX_FILE_SIZE) {
			return {
				success: false,
				error: "File too large. Maximum size is 512KB.",
			};
		}

		// Delete old icon if exists
		if (oldIconUrl && oldIconUrl.includes(BUCKET_NAME)) {
			const oldPath = extractPathFromUrl(oldIconUrl);
			if (oldPath) {
				await supabase.storage.from(BUCKET_NAME).remove([oldPath]);
			}
		}

		// Generate unique filename
		const fileExt = file.name.split(".").pop() || "png";
		const fileName = `${platformSlug}-${Date.now()}.${fileExt}`;

		// Upload file
		const { data, error } = await supabase.storage
			.from(BUCKET_NAME)
			.upload(fileName, file, {
				cacheControl: "3600",
				upsert: false,
			});

		if (error) {
			return {
				success: false,
				error: error.message,
			};
		}

		// Get public URL
		const {
			data: { publicUrl },
		} = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);

		return {
			success: true,
			publicUrl,
		};
	} catch (error: any) {
		return {
			success: false,
			error: error.message || "Failed to upload icon",
		};
	}
}

/**
 * Delete a platform icon from Supabase Storage
 * @param supabase - Supabase client instance
 * @param iconUrl - The icon URL to delete
 * @returns Delete result
 */
export async function deletePlatformIcon(
	supabase: SupabaseClient,
	iconUrl: string
): Promise<DeleteIconResult> {
	try {
		if (!iconUrl.includes(BUCKET_NAME)) {
			return {
				success: false,
				error: "Icon URL is not from Supabase Storage",
			};
		}

		const filePath = extractPathFromUrl(iconUrl);
		if (!filePath) {
			return {
				success: false,
				error: "Could not extract file path from URL",
			};
		}

		const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);

		if (error) {
			return {
				success: false,
				error: error.message,
			};
		}

		return {
			success: true,
		};
	} catch (error: any) {
		return {
			success: false,
			error: error.message || "Failed to delete icon",
		};
	}
}

/**
 * Extract file path from Supabase Storage URL
 * @param url - Full storage URL
 * @returns File path or null
 */
function extractPathFromUrl(url: string): string | null {
	const parts = url.split(`${BUCKET_NAME}/`);
	return parts.length > 1 ? parts[1] : null;
}

/**
 * Check if a URL is a Supabase Storage URL
 * @param url - URL to check
 * @returns True if URL is from Supabase Storage
 */
export function isStorageUrl(url: string | null | undefined): boolean {
	if (!url) return false;
	return url.includes(BUCKET_NAME);
}

/**
 * Get the display URL for a platform icon
 * @param slug - Platform slug (unused, kept for compatibility)
 * @param iconUrl - Custom icon URL from database
 * @returns URL to display or null if not set
 */
export function getPlatformIconUrl(
	slug: string,
	iconUrl?: string | null
): string | null {
	return iconUrl || null;
}
