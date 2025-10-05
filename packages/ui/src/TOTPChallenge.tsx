"use client";

import { useState } from "react";
import { YStack, XStack, Text, Input, Button, Card, Spinner } from "tamagui";

interface TOTPChallengeProps {
	onSuccess: () => void;
	listFactorsFunction: () => Promise<{
		totp: Array<{ id: string; friendly_name?: string }>;
	}>;
	challengeFunction: (factorId: string) => Promise<{ id: string }>;
	verifyFunction: (
		factorId: string,
		challengeId: string,
		code: string
	) => Promise<any>;
}

export function TOTPChallenge({
	onSuccess,
	listFactorsFunction,
	challengeFunction,
	verifyFunction,
}: TOTPChallengeProps) {
	const [verifyCode, setVerifyCode] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async () => {
		if (verifyCode.length !== 6) {
			setError("Please enter a 6-digit code");
			return;
		}

		setError("");
		setLoading(true);

		try {
			const factors = await listFactorsFunction();
			const totpFactor = factors.totp[0];

			if (!totpFactor) {
				throw new Error("No TOTP factors found!");
			}

			const factorId = totpFactor.id;
			const challenge = await challengeFunction(factorId);
			await verifyFunction(factorId, challenge.id, verifyCode);
			onSuccess();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Verification failed");
		} finally {
			setLoading(false);
		}
	};

	const handleCodeChange = (text: string) => {
		// Only allow digits and limit to 6 characters
		const cleaned = text.replace(/\D/g, "").slice(0, 6);
		setVerifyCode(cleaned);

		// Auto-submit when 6 digits are entered
		if (cleaned.length === 6) {
			setTimeout(() => {
				handleSubmit();
			}, 100);
		}
	};

	return (
		<Card elevate bordered padding="$6" maxWidth={400} width="100%">
			<YStack gap="$4" alignItems="center">
				<Text fontSize={24} fontWeight="bold" textAlign="center">
					Code
				</Text>

				<Text fontSize={14} color="$color11" textAlign="center">
					(***) *** **73
				</Text>

				{/* Code input boxes */}
				<XStack gap="$2" justifyContent="center" width="100%">
					{[0, 1, 2, 3].map((index) => (
						<YStack
							key={index}
							backgroundColor="$gray5"
							borderRadius="$4"
							width={48}
							height={56}
							alignItems="center"
							justifyContent="center"
						>
							<Text fontSize={24} fontWeight="bold">
								{verifyCode[index] || ""}
							</Text>
						</YStack>
					))}
				</XStack>

				{/* Hidden input for code entry */}
				<Input
					value={verifyCode}
					onChangeText={handleCodeChange}
					keyboardType="number-pad"
					maxLength={6}
					autoFocus
					opacity={0}
					height={0}
					width={0}
					position="absolute"
				/>

				<YStack width="100%" gap="$2">
					<Button
						size="$3"
						onPress={() => {
							setVerifyCode("");
							setError("");
						}}
						chromeless
						color="$blue10"
					>
						<XStack gap="$2" alignItems="center">
							<Text fontSize={14} color="$blue10">
								↻ Resend OTP
							</Text>
						</XStack>
					</Button>

					<Button
						size="$3"
						onPress={() => {
							/* Send code to email logic if needed */
						}}
						chromeless
					>
						<XStack gap="$2" alignItems="center">
							<Text fontSize={14}>✉ Send code to email</Text>
						</XStack>
					</Button>
				</YStack>

				{error && (
					<Text color="$red10" fontSize={14} textAlign="center">
						{error}
					</Text>
				)}

				{loading && <Spinner size="small" />}

				<Text fontSize={12} color="$gray10" textAlign="center">
					🔒 Encrypted
				</Text>
			</YStack>
		</Card>
	);
}
