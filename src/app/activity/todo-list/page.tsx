"use client";

import { useAuthLoader } from "@/hooks/useAuthLoader";
import { User } from "@supabase/supabase-js";
import React, { useState } from "react";

export default function page() {
	const user = useAuthLoader();

	return (
		<div>
			<h1>Hello, {user?.user_metadata?.full_name || "Guest"}</h1>
		</div>
	);
}
