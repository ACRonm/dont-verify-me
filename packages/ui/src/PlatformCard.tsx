import { Card, YStack, XStack, H3, Text, Button } from "tamagui";
import { Edit3, Eye, EyeOff, Trash2 } from "@tamagui/lucide-icons";
import type { Platform } from "@dont-verify-me/shared-logic";

interface PlatformCardProps {
	platform: Platform;
	hasArticle: boolean;
	onEdit: () => void;
	onTogglePublish: () => void;
	onDelete: () => void;
}

export function PlatformCard({
	platform,
	hasArticle,
	onEdit,
	onTogglePublish,
	onDelete,
}: PlatformCardProps) {
	return (
		<Card
			elevate
			bordered
			padding="$4"
			backgroundColor="$background"
			hoverStyle={{ scale: 0.98 }}
		>
			<YStack gap="$3">
				<XStack justifyContent="space-between" alignItems="center">
				<H3>{platform.name}</H3>
				<XStack gap="$2">
					{platform.is_published ? (
						<Eye size={20} color="$green10" />
					) : (
						<EyeOff size={20} color="$color10" />
					)}
				</XStack>
			</XStack>				{platform.description && (
					<Text color="$color11" fontSize="$3">
						{platform.description}
					</Text>
				)}

				<XStack gap="$2" marginTop="$2">
					<Button
						size="$3"
						onPress={onEdit}
						theme="blue"
						icon={<Edit3 size={16} />}
					>
						{hasArticle ? "Edit Article" : "Create Article"}
					</Button>

					<Button
						size="$3"
						onPress={onTogglePublish}
						theme={platform.is_published ? "gray" : "green"}
					>
						{platform.is_published ? "Unpublish" : "Publish"}
					</Button>

					<Button
						size="$3"
						onPress={onDelete}
						theme="red"
						icon={<Trash2 size={16} />}
					/>
				</XStack>
			</YStack>
		</Card>
	);
}
