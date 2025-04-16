import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "../Header";

// Mock usePathname from next/navigation
jest.mock("next/navigation", () => ({
	usePathname: () => "/pokemon-review-app",
}));

// Mock localStorage utils
jest.mock("@/utils/inputsData", () => ({
	loadFromStorage: jest.fn(() => "bulbasaur"),
	saveToStorage: jest.fn(),
	LOCAL_STORAGE_KEYS: {
		searchPokemon: "searchPokemon",
	},
}));

describe("Header Component", () => {
	const mockOnSearch = jest.fn();
	const mockOnAddPhoto = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
	});

	it("renders title and search input correctly", () => {
		render(<Header onSearch={mockOnSearch} onAddPhoto={mockOnAddPhoto} />);

		const title = screen.getByTestId("header-title");
		const searchInput = screen.getByTestId("search-input");
		const addButton = screen.getByTestId("add-photo-button");

		expect(title).toHaveTextContent("Pokémon Photo Archive");
		expect(searchInput).toBeInTheDocument();
		expect(searchInput).toHaveValue("bulbasaur");
		expect(addButton).toBeInTheDocument();
	});

	it("calls onSearch after debounce", async () => {
		render(<Header onSearch={mockOnSearch} onAddPhoto={mockOnAddPhoto} />);

		const searchInput = screen.getByTestId("search-input");
		fireEvent.change(searchInput, { target: { value: "pikachu" } });

		await act(async () => {
			jest.advanceTimersByTime(1500);
		});

		expect(mockOnSearch).toHaveBeenCalledWith("pikachu");
	});

	it("calls onAddPhoto when button is clicked", () => {
		render(<Header onSearch={mockOnSearch} onAddPhoto={mockOnAddPhoto} />);
		const addButton = screen.getByTestId("add-photo-button");

		fireEvent.click(addButton);

		expect(mockOnAddPhoto).toHaveBeenCalledTimes(1);
	});
});
