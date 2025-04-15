import Navigation from "@/components/navigation/Navigation";
import MainHeader from "@/components/tools/MainHeader";
import { LuListTodo } from "react-icons/lu";

export const metadata = {
	title: "To-Do List | Multiple Activities App ",
	description: "To-Do list application (CRUD operation)",
};

export default function layout({ children }: { children: React.ReactNode }) {
	return (
		<Navigation>
			<header>
				<MainHeader icon={<LuListTodo size={30} />} title="Todo list" />
			</header>
			{children}
		</Navigation>
	);
}
