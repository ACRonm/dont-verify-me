"use client";

import type { TabsContentProps } from "tamagui";
import {
	YStack,
	H2,
	Separator,
	Input,
	Button,
	XStack,
	Label,
	Switch,
	Tabs,
	H5,
	Paragraph,
	SizableText,
	RadioGroup,
	useMedia,
} from "tamagui";
import { ThemedPage, RadioGroupItem } from "@dont-verify-me/ui";

const SettingsTabContent = (props: TabsContentProps) => {
	return (
		<Tabs.Content
			backgroundColor="$background"
			key={props.value}
			padding="$4"
			flex={1}
			borderWidth="$0.25"
			borderColor="$borderColor"
			borderRadius="$4"
			borderTopLeftRadius={0}
			borderTopRightRadius={0}
			minHeight={350}
			{...props}
		/>
	);
};

export default function SettingsPage() {
	const media = useMedia();
	return (
		<ThemedPage>
			<YStack
				gap="$6"
				padding="$4"
				maxWidth={media.gtSm ? 800 : "95%"}
				marginHorizontal="auto"
				width="100%"
			>
				<YStack gap="$2">
					<H2 fontSize="$8" fontWeight="bold">
						Settings
					</H2>
					<Paragraph color="$color10">
						Manage your account and preferences.
					</Paragraph>
				</YStack>

				<Tabs
					defaultValue="profile"
					orientation="horizontal"
					flexDirection="column"
					width="100%"
					borderRadius="$4"
					borderWidth="$0.25"
					overflow="hidden"
					borderColor="$borderColor"
				>
					<Tabs.List
						separator={<Separator vertical />}
						disablePassBorderRadius="bottom"
						aria-label="Manage your account"
					>
						<Tabs.Tab flex={1} value="profile">
							<SizableText fontFamily="$body">Profile</SizableText>
						</Tabs.Tab>
						<Tabs.Tab flex={1} value="preferences">
							<SizableText fontFamily="$body">Preferences</SizableText>
						</Tabs.Tab>
						<Tabs.Tab flex={1} value="account">
							<SizableText fontFamily="$body">Account</SizableText>
						</Tabs.Tab>
					</Tabs.List>
					<Separator />

					<SettingsTabContent value="profile">
						<YStack gap="$4">
							<H2 fontSize="$6">User Profile</H2>
							<Separator />
							<YStack gap="$3">
								<YStack gap="$2">
									<Label htmlFor="username">Username</Label>
									<Input id="username" placeholder="Username" />
								</YStack>
								<YStack gap="$2">
									<Label htmlFor="email">Email</Label>
									<Input id="email" placeholder="aiden@example.com" />
								</YStack>
								<Button alignSelf="flex-start" theme="active">
									Update Profile
								</Button>
							</YStack>
						</YStack>
					</SettingsTabContent>

					<SettingsTabContent value="preferences">
						<YStack gap="$4">
							<H2 fontSize="$6">App Preferences</H2>
							<Separator />
							<YStack gap="$4">
								<XStack
									alignItems={media.gtSm ? "center" : "flex-start"}
									justifyContent="space-between"
									flexDirection={media.gtSm ? "row" : "column"}
									gap={media.gtSm ? "$0" : "$2"}
								>
									<YStack gap="$1">
										<Label>Dark Mode</Label>
										<Paragraph color="$color10" fontSize="$2">
											Enable a dark theme for the application.
										</Paragraph>
									</YStack>
									<Switch>
										<Switch.Thumb animation="bouncy" />
									</Switch>
								</XStack>
								<XStack
									alignItems={media.gtSm ? "center" : "flex-start"}
									justifyContent="space-between"
									flexDirection={media.gtSm ? "row" : "column"}
									gap={media.gtSm ? "$0" : "$2"}
								>
									<YStack gap="$1">
										<Label>Email Notifications</Label>
										<Paragraph color="$color10" fontSize="$2">
											Receive email updates and reminders.
										</Paragraph>
									</YStack>
									<Switch>
										<Switch.Thumb animation="bouncy" />
									</Switch>
								</XStack>
								<Separator />
								<YStack gap="$2">
									<Label>Distance Unit</Label>
									<RadioGroup defaultValue="km">
										<XStack gap="$4">
											<RadioGroupItem value="km" label="Kilometers" />
											<RadioGroupItem value="miles" label="Miles" />
										</XStack>
									</RadioGroup>
								</YStack>
							</YStack>
						</YStack>
					</SettingsTabContent>

					<SettingsTabContent value="account">
						<YStack gap="$4">
							<H2 fontSize="$6">Account Management</H2>
							<Separator />
							<YStack gap="$3">
								<Button>Change Password</Button>
								<YStack gap="$2">
									<H5 color="$red10">Danger Zone</H5>
									<Paragraph color="$color10" fontSize="$2">
										Deleting your account is a permanent action and cannot be
										undone.
									</Paragraph>
									<Button theme="red">Delete Account</Button>
								</YStack>
							</YStack>
						</YStack>
					</SettingsTabContent>
				</Tabs>

				<Button theme="active" alignSelf="flex-end" size="$5" marginTop="$4">
					Save Changes
				</Button>
			</YStack>
		</ThemedPage>
	);
}
