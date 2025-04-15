import Navigation from "@/components/navigation/Navigation";
import MainHeader from "@/components/tools/MainHeader";
import { MdCatchingPokemon } from "react-icons/md";

export const metadata = {
	title: "Pokemon Review App | Multiple Activities App ",
	description:
		"Pokemon review application (CRUD, search and sorting operation)",
};

export default function layout({ children }: { children: React.ReactNode }) {
	return (
		<Navigation>
			<header>
				<MainHeader
					icon={<MdCatchingPokemon size={30} />}
					title="Pokemon Review"
				/>
			</header>
			{children}
		</Navigation>
	);
}
