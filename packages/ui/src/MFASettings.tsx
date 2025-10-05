"use client";

import { useState, useEffect } from "react";
import {
	YStack,
	XStack,
	Text,
	Button,
	Card,
	Spinner,
	H5,
	Separator,
} from "tamagui";
import { useAuth } from "@dont-verify-me/shared-logic";
import { TOTPEnrollment } from "./TOTPEnrollment";

export function MFASettings() {
	const { mfa } = useAuth();
	const [factors, setFactors] = useState<
		Array<{ id: string; friendly_name?: string; status: string }>
	>([]);
	const [loading, setLoading] = useState(true);
	const [showEnrollment, setShowEnrollment] = useState(false);
	const [removing, setRemoving] = useState<string | null>(null);
	const [error, setError] = useState<string>("");
	const [cleaningUp, setCleaningUp] = useState(false);

	const loadFactors = async () => {
		setLoading(true);
		try {
			const data = await mfa.listFactors();
			// Use 'all' to show both verified and unverified factors
			const allFactors = data.all || [];
			setFactors(allFactors);
		} catch (error) {
			console.error("Failed to load MFA factors:", error);
			setError("Failed to load authentication factors");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadFactors();
	}, []);

	const handleRemoveFactor = async (factorId: string) => {
		setRemoving(factorId);
		setError("");
		try {
			await mfa.unenroll(factorId);
			await loadFactors();
		} catch (error) {
			console.error("Failed to remove factor:", error);
			setError(
				error instanceof Error ? error.message : "Failed to remove factor"
			);
		} finally {
			setRemoving(null);
		}
	};

	const handleEnrolled = () => {
		setShowEnrollment(false);
		setError("");
		loadFactors();
	};

	const handleCancelEnrollment = () => {
		setShowEnrollment(false);
		loadFactors(); // Reload to show updated list after cleanup
	};

	const handleCleanupUnverified = async () => {
		setCleaningUp(true);
		setError("");
		try {
			const data = await mfa.listFactors();
			const allFactors = data.all || [];
			const unverifiedFactors = allFactors.filter(
				(factor) => factor.status === "unverified"
			);

			for (const factor of unverifiedFactors) {
				try {
					await mfa.unenroll(factor.id);
				} catch (error) {
					console.error("Failed to remove unverified factor:", error);
				}
			}

			await loadFactors();
		} catch (error) {
			console.error("Failed to cleanup unverified factors:", error);
			setError("Failed to cleanup unverified factors");
		} finally {
			setCleaningUp(false);
		}
	};

	const handleStartEnrollment = async () => {
		// Clear any previous errors
		setError("");

		// Check for any unverified factors and remove them first
		try {
			const data = await mfa.listFactors();
			const allFactors = data.all || []; // Use 'all' instead of 'totp'
			const verifiedFactors = allFactors.filter(
				(factor) => factor.status === "verified"
			);
			const unverifiedFactors = allFactors.filter(
				(factor) => factor.status === "unverified"
			);

			// Check if user has reached the maximum number of factors
			if (verifiedFactors.length >= 10) {
				setError(
					"You have reached the maximum number of authentication factors (10). Please remove an existing factor before adding a new one."
				);
				return;
			}

			// Remove unverified factors before starting new enrollment
			for (const factor of unverifiedFactors) {
				try {
					await mfa.unenroll(factor.id);
				} catch (error) {
					console.error("Failed to remove unverified factor:", error);
				}
			}

			// Reload factors after cleanup
			await loadFactors();
		} catch (error) {
			console.error("Failed to check existing factors:", error);
			setError("Failed to prepare for enrollment. Please try again.");
			return;
		}

		setShowEnrollment(true);
	};

	if (loading) {
		return (
			<YStack padding="$4" alignItems="center" gap="$2">
				<Spinner size="large" />
				<Text fontSize={14} color="$color11">
					Loading authentication factors...
				</Text>
			</YStack>
		);
	}

	return (
		<YStack gap="$4">
			<YStack gap="$2">
				<H5>Two-Factor Authentication</H5>
				<Text fontSize={14} color="$color11">
					Add an extra layer of security to your account with app-based
					authentication.
				</Text>
			</YStack>

			<Separator />

			{error ? (
				<Card
					padding="$3"
					backgroundColor="$red2"
					borderColor="$red7"
					borderWidth={1}
				>
					<Text fontSize={14} color="$red11">
						{error}
					</Text>
				</Card>
			) : null}

			{factors.length === 0 ? (
				<Card padding="$4" backgroundColor="$background">
					<YStack gap="$3" alignItems="center">
						<Text fontSize={14} textAlign="center">
							You don't have any authentication factors set up yet.
						</Text>
						<Button size="$3" theme="active" onPress={handleStartEnrollment}>
							Enable Two-Factor Authentication
						</Button>
					</YStack>
				</Card>
			) : (
				<YStack gap="$3">
					{factors.filter((f) => f.status === "unverified").length > 0 && (
						<Card
							padding="$3"
							backgroundColor="$yellow2"
							borderColor="$yellow7"
							borderWidth={1}
						>
							<YStack gap="$2">
								<Text fontSize={14} color="$yellow11">
									You have{" "}
									{factors.filter((f) => f.status === "unverified").length}{" "}
									unverified factor(s). These are incomplete enrollments that
									should be cleaned up.
								</Text>
								<Button
									size="$2"
									theme="yellow"
									onPress={handleCleanupUnverified}
									disabled={cleaningUp}
									icon={cleaningUp ? () => <Spinner /> : undefined}
								>
									{cleaningUp ? "Cleaning up..." : "Remove All Unverified"}
								</Button>
							</YStack>
						</Card>
					)}
					{factors.map((factor) => (
						<Card key={factor.id} padding="$4" bordered>
							<XStack justifyContent="space-between" alignItems="center">
								<YStack gap="$1">
									<XStack gap="$2" alignItems="center">
										<Text fontWeight="600">
											{factor.friendly_name || "Authenticator App"}
										</Text>
										{factor.status === "unverified" && (
											<Text
												fontSize={11}
												color="$yellow10"
												backgroundColor="$yellow4"
												paddingHorizontal="$2"
												paddingVertical="$1"
												borderRadius="$2"
											>
												UNVERIFIED
											</Text>
										)}
									</XStack>
									<Text fontSize={12} color="$color11">
										Status: {factor.status}
									</Text>
								</YStack>
								<Button
									size="$3"
									theme="red"
									onPress={() => handleRemoveFactor(factor.id)}
									disabled={removing === factor.id}
									icon={removing === factor.id ? () => <Spinner /> : undefined}
								>
									{removing !== factor.id && "Remove"}
								</Button>
							</XStack>
						</Card>
					))}
					<Button size="$3" variant="outlined" onPress={handleStartEnrollment}>
						Add Another Factor
					</Button>
				</YStack>
			)}

			{showEnrollment && (
				<YStack
					position="absolute"
					top={0}
					left={0}
					right={0}
					bottom={0}
					zIndex={100000}
					alignItems="center"
					justifyContent="center"
					style={{ position: "fixed" }}
				>
					<YStack
						position="absolute"
						top={0}
						left={0}
						right={0}
						bottom={0}
						backgroundColor="rgba(0,0,0,0.5)"
						onPress={handleCancelEnrollment}
					/>
					<YStack
						paddingVertical="$4"
						paddingHorizontal="$6"
						borderRadius="$6"
						borderWidth={1}
						borderColor="$borderColor"
						backgroundColor="$background"
						shadowColor="$shadowColor"
						shadowRadius={20}
						shadowOffset={{ width: 0, height: 10 }}
						gap="$4"
						width="90%"
						maxWidth={500}
						zIndex={100001}
					>
						<TOTPEnrollment
							onEnrolled={handleEnrolled}
							onCancelled={handleCancelEnrollment}
							enrollFunction={mfa.enroll}
							challengeFunction={mfa.challenge}
							verifyFunction={mfa.verify}
							unenrollFunction={mfa.unenroll}
						/>
					</YStack>
				</YStack>
			)}
		</YStack>
	);
}
