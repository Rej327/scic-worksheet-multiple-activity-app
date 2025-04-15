import Navigation from "@/components/navigation/Navigation";
import MainHeader from "@/components/tools/MainHeader";
import { MdFastfood } from "react-icons/md";

export const metadata = {
	title: "Food Review | Multiple Activities App ",
	description: "Food review application (CRUD and sorting operation)",
};

export default function layout({ children }: { children: React.ReactNode }) {
	return (
		<Navigation>
			<header>
				<MainHeader icon={<MdFastfood size={30} />} title="Food review" />
			</header>
			{children}
		</Navigation>
	);
}
