"use client";

import { useEffect, useState } from "react";
import { useTopLoader } from "nextjs-toploader";
import { supabase } from "@/helper/connection";
import { toast } from "react-hot-toast";
import { User } from "@supabase/supabase-js";

export function useAuthLoader() {
	const [user, setUser] = useState<User | null>(null);
	const loader = useTopLoader();

	useEffect(() => {
		loader.isStarted();

		const fetchData = async () => {
			const { data: authData, error: authError } =
				await supabase.auth.getUser();

			if (authError || !authData?.user) {
				toast.error("No authenticated user found.");
				loader.setProgress(0.5);
				return;
			}

			setUser(authData.user);
			loader.done();
		};

		fetchData();
	}, []);

	return user;
}
