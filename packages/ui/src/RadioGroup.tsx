import { RadioGroup, XStack, Label } from "tamagui";

export function RadioGroupItem({ value, label }) {
	return (
		<XStack gap="$2" alignItems="center">
			<RadioGroup.Item value={value} id={value}>
				<RadioGroup.Indicator />
			</RadioGroup.Item>
			<Label htmlFor={value}>{label}</Label>
		</XStack>
	);
}
