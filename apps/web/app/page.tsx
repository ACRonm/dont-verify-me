"use client";

import { ThemedPage } from "@dont-verify-me/ui";
import {
	H1,
	H2,
	YStack,
	Text,
	XStack,
	Input,
	Button,
	Separator,
} from "tamagui";
import { LandingPageNavbar } from "../components/LandingPageNavbar";
import { FeatureCard } from "../components/FeatureCard";
import { Bike, Wrench, Route } from "@tamagui/lucide-icons";
import { useState } from "react";

export default function LandingPage() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	return (
		<ThemedPage>
			<LandingPageNavbar />
			<YStack
				flex={1}
				justifyContent="center"
				alignItems="center"
				paddingHorizontal="$6"
				gap="$4"
				paddingVertical="$8"
				paddingTop="$16"
			>
				<Text
					textAlign="center"
					fontSize="$10"
					lineHeight="$9"
					fontWeight="bold"
				>
					Protect Your Privacy. <Text color="$accent">Stay Anonymous.</Text>
				</Text>
				<Text textAlign="center" fontSize="$7" color="$color11" maxWidth={600}>
					Dont Verify Me is launching soon! Join our waitlist to be the first to
					access privacy protection resources.
				</Text>
				<Separator borderColor="$accent" margin="$4" />
				<Text textAlign="center" fontSize="$7" color="$color11" maxWidth={600}>
					We are building the best tool to help you keep track of your
					motorcycle's tire wear and maintenance, so you can ride with
					confidence.
				</Text>
				<XStack
					gap="$3"
					marginTop="$4"
					width="100%"
					maxWidth={450}
					alignItems="center"
				>
					<Input
						flex={1}
						size="$4"
						placeholder="Enter your email address"
						value={email}
						onChangeText={setEmail}
						keyboardType="email-address"
						autoCapitalize="none"
						autoComplete="email"
					/>
					<Button
						size="$4"
						borderWidth={1}
						borderColor="$accent"
						backgroundColor="transparent"
						color="$accent"
						hoverStyle={{
							backgroundColor: "$orange5",
							borderColor: "$accent",
						}}
						pressStyle={{
							backgroundColor: "$orange5",
						}}
						disabled={loading}
					>
						{loading ? "Joining..." : "Join Waitlist"}
					</Button>
				</XStack>
				{success && (
					<Text color="$green10" marginTop="$2">
						Thank you for joining the waitlist!
					</Text>
				)}
				{typeof error === "string" && error.length > 0 && (
					<Text color="$red10" marginTop="$2">
						{error}
					</Text>
				)}
			</YStack>
			<YStack
				id="features"
				paddingHorizontal="$6"
				paddingVertical="$8"
				gap="$6"
				alignItems="center"
			>
				<H2 textAlign="center">Features</H2>
				<XStack
					flexWrap="wrap"
					justifyContent="center"
					gap="$4"
					maxWidth={1120}
					alignItems="stretch"
				>
					<FeatureCard
						title="Tire Wear Tracking"
						description="Log your rides and automatically track your tire wear."
						icon={<Bike strokeWidth={1.5} />}
					/>
					<FeatureCard
						title="Maintenance Reminders"
						description="Get reminders for important maintenance tasks."
						icon={<Wrench strokeWidth={1.5} />}
					/>
					<FeatureCard
						title="Ride Logging"
						description="Keep a detailed log of all your motorcycle rides."
						icon={<Route strokeWidth={1.5} />}
					/>
				</XStack>
			</YStack>
		</ThemedPage>
	);
}
