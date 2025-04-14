import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/providers/ToastProvider";
import TopLoaderProvider from "@/components/providers/TopLoaderProvider";

export const metadata: Metadata = {
	title: "SCIC Worksheet - Secret Page App - by Jefferson Resurreccion",
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
				{children}
			</body>
		</html>
	);
}
