import { XStack, Button, Text, useMedia, Popover, YStack } from "tamagui";
import { PlusCircle, Wrench, BarChart3, Replace } from "@tamagui/lucide-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ReplaceTireModal } from "./ReplaceTireModal";
import { Motorcycle, replaceTireSet } from "@dont-verify-me/shared-logic";

export function QuickActions({ motorcycle }: { motorcycle: Motorcycle }) {
	const media = useMedia();
	const router = useRouter();
	const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);

	const handleReplaceTire = async (endDate: string, endOdometer: number) => {
		if (!motorcycle.active_tire_set) {
			// This should not happen if the button is only shown when there is an active tire set
			console.error("No active tire set to replace.");
			return;
		}
		const replacedTireSet = await replaceTireSet(
			motorcycle.active_tire_set.id,
			endDate,
			endOdometer
		);
		if (replacedTireSet) {
			router.push(`/performance-report/${replacedTireSet.id}`);
		}
	};

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
									onPress={() =>
										router.push(`/add-tire-set?motorcycleId=${motorcycle.id}`)
									}
									justifyContent="flex-start"
								>
									Log Tire Change
								</Button>
								<Button
									chromeless
									size="$3"
									icon={Replace}
									onPress={() => setIsReplaceModalOpen(true)}
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
						<Button
							icon={PlusCircle}
							flex={1}
							theme="active"
							size="$4"
							onPress={() =>
								router.push(`/add-tire-set?motorcycleId=${motorcycle.id}`)
							}
						>
							<Text>Log Tire Change</Text>
						</Button>
						<Button
							icon={Replace}
							flex={1}
							size="$4"
							onPress={() => setIsReplaceModalOpen(true)}
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
			<ReplaceTireModal
				open={isReplaceModalOpen}
				onOpenChange={setIsReplaceModalOpen}
				onSubmit={handleReplaceTire}
			/>
		</>
	);
}
