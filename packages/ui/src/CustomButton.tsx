import { Button } from "tamagui";
import React from "react";

interface CustomButtonProps {
	children: React.ReactNode;
	onPress?: () => void;
	disabled?: boolean;
	icon?: any;
}

export function CustomButton({
	children,
	onPress,
	disabled,
	icon,
}: CustomButtonProps) {
	return (
		<Button onPress={onPress} disabled={disabled} icon={icon}>
			{children}
		</Button>
	);
}
