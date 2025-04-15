import Navigation from "@/components/navigation/Navigation";
import MainHeader from "@/components/tools/MainHeader";
import { AiFillFileMarkdown } from "react-icons/ai";

export const metadata = {
	title: "Markdown Notes App | Multiple Activities App ",
	description:
		"Markdown notes application (CRUD markdwon note with raw preview)",
};

export default function layout({ children }: { children: React.ReactNode }) {
	return (
		<Navigation>
			<header>
				<MainHeader
					icon={<AiFillFileMarkdown size={30} />}
					title="Markdown Notes"
				/>
			</header>
			{children}
		</Navigation>
	);
}
