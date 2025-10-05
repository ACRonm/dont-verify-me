import { Toast, useToastState } from "@tamagui/toast";
import { YStack } from "tamagui";
import React from "react";

export function ToastComponent() {
	const currentToast = useToastState();

	if (!currentToast || currentToast.isHandledNatively) return null;

	return (
		<Toast
			animation="200ms"
			key={currentToast.id}
			duration={currentToast.duration ?? 3000}
			enterStyle={{ opacity: 0, transform: [{ translateY: 100 }] }}
			exitStyle={{ opacity: 0, transform: [{ translateY: 100 }] }}
			transform={[{ translateY: 0 }]}
			opacity={1}
			scale={1}
			{...(currentToast.viewportName
				? { viewportName: currentToast.viewportName }
				: {})}
		>
			<YStack>
				<Toast.Title>{currentToast.title}</Toast.Title>
				{!!currentToast.message && (
					<Toast.Description>{currentToast.message}</Toast.Description>
				)}
			</YStack>
		</Toast>
	);
}
