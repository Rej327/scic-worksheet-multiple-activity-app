import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/providers/ToastProvider";
import TopLoaderProvider from "@/components/providers/TopLoaderProvider";
import { SessionProvider } from "@/context/SessionContext";

export const metadata: Metadata = {
	title: "SCIC Worksheet - Multiple Activities App - by Jefferson Resurreccion",
	description:
		"Evaluation that intended to gauge skills and proficiency as they relate to the role requirements.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="bg-[#D5F0CE] antialiased">
				<TopLoaderProvider />
				<ToastProvider />
				<SessionProvider>{children}</SessionProvider>
			</body>
		</html>
	);
}
