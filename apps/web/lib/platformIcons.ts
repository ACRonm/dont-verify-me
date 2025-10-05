/**
 * Platform Icon Utilities
 * Helper functions for managing platform icons
 */

/**
 * Get the icon URL for a platform
 * Falls back to a placeholder if no icon exists
 */
export function getPlatformIconUrl(
	slug: string,
	iconUrl?: string | null
): string {
	if (iconUrl) {
		return iconUrl;
	}
	// Default path for platform icons
	return `/icons/platforms/${slug}.svg`;
}

/**
 * Check if a platform icon exists
 * Note: This is a client-side check based on URL pattern
 */
export function hasCustomIcon(iconUrl?: string | null): boolean {
	return Boolean(iconUrl && iconUrl.trim().length > 0);
}

/**
 * List of popular platforms with known icon sources
 * Use this as a reference when adding new platforms
 */
export const PLATFORM_ICON_SOURCES = {
	reddit: "https://simpleicons.org/?q=reddit",
	facebook: "https://simpleicons.org/?q=facebook",
	discord: "https://simpleicons.org/?q=discord",
	youtube: "https://simpleicons.org/?q=youtube",
	instagram: "https://simpleicons.org/?q=instagram",
	twitter: "https://simpleicons.org/?q=twitter",
	tiktok: "https://simpleicons.org/?q=tiktok",
	snapchat: "https://simpleicons.org/?q=snapchat",
	twitch: "https://simpleicons.org/?q=twitch",
	linkedin: "https://simpleicons.org/?q=linkedin",
} as const;

/**
 * Default platform colors (for fallback display)
 */
export const PLATFORM_COLORS = {
	reddit: "#dc3700",
	facebook: "#1877F2",
	discord: "#5865F2",
	youtube: "#FF0000",
	instagram: "#E4405F",
	twitter: "#1DA1F2",
	tiktok: "#000000",
	snapchat: "#FFFC00",
	twitch: "#9146FF",
	linkedin: "#0A66C2",
} as const;
