import { useAuth } from "@dont-verify-me/shared-logic";
import { usePathname } from "next/navigation";
import LoginPage from "../app/login/page";

export default function AuthWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const { session, loading: isAuthLoading } = useAuth();
	const pathname = usePathname();

	if (isAuthLoading) {
		return null;
	}

	if (session) {
		return <>{children}</>;
	}

	const isPublicRoute =
		pathname === "/login" || pathname === "/signup" || pathname === "/";
	if (isPublicRoute) {
		return <>{children}</>;
	}

	return <LoginPage />;
}
