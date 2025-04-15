"use client";

import Navigation from "@/components/navigation/Navigation";
import Loading from "@/helper/Loading";
import Dashboard from "@/view/auth/Dashboard";
import Auth from "@/view/public/Auth";
import { useSession } from "@/context/SessionContext";
import { supabase } from "@/helper/connection";

export default function Home() {
	const { session, loading } = useSession();

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
				<Dashboard />
			</div>
		</Navigation>
	) : (
		<Auth supabase={supabase} />
	);
}
