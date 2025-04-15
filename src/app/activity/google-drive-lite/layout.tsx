import Navigation from "@/components/navigation/Navigation";
import MainHeader from "@/components/tools/MainHeader";
import { FaGoogleDrive } from "react-icons/fa";

export const metadata = {
	title: "Google Drive Lite | Multiple Activities App ",
	description: "Google drive lite application (CRUD and sorting operation)",
};

export default function layout({ children }: { children: React.ReactNode }) {
	return (
		<Navigation>
			<header>
				<MainHeader
					icon={<FaGoogleDrive size={30} />}
					title="Google Drive 'lite'"
				/>
			</header>
			{children}
		</Navigation>
	);
}
