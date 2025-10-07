"use client";

import { YStack, XStack, Label, Button, Text, Image, Spinner } from "tamagui";
import { useState, useRef } from "react";
import { Upload, X, Check, AlertCircle } from "@tamagui/lucide-icons";

interface PlatformIconUploaderProps {
	platformSlug: string;
	currentIconUrl?: string | null;
	onIconUpdate: (newIconUrl: string) => void;
	supabase: any; // Supabase client instance
}

const ACCEPTED_FILE_TYPES = [
	"image/svg+xml",
	"image/png",
	"image/jpeg",
	"image/webp",
];
const MAX_FILE_SIZE = 512 * 1024; // 512KB
const BUCKET_NAME = "platform-icons";

export function PlatformIconUploader({
	platformSlug,
	currentIconUrl,
	onIconUpdate,
	supabase,
}: PlatformIconUploaderProps) {
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string>("");
	const [preview, setPreview] = useState<string | null>(currentIconUrl || null);
	const [success, setSuccess] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const validateFile = (file: File): string | null => {
		if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
			return "Invalid file type. Please upload SVG, PNG, JPEG, or WebP.";
		}
		if (file.size > MAX_FILE_SIZE) {
			return "File too large. Maximum size is 512KB.";
		}
		return null;
	};

	const handleFileSelect = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setError("");
		setSuccess(false);

		// Validate file
		const validationError = validateFile(file);
		if (validationError) {
			setError(validationError);
			return;
		}

		// Show preview
		const reader = new FileReader();
		reader.onloadend = () => {
			setPreview(reader.result as string);
		};
		reader.readAsDataURL(file);

		// Upload to Supabase Storage
		await uploadFile(file);
	};

	const uploadFile = async (file: File) => {
		setUploading(true);
		setError("");

		try {
			// Generate unique filename with timestamp
			const fileExt = file.name.split(".").pop();
			const fileName = `${platformSlug}-${Date.now()}.${fileExt}`;
			const filePath = `${fileName}`;

			// Delete old icon if exists
			if (currentIconUrl && currentIconUrl.includes(BUCKET_NAME)) {
				const oldPath = currentIconUrl.split(`${BUCKET_NAME}/`)[1];
				if (oldPath) {
					await supabase.storage.from(BUCKET_NAME).remove([oldPath]);
				}
			}

			// Upload new file
			const { data, error: uploadError } = await supabase.storage
				.from(BUCKET_NAME)
				.upload(filePath, file, {
					cacheControl: "3600",
					upsert: false,
				});

			if (uploadError) {
				throw uploadError;
			}

			// Get public URL
			const { data: publicUrlData } = supabase.storage
				.from(BUCKET_NAME)
				.getPublicUrl(filePath);

			const publicUrl = publicUrlData.publicUrl;

			// Update parent component
			onIconUpdate(publicUrl);
			setSuccess(true);
			setTimeout(() => setSuccess(false), 3000);
		} catch (err: any) {
			console.error("Upload error:", err);
			setError(err.message || "Failed to upload icon");
		} finally {
			setUploading(false);
		}
	};

	const handleRemoveIcon = async () => {
		if (!currentIconUrl) return;

		setUploading(true);
		setError("");

		try {
			// Delete from storage if it's a storage URL
			if (currentIconUrl.includes(BUCKET_NAME)) {
				const filePath = currentIconUrl.split(`${BUCKET_NAME}/`)[1];
				console.log("Deleting file from storage, filePath:", filePath);

				if (filePath) {
					const { data, error: deleteError } = await supabase.storage
						.from(BUCKET_NAME)
						.remove([filePath]);

					if (deleteError) {
						console.error("Storage delete error:", deleteError);
						throw deleteError;
					}
					console.log("Storage delete result:", data);
				}
			} else {
				console.log("Icon URL is not a storage URL, skipping storage deletion");
			}

			// Clear the icon URL in the database
			console.log("Clearing icon URL in database");
			await onIconUpdate("");
			setPreview(null);
			setSuccess(true);
			setTimeout(() => setSuccess(false), 3000);
		} catch (err: any) {
			console.error("Delete error:", err);
			setError(err.message || "Failed to remove icon");
		} finally {
			setUploading(false);
		}
	};

	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	return (
		<YStack gap="$3">
			<Label>Platform Icon</Label>
			<XStack gap="$3" alignItems="center">
				<YStack
					width={80}
					height={80}
					backgroundColor="$background"
					borderWidth={2}
					borderColor="$borderColor"
					borderRadius="$4"
					justifyContent="center"
					alignItems="center"
					overflow="hidden"
				>
					{preview ? (
						<img
							src={preview}
							alt="Platform icon preview"
							style={{
								width: "60px",
								height: "60px",
								objectFit: "contain",
							}}
						/>
					) : (
						<Text fontSize="$8" color="$color10">
							{platformSlug.charAt(0).toUpperCase()}
						</Text>
					)}
				</YStack>
				<YStack gap="$2" flex={1}>
					<XStack gap="$2">
						<Button
							size="$3"
							theme="blue"
							onPress={triggerFileInput}
							disabled={uploading}
							icon={uploading ? <Spinner /> : <Upload size={16} />}
						>
							{preview ? "Change Icon" : "Upload Icon"}
						</Button>
						{preview && (
							<Button
								size="$3"
								theme="red"
								onPress={handleRemoveIcon}
								disabled={uploading}
								icon={<X size={16} />}
							>
								Remove
							</Button>
						)}
						{success && (
							<XStack gap="$2" alignItems="center" paddingHorizontal="$3">
								<Check size={16} color="$green10" />
								<Text color="$green10" fontSize="$2">
									Success!
								</Text>
							</XStack>
						)}
					</XStack>
					<Text fontSize="$2" color="$color10">
						SVG, PNG, JPEG, or WebP (max 512KB)
					</Text>
					{error && (
						<XStack gap="$2" alignItems="center">
							<AlertCircle size={14} color="$red10" />
							<Text color="$red10" fontSize="$2">
								{error}
							</Text>
						</XStack>
					)}
				</YStack>
			</XStack>
			<input
				ref={fileInputRef}
				type="file"
				accept={ACCEPTED_FILE_TYPES.join(",")}
				onChange={handleFileSelect}
				style={{ display: "none" }}
			/>
			<Text fontSize="$2" color="$color11" fontStyle="italic">
				Tip: For best results, use square icons (1:1 aspect ratio). The icon
				will be used across the platform to represent {platformSlug}.
			</Text>
		</YStack>
	);
}
