import { YStack, XStack, Input, TextArea, Label, Button, Text } from "tamagui";
import { useState } from "react";
import type { Platform } from "@dont-verify-me/shared-logic";
import { generateSlug } from "@dont-verify-me/shared-logic";
import { PlatformIconUploader } from "./PlatformIconUploader";

interface PlatformFormProps {
	initialData?: Partial<Platform>;
	onSave: (platform: Partial<Platform>) => Promise<void>;
	onCancel: () => void;
	supabase?: any; // Optional Supabase client for icon uploads
}

export function PlatformForm({
	initialData,
	onSave,
	onCancel,
	supabase,
}: PlatformFormProps) {
	const [name, setName] = useState(initialData?.name || "");
	const [slug, setSlug] = useState(initialData?.slug || "");
	const [description, setDescription] = useState(
		initialData?.description || ""
	);
	const [iconUrl, setIconUrl] = useState(initialData?.icon_url || "");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleNameChange = (newName: string) => {
		setName(newName);
		// Auto-generate slug from name if creating new platform
		if (!initialData?.id) {
			setSlug(generateSlug(newName));
		}
	};

	const handleSave = async () => {
		if (!name.trim() || !slug.trim()) {
			setError("Name and slug are required");
			return;
		}

		setLoading(true);
		setError("");

		try {
			await onSave({
				name: name.trim(),
				slug: slug.trim(),
				description: description.trim(),
				icon_url: iconUrl.trim() || undefined,
				is_published: initialData?.is_published || false,
				display_order: initialData?.display_order || 0,
			});
		} catch (err) {
			setError("Failed to save platform");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<YStack
			gap="$4"
			padding="$4"
			backgroundColor="$background"
			borderRadius="$4"
		>
			<Text fontSize="$6" fontWeight="bold">
				{initialData?.id ? "Edit" : "Create"} Platform
			</Text>
			<YStack gap="$2">
				<Label htmlFor="name">Platform Name</Label>
				<Input
					id="name"
					size="$4"
					value={name}
					onChangeText={handleNameChange}
					placeholder="e.g., Reddit"
				/>
			</YStack>
			<YStack gap="$2">
				<Label htmlFor="slug">URL Slug</Label>
				<Input
					id="slug"
					size="$4"
					value={slug}
					onChangeText={setSlug}
					placeholder="e.g., reddit"
				/>
				<Text fontSize="$2" color="$color10">
					Will be used in URL: /platforms/{slug}
				</Text>
			</YStack>
			<YStack gap="$2">
				<Label htmlFor="description">Description (Optional)</Label>
				<TextArea
					id="description"
					size="$4"
					value={description}
					onChangeText={setDescription}
					placeholder="Brief description of this platform"
					numberOfLines={3}
				/>
			</YStack>
			{supabase && (
				<PlatformIconUploader
					platformSlug={slug || "temp"}
					currentIconUrl={iconUrl}
					onIconUpdate={setIconUrl}
					supabase={supabase}
				/>
			)}
			{error && (
				<Text color="$red10" fontSize="$3">
					{error}
				</Text>
			)}
			<XStack gap="$3" justifyContent="flex-end">
				<Button onPress={onCancel} theme="gray" disabled={loading}>
					Cancel
				</Button>
				<Button onPress={handleSave} theme="blue" disabled={loading}>
					{loading ? "Saving..." : "Save Platform"}
				</Button>
			</XStack>
		</YStack>
	);
}
