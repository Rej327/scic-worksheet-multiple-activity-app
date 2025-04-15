import React from "react";
import { FaPlus } from "react-icons/fa";

const MarkdownHeader: React.FC<{
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	openCreateModal: () => void;
}> = ({ searchQuery, setSearchQuery, openCreateModal }) => {
	return (
		<div>
			<div className="flex flex-col sm:flex-row justify-between items-center mb-8">
				<h1 className="text-3xl font-bold mb-4 sm:mb-0 text-green-950">
					Markdown Notes
				</h1>

				{/* Icon Button */}
				<div className="relative">
					<button
						className="text-white flex gap-2 items-center bg-green-600 hover:bg-green-700 p-2 rounded-md transition-colors duration-300 cursor-pointer"
						onClick={openCreateModal}
					>
						<FaPlus size={15} /> New Note
					</button>
				</div>
			</div>

			{/* Search Bar */}
			<div className="mb-6">
				<input
					type="text"
					placeholder="🔍 Search notes..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full px-4 py-2 border-b-2 border-green-800 focus:outline-none transition-all duration-300"
				/>
			</div>
		</div>
	);
};

export default MarkdownHeader;
