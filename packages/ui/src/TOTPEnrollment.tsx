"use client";

import { useState, useEffect } from "react";
import { YStack, XStack, Text, Input, Button, Spinner color="$accent" } from "tamagui";

interface TOTPEnrollmentProps {
	onEnrolled: () => void;
	onCancelled: () => void;
	enrollFunction: () => Promise<{
		id: string;
		totp: { qr_code: string; secret: string; uri: string };
	}>;
	challengeFunction: (factorId: string) => Promise<{ id: string }>;
	verifyFunction: (
		factorId: string,
		challengeId: string,
		code: string
	) => Promise<any>;
	unenrollFunction: (factorId: string) => Promise<{ id: string }>;
}

export function TOTPEnrollment({
	onEnrolled,
	onCancelled,
	enrollFunction,
	challengeFunction,
	verifyFunction,
	unenrollFunction,
}: TOTPEnrollmentProps) {
	const [factorId, setFactorId] = useState("");
	const [qrCode, setQRCode] = useState("");
	const [secret, setSecret] = useState("");
	const [verifyCode, setVerifyCode] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	const [verifying, setVerifying] = useState(false);
	const [isVerified, setIsVerified] = useState(false);

	useEffect(() => {
		let isSubscribed = true;

		(async () => {
			try {
				const data = await enrollFunction();
				if (!isSubscribed) {
					return;
				}
				setFactorId(data.id);
				setQRCode(data.totp.qr_code);
				setSecret(data.totp.secret);
			} catch (err) {
				if (!isSubscribed) return;
				console.error("Enrollment error:", err);
				setError(err instanceof Error ? err.message : "Failed to enroll");
			} finally {
				if (isSubscribed) {
					setLoading(false);
				}
			}
		})();

		return () => {
			isSubscribed = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Only run once on mount

	// Cleanup effect: unenroll unverified factor when component unmounts
	useEffect(() => {
		return () => {
			// On unmount, if we have a factorId and it's not verified, clean it up
			if (factorId && !isVerified) {
				unenrollFunction(factorId).catch((error) => {
					console.error(
						"Failed to cleanup unverified factor on unmount:",
						error
					);
				});
			}
		};
	}, [factorId, isVerified, unenrollFunction]);

	const handleEnable = async () => {
		setError("");
		setVerifying(true);

		try {
			const challenge = await challengeFunction(factorId);
			await verifyFunction(factorId, challenge.id, verifyCode);
			setIsVerified(true); // Mark as verified to prevent cleanup
			onEnrolled();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Verification failed");
		} finally {
			setVerifying(false);
		}
	};

	const handleCodeChange = (text: string) => {
		// Only allow digits and limit to 6 characters
		const cleaned = text.replace(/\D/g, "").slice(0, 6);
		setVerifyCode(cleaned);
	};

	const handleCancel = async () => {
		// Clean up the unverified factor before cancelling
		if (factorId) {
			try {
				await unenrollFunction(factorId);
				setIsVerified(true); // Mark as handled to prevent double cleanup on unmount
			} catch (error) {
				console.error("Failed to cleanup unverified factor:", error);
			}
		}
		onCancelled();
	};

	if (loading && !qrCode) {
		return (
			<YStack flex={1} alignItems="center" justifyContent="center" padding="$6">
				<Text>Loading...</Text>
				<Spinner color="$accent" size="large" />
			</YStack>
		);
	}

	// If we have QR code data but loading is still true, force it to display
	if (loading && qrCode) {
		console.warn("Loading is true but QR code exists - displaying anyway");
	}

	return (
		<YStack gap="$4" width="100%">
			<YStack gap="$4" alignItems="center">
				<Text fontSize={20} fontWeight="bold" textAlign="center">
					Set Up Two-Factor Authentication
				</Text>

				<Text fontSize={14} color="$color11" textAlign="center">
					Scan this QR code with your authenticator app (like Google
					Authenticator, Authy, or 1Password)
				</Text>

				{qrCode ? (
					<YStack
						alignItems="center"
						gap="$3"
						padding="$4"
						backgroundColor="$background"
						borderRadius="$4"
					>
						<YStack
							width={250}
							height={250}
							alignItems="center"
							justifyContent="center"
							dangerouslySetInnerHTML={{ __html: qrCode }}
						/>
						<Text fontSize={12} color="$color11" textAlign="center">
							Can't scan? Manual entry code:
						</Text>
						<Text
							fontSize={11}
							fontFamily="$mono"
							color="$color10"
							textAlign="center"
							selectable
						>
							{secret}
						</Text>
					</YStack>
				) : (
					<Text color="$red10" fontSize={14}>
						Failed to generate QR code
					</Text>
				)}

				<YStack gap="$2" width="100%">
					<Text fontSize={14} fontWeight="600" textAlign="center">
						Enter the 6-digit code from your app
					</Text>
					<YStack width="100%" position="relative">
						<XStack
							gap="$2"
							justifyContent="center"
							width="100%"
							pointerEvents="none"
						>
							{[0, 1, 2, 3, 4, 5].map((index) => {
								return (
									<YStack
										key={index}
										backgroundColor="$color5"
										borderRadius="$4"
										width={48}
										height={56}
										alignItems="center"
										justifyContent="center"
										borderWidth={1}
										borderColor={verifyCode[index] ? "$color8" : "$color6"}
									>
										<Text fontSize={24} fontWeight="bold">
											{verifyCode[index] || ""}
										</Text>
									</YStack>
								);
							})}
						</XStack>
						<Input
							value={verifyCode}
							onChangeText={handleCodeChange}
							keyboardType="number-pad"
							maxLength={6}
							placeholder="Enter 6-digit code"
							position="absolute"
							top={0}
							left={0}
							right={0}
							height={56}
							opacity={0.01}
							textAlign="center"
							fontSize={24}
							letterSpacing={20}
							autoFocus
						/>
					</YStack>
				</YStack>

				{error ? (
					<Text color="$red10" fontSize={14} textAlign="center">
						{error}
					</Text>
				) : null}
			</YStack>

			<XStack gap="$3" width="100%">
				<Button
					flex={1}
					size="$4"
					variant="outlined"
					onPress={handleCancel}
					disabled={verifying}
				>
					Cancel
				</Button>
				<Button
					flex={1}
					size="$4"
					theme="active"
					onPress={handleEnable}
					disabled={verifyCode.length !== 6 || verifying}
					icon={verifying ? () => <Spinner color="$accent" /> : undefined}
				>
					{verifying ? "Verifying..." : "Enable"}
				</Button>
			</XStack>
		</YStack>
	);
}
