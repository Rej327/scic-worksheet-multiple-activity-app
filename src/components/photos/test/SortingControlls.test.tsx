import React from "react";
import { render, fireEvent } from "@testing-library/react";
import SortingControlls from "../SortingContolls";

describe.only("SortingControlls", () => {
	it("renders both sorting buttons correctly", () => {
		// Arrange
		const mockSetSortBy = jest.fn();
		const { getByText } = render(
			<SortingControlls sortBy="name" setSortBy={mockSetSortBy} />
		);

		// Act
		const sortByNameButton = getByText("Sort by Name");
		const sortByUploadDateButton = getByText("Sort by Upload Date");

		// Assert
		expect(sortByNameButton).toBeInTheDocument();
		expect(sortByUploadDateButton).toBeInTheDocument();
	});

	it("applies the correct active styles to the selected sorting button", () => {
		// Arrange
		const mockSetSortBy = jest.fn();
		const { getByText, rerender } = render(
			<SortingControlls sortBy="name" setSortBy={mockSetSortBy} />
		);

		// Act
		const sortByNameButton = getByText("Sort by Name");
		const sortByUploadDateButton = getByText("Sort by Upload Date");

		// Assert
		expect(sortByNameButton).toHaveClass("bg-green-600 text-white");
		expect(sortByUploadDateButton).toHaveClass("bg-gray-300");

		// Re-render with sortBy="upload_date"
		rerender(
			<SortingControlls sortBy="upload_date" setSortBy={mockSetSortBy} />
		);

		// Assert after re-rendering
		expect(sortByNameButton).toHaveClass("bg-gray-300");
		expect(sortByUploadDateButton).toHaveClass("bg-green-600 text-white");
	});

	it("calls setSortBy with the correct value when buttons are clicked", () => {
		// Arrange
		const mockSetSortBy = jest.fn();
		const { getByText } = render(
			<SortingControlls sortBy="name" setSortBy={mockSetSortBy} />
		);

		// Act
		const sortByNameButton = getByText("Sort by Name");
		const sortByUploadDateButton = getByText("Sort by Upload Date");

		fireEvent.click(sortByNameButton);
		fireEvent.click(sortByUploadDateButton);

		// Assert
		expect(mockSetSortBy).toHaveBeenCalledTimes(2);
		expect(mockSetSortBy).toHaveBeenCalledWith("name");
		expect(mockSetSortBy).toHaveBeenCalledWith("upload_date");
	});
});