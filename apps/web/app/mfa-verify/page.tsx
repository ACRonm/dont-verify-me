"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@dont-verify-me/shared-logic";
import { ThemedPage, TOTPChallenge } from "@dont-verify-me/ui";
import { YStack } from "tamagui";

export default function MFAVerifyPage() {
	const { mfa } = useAuth();
	const router = useRouter();

	const handleSuccess = () => {
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
				<TOTPChallenge
					onSuccess={handleSuccess}
					listFactorsFunction={mfa.listFactors}
					challengeFunction={mfa.challenge}
					verifyFunction={mfa.verify}
				/>
			</YStack>
		</ThemedPage>
	);
}
