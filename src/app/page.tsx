"use client";

import Navigation from "@/components/navigation/Navigation";
import { supabase } from "@/helper/connection";
import Loading from "@/helper/Loading";
import Dashboard from "@/view/auth/Dashboard";
import Auth from "@/view/public/Auth";

import { useCallback, useEffect, useState } from "react";

export default function Home() {
	const [session, setSession] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	// Save profile to Supabase "profiles" table
	const saveProfile = useCallback(async (user: any) => {
		try {
			const userId = user.id;
			const fullName = user.user_metadata?.full_name ?? "";

			// Check if the profile already exists
			const { data, error } = await supabase
				.from("profiles")
				.select("id")
				.eq("id", userId)
				.single();

			if (error && error.code !== "PGRST116") {
				console.error("Error checking profile:", error.message);
				return;
			}

			// If the profile doesn't exist, create it
			if (!data) {
				const { error: upsertError } = await supabase
					.from("profiles")
					.upsert(
						{ id: userId, full_name: fullName },
						{ onConflict: "id" }
					);

				if (upsertError) {
					console.error("Error saving profile:", upsertError.message);
				} else {
					console.log("✅ Profile saved");
				}
			} else {
				console.log("⚠️ Profile already exists, skipping save");
			}
		} catch (error) {
			console.error("Unexpected error saving profile:", error);
		}
	}, []);

	useEffect(() => {
		const fetchSession = async () => {
			try {
				const { data } = await supabase.auth.getSession();
				const currentSession = data.session;

				setSession(currentSession);

				if (currentSession?.user) {
					await saveProfile(currentSession.user);
				}
			} catch (error) {
				console.error("Error fetching session:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchSession();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			setSession(session);

			if (event === "SIGNED_IN" && session?.user) {
				await saveProfile(session.user);
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [saveProfile]);

	if (loading) {
		return (
			<div className="w-screen h-screen">
				<Loading loading={loading} />
			</div>
		);
	}

	return session ? (
		<Navigation>
			<div className="px-4">
				<Dashboard supabase={supabase} />
			</div>
		</Navigation>
	) : (
		<Auth supabase={supabase} />
	);
}
