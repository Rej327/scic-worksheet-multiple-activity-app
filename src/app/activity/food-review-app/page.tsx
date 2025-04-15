"use client";

import { supabase } from "@/helper/connection";
import { useRouter } from "next/navigation";
import { useTopLoader } from "nextjs-toploader";
import React, { useEffect } from "react";

export default function page() {
	const router = useRouter();
	const loader = useTopLoader();

	useEffect(() => {
		loader.setProgress(0.25);
		const checkUser = async () => {
			const { data, error } = await supabase.auth.getUser();

			if (error || !data.user) {
				router.push("/");
			}
		};

		checkUser();
		loader.done();
	}, [router]);

	return (
		<div>
			<h1>Hello</h1>
		</div>
	);
}
