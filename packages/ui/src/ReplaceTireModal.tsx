import { useState } from "react";
import {
	Dialog,
	Button,
	YStack,
	XStack,
	Text,
	Input,
	Spinner,
} from "tamagui";

interface ReplaceTireModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (endDate: string, endOdometer: number) => Promise<void>;
}

export function ReplaceTireModal({
	open,
	onOpenChange,
	onSubmit,
}: ReplaceTireModalProps) {
	const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
	const [endOdometer, setEndOdometer] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async () => {
		if (!endDate || !endOdometer) {
			setError("Please fill out both fields.");
			return;
		}
		setLoading(true);
		setError(null);
		try {
			await onSubmit(endDate, parseInt(endOdometer, 10));
			onOpenChange(false);
		} catch (err) {
			setError("Failed to replace tire set. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay
					key="overlay"
					animation="quick"
					opacity={0.5}
					enterStyle={{ opacity: 0 }}
					exitStyle={{ opacity: 0 }}
				/>
				<Dialog.Content
					bordered
					elevate
					key="content"
					animation="quick"
					enterStyle={{ y: "-50%", opacity: 0, scale: 0.9 }}
					exitStyle={{ y: "-50%", opacity: 0, scale: 0.95 }}
					gap="$4"
				>
					<Dialog.Title>Replace Tire Set</Dialog.Title>
					<Dialog.Description>
						Enter the final odometer reading and date for this tire set.
					</Dialog.Description>
					<YStack gap="$3">
						<XStack alignItems="center" gap="$4">
							<Text>End Date</Text>
							<Input
								value={endDate}
								onChangeText={setEndDate}
							/>
						</XStack>
						<XStack alignItems="center" gap="$4">
							<Text>End Odometer</Text>
							<Input
								placeholder="e.g., 15000"
								value={endOdometer}
								onChangeText={setEndOdometer}
								keyboardType="numeric"
							/>
						</XStack>
					</YStack>
					{error && <Text color="$red10">{error}</Text>}
					<XStack justifyContent="flex-end" gap="$3">
						<Button onPress={() => onOpenChange(false)}>Cancel</Button>
						<Button theme="accent" onPress={handleSubmit} disabled={loading}>
							{loading ? <Spinner /> : "Replace"}
						</Button>
					</XStack>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog>
	);
}
