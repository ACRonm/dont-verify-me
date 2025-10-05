"use client";

import { useState } from "react";
import { useAuth } from "@dont-verify-me/shared-logic";
import {
	Card,
	Input,
	Button,
	YStack,
	Text,
	Theme,
	View,
	Separator,
	Paragraph,
	Spinner,
} from "tamagui";

export default function SignupPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [signupError, setSignupError] = useState<string | null>(null);
	const { signUpWithEmail, signInWithGoogle, signUpLoading, signInLoading } =
		useAuth();

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();
		setSignupError(null);
		if (password !== confirmPassword) {
			setSignupError("Passwords don't match!");
			return;
		}
		const { success, message } = await signUpWithEmail(email, password);
		if (!success) {
			setSignupError(message);
		} else {
			setSignupError(message);
		}
	};

	const handleGoogleSignup = async () => {
		await signInWithGoogle();
	};

	return (
		<YStack
			flex={1}
			alignItems="center"
			justifyContent="center"
			marginHorizontal="$4"
			minHeight="100vh"
		>
			<Card
				elevate
				bordered
				width="100%"
				padding="$6"
				backgroundColor="$background"
				borderColor="$borderColor"
				maxWidth={400}
			>
				<YStack gap="$4">
					<Text
						fontSize={24}
						fontWeight="bold"
						textAlign="center"
						color="$color" // Use theme text color
					>
						Create a new account
					</Text>
					<Text fontSize={14} textAlign="center" color="$color">
						Already have an account?{" "}
						<a
							href="/login"
							style={{
								fontWeight: "600",
								textDecoration: "underline",
							}}
						>
							Sign in
						</a>
					</Text>
					{signupError && (
						<Theme name="error">
							<Text color="$color" textAlign="center">
								{signupError}
							</Text>
						</Theme>
					)}
					<form onSubmit={handleSignup}>
						<YStack gap="$4">
							<Input
								id="email"
								placeholder="Email address"
								autoComplete="email"
								disabled={signUpLoading}
								value={email}
								onChangeText={setEmail}
								placeholderTextColor="$color"
							/>
							<Input
								id="password"
								placeholder="Password"
								autoComplete="new-password"
								disabled={signUpLoading}
								value={password}
								onChangeText={setPassword}
								secureTextEntry
								placeholderTextColor="$color"
							/>
							<Input
								id="confirm-password"
								placeholder="Confirm Password"
								autoComplete="new-password"
								disabled={signUpLoading}
								value={confirmPassword}
								onChangeText={setConfirmPassword}
								secureTextEntry
								placeholderTextColor="$color"
							/>
							<Button
								disabled={signUpLoading || signInLoading}
								width="100%"
								color="$color"
								variant="outlined"
								icon={
									signUpLoading ? () => <Spinner color="$accent" /> : undefined
								}
							>
								{!signUpLoading && <Text>Sign up</Text>}
							</Button>
						</YStack>
					</form>
					<YStack gap="$4">
						<View flexDirection="row" width="100%" alignItems="center" gap="$4">
							<Separator />
							<Paragraph>Or</Paragraph>
							<Separator />
						</View>
						<View flexDirection="row" flexWrap="wrap" gap="$3">
							<Button
								flex={1}
								minWidth="100%"
								onPress={handleGoogleSignup}
								variant="outlined"
								disabled={signInLoading || signUpLoading}
								icon={
									signInLoading ? () => <Spinner color="$accent" /> : undefined
								}
							>
								{!signInLoading && (
									<>
										<Button.Icon>
											<svg
												width="20"
												height="21"
												viewBox="0 0 20 21"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<mask
													id="mask0_412_162"
													maskUnits="userSpaceOnUse"
													x="0"
													y="0"
													width="20"
													height="21"
													style={{ marginRight: 8 }}
												>
													<path d="M20 0.25H0V20.25H20V0.25Z" fill="white" />
												</mask>
												<g mask="url(#mask0_412_162)">
													<path
														d="M19.6 10.4773C19.6 9.76819 19.5364 9.08639 19.4182 8.43179H10V12.3H15.3818C15.15 13.55 14.4455 14.6091 13.3864 15.3182V17.8273H16.6182C18.5091 16.0864 19.6 13.5227 19.6 10.4773Z"
														fill="#4285F4"
													/>
													<path
														d="M10 20.25C12.7 20.25 14.9636 19.3545 16.6181 17.8273L13.3863 15.3182C12.4909 15.9182 11.3454 16.2727 10 16.2727C7.3954 16.2727 5.1909 14.5136 4.4045 12.15H1.0636V14.7409C2.7091 18.0091 6.0909 20.25 10 20.25Z"
														fill="#34A853"
													/>
													<path
														d="M4.4045 12.15C4.2045 11.55 4.0909 10.9091 4.0909 10.25C4.0909 9.59089 4.2045 8.94999 4.4045 8.34999V5.75909H1.0636C0.3864 7.10909 0 8.63639 0 10.25C0 11.8636 0.3864 13.3909 1.0636 14.7409L4.4045 12.15Z"
														fill="#FBBC04"
													/>
													<path
														d="M10 4.2273C11.4681 4.2273 12.7863 4.7318 13.8227 5.7227L16.6909 2.8545C14.9591 1.2409 12.6954 0.25 10 0.25C6.0909 0.25 2.7091 2.4909 1.0636 5.7591L4.4045 8.35C5.1909 5.9864 7.3954 4.2273 10 4.2273Z"
														fill="#E94235"
													/>
												</g>
											</svg>
										</Button.Icon>
										<Button.Text>Continue with Google</Button.Text>
									</>
								)}
							</Button>
						</View>
					</YStack>
				</YStack>
			</Card>
		</YStack>
	);
}
