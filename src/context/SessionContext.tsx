"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { supabase } from "@/helper/connection";
import { getUserById, saveNewUser } from "@/api/user/profile";

interface SessionContextType {
	session: any;
	userId: string | null; // Add userId here
	fullName: string;
	loading: boolean;
}

const SessionContext = createContext<SessionContextType>({
	session: null,
	userId: null, // Default value for userId
	fullName: "",
	loading: true,
});

export const SessionProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [session, setSession] = useState<any>(null);
	const [userId, setUserId] = useState<string | null>(null); // Add state for userId
	const [fullName, setFullName] = useState("");
	const [loading, setLoading] = useState(true);

	const saveProfile = useCallback(async (user: any) => {
		const userId = user.id;
		const userFullName = user.user_metadata?.full_name ?? "";

		setFullName(userFullName); // Save to context
		setUserId(userId); // Save userId to context

		const { data, error } = await getUserById(userId);

		if (error && error.code !== "PGRST116") {
			console.error("Error checking profile:", error.message);
			return;
		}

		if (!data) {
			const { error: upsertError } = await saveNewUser({
				id: userId,
				userFullName,
			});

			if (upsertError) {
				console.error("Error saving profile:", upsertError.message);
			} else {
				console.log("✅ Profile saved");
			}
		} else {
			console.log("⚠️ Profile already exists");
		}
	}, []);

	useEffect(() => {
		const fetchSession = async () => {
			const { data } = await supabase.auth.getSession();
			const currentSession = data.session;

			setSession(currentSession);
			if (currentSession?.user) {
				await saveProfile(currentSession.user);
			}

			setLoading(false);
		};

		fetchSession();

		const { data: listener } = supabase.auth.onAuthStateChange(
			async (_event, session) => {
				setSession(session);
				if (session?.user) {
					await saveProfile(session.user);
				}
			}
		);

		return () => listener.subscription.unsubscribe();
	}, [saveProfile]);

	return (
		<SessionContext.Provider value={{ session, userId, fullName, loading }}>
			{children}
		</SessionContext.Provider>
	);
};

export const useSession = () => {
	return useContext(SessionContext);
};