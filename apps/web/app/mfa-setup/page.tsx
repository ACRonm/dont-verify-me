"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@dont-verify-me/shared-logic";
import { ThemedPage, TOTPEnrollment } from "@dont-verify-me/ui";
import { YStack } from "tamagui";

export default function MFASetupPage() {
	const { mfa } = useAuth();
	const router = useRouter();

	const handleEnrolled = () => {
		router.push("/dashboard");
	};

	const handleCancelled = () => {
		router.push("/dashboard");
	};

	return (
		<ThemedPage>
			<YStack
				flex={1}
				alignItems="center"
				justifyContent="center"
				minHeight="100vh"
				padding="$4"
			>
				<TOTPEnrollment
					onEnrolled={handleEnrolled}
					onCancelled={handleCancelled}
					enrollFunction={mfa.enroll}
					challengeFunction={mfa.challenge}
					verifyFunction={mfa.verify}
				/>
			</YStack>
		</ThemedPage>
	);
}
