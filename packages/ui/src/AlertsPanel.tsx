import { Card, YStack, H2, Separator, XStack, Text } from "tamagui";
import { AlertTriangle, Info, Wrench } from "@tamagui/lucide-icons";

const AlertItem = ({ icon, color, text }) => (
	<XStack gap="$3" alignItems="center">
		{icon({ color })}
		<Text fontSize="$4" color="$color11">
			{text}
		</Text>
	</XStack>
);

export function AlertsPanel() {
	return (
		<Card elevate bordered padding="$4" flex={1}>
			<YStack gap="$3">
				<H2 fontSize="$6">Alerts & Notifications</H2>
				<Separator />
				<YStack gap="$3">
					<AlertItem
						icon={AlertTriangle}
						color="$red10"
						text="Rear tire pressure is low"
					/>
					<AlertItem
						icon={Wrench}
						color="$orange10"
						text="Service due in 250 miles"
					/>
					<AlertItem
						icon={Info}
						color="$blue10"
						text="New maintenance log available"
					/>
				</YStack>
			</YStack>
		</Card>
	);
}
