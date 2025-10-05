import { XStack, Button, Text, useMedia, Popover, YStack } from "tamagui";
import { PlusCircle, Wrench, BarChart3, Replace } from "@tamagui/lucide-icons";
import { useRouter } from "next/navigation";

export function QuickActions({}: {}) {
	const media = useMedia();
	return (
		<>
			<XStack
				gap="$3"
				paddingVertical="$0"
				paddingHorizontal={"auto"}
				borderRadius="$4"
				backgroundColor="$background"
				borderColor="$borderColor"
				justifyContent="space-around"
				marginBottom="$4"
				marginHorizontal="$4"
				flexDirection={media.sm ? "column" : "row"}
			>
				{media.sm ? (
					<Popover placement="bottom-end">
						<Popover.Trigger asChild>
							<Button icon={PlusCircle} flex={1} theme="active" size="$4">
								Quick Actions
							</Button>
						</Popover.Trigger>
						<Popover.Content
							enterStyle={{ y: 0, opacity: 0 }}
							exitStyle={{ y: 0, opacity: 0 }}
							y={8}
							elevation="$4"
							animation={"bouncy"}
						>
							<YStack gap="$2">
								<Button
									chromeless
									size="$3"
									icon={PlusCircle}
									justifyContent="flex-start"
								>
									Log Tire Change
								</Button>
								<Button
									chromeless
									size="$3"
									icon={Replace}
									justifyContent="flex-start"
								>
									Replace Tire Set
								</Button>
								<Button
									chromeless
									size="$3"
									icon={Wrench}
									justifyContent="flex-start"
								>
									Add Service
								</Button>
								<Button
									chromeless
									size="$3"
									icon={BarChart3}
									justifyContent="flex-start"
								>
									View Stats
								</Button>
							</YStack>
						</Popover.Content>
					</Popover>
				) : (
					<>
						<Button icon={PlusCircle} flex={1} theme="active" size="$4">
							<Text>Log Tire Change</Text>
						</Button>
						<Button
							icon={Replace}
							flex={1}
							size="$4"
						>
							<Text>Replace Tire Set</Text>
						</Button>
						<Button icon={Wrench} flex={1} size="$4">
							Add Service
						</Button>
						<Button icon={BarChart3} flex={1} size="$4">
							View Stats
						</Button>
					</>
				)}
			</XStack>
		</>
	);
}
