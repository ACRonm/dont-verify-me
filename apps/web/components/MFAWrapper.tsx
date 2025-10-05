"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@dont-verify-me/shared-logic";

interface MFAWrapperProps {
	children: React.ReactNode;
}

export function MFAWrapper({ children }: MFAWrapperProps) {
	const { mfa, user } = useAuth();
	const router = useRouter();
	const pathname = usePathname();
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const checkMFA = async () => {
			if (!user) {
				setReady(true);
				return;
			}

			// Skip MFA check for certain pages
			const skipPages = ["/mfa-verify", "/mfa-setup", "/login", "/signup", "/platforms", "/", "/privacy"];
			if (skipPages.some((page) => pathname.startsWith(page))) {
				setReady(true);
				return;
			}

			try {
				const { currentLevel, nextLevel } =
					await mfa.getAuthenticatorAssuranceLevel();

				// User has MFA enrolled but hasn't verified this session
				if (currentLevel === "aal1" && nextLevel === "aal2") {
					router.push("/mfa-verify");
					return;
				}
			} catch (error) {
				console.error("Error checking MFA:", error);
			} finally {
				setReady(true);
			}
		};

		checkMFA();
	}, [user, pathname, mfa, router]);

	if (!ready) {
		return null;
	}

	return <>{children}</>;
}
