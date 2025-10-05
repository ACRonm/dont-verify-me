"use client";

import { useState, useEffect } from "react";
import { supabase } from "../api/supabase";
import { Session, User } from "@supabase/supabase-js";
import { useToastController } from "@tamagui/toast";

export function useAuth() {
	const [session, setSession] = useState<Session | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [signInLoading, setSignInLoading] = useState(false);
	const [signUpLoading, setSignUpLoading] = useState(false);
	const [signOutLoading, setSignOutLoading] = useState(false);
	const toast = useToastController();

	useEffect(() => {
		const getSession = async () => {
			const { data, error } = await supabase.auth.getSession();
			if (error) {
				console.error("Error getting session:", error);
			} else {
				setSession(data.session);
				setUser(data.session?.user ?? null);
			}
			setLoading(false);
		};

		getSession();

		const { data: authListener } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setSession(session);
				setUser(session?.user ?? null);
			}
		);

		return () => {
			authListener.subscription.unsubscribe();
		};
	}, []);

	return {
		session,
		user,
		loading,
		signInLoading,
		signUpLoading,
		signOutLoading,
		signInWithGoogle: async () => {
			setSignInLoading(true);
			const redirectTo = new URL("/dashboard", window.location.origin).toString();
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo,
				},
			});
			if (error) console.error("Error signing in with Google:", error);
			setSignInLoading(false);
		},
		signInWithEmail: async (email: string, password: string) => {
			setSignInLoading(true);
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});
			setSignInLoading(false);

			if (error) {
				toast.show("Login Failed", {
					type: "error",
				});
				return { success: false, message: error.message };
			}

			if (data.user && data.session) {
				toast.show("Login Successful", {
					message: "You have been successfully logged in!",
					type: "success",
				});
				return { success: true, message: "Login successful!" };
			}

			toast.show("Login Failed", {
				message: "An unexpected error occurred during login.",
				type: "error",
			});
			return {
				success: false,
				message: "An unexpected error occurred during login.",
			};
		},
		signUpWithEmail: async (email: string, password: string) => {
			setSignUpLoading(true);
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
			});
			setSignUpLoading(false);

			if (error) {
				toast.show("Signup Failed", {
					type: "error",
				});
				return { success: false, message: error.message };
			}

			// If no error, but no session, it means a confirmation email was sent.
			// This can happen for new users, or existing users (to prevent enumeration).
			if (data.user && !data.session) {
				toast.show("Confirmation Email Sent", {
					message:
						"Please check your email for a confirmation link. If you already have an account, please sign in.",
					type: "info",
				});
				return {
					success: true,
					message:
						"Please check your email for a confirmation link. If you already have an account, please sign in.",
				};
			}

			// If data.user and data.session are present, it means successful signup and login.
			if (data.user && data.session) {
				toast.show("Signup Successful", {
					message: "You have been successfully signed up and logged in!",
					type: "success",
				});
				return { success: true, message: "Signup successful!" };
			}

			// Fallback for unexpected scenarios
			toast.show("Signup Failed", {
				message: "An unexpected error occurred during signup.",
				type: "error",
			});
			return {
				success: false,
				message: "An unexpected error occurred during signup.",
			};
		},
		signOut: async () => {
			setSignOutLoading(true);
			const { error } = await supabase.auth.signOut();
			if (error) console.error("Error signing out:", error);
			setSignOutLoading(false);
		},
	};
}
