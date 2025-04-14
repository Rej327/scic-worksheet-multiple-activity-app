import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "./Dashboard";

// ✅ Global mock
const push = jest.fn();
jest.mock("next/router", () => ({
	useRouter: () => ({
		push,
	}),
}));

// ✅ Mock Supabase client
const mockGetUser = jest.fn();
const mockSupabase = {
	auth: {
		getUser: mockGetUser,
	},
} as any;

describe.only("Dashboard", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders all activity pages correctly", async () => {
		mockGetUser.mockResolvedValue({
			data: { user: { id: "test-user" } },
			error: null,
		});

		render(<Dashboard supabase={mockSupabase} />);
		await waitFor(() => expect(mockGetUser).toHaveBeenCalled());

		expect(screen.getByText("Todo List")).toBeInTheDocument();
		expect(screen.getByText("Google Drive 'Lite'")).toBeInTheDocument();
		expect(screen.getByText("Food Review")).toBeInTheDocument();
		expect(screen.getByText("Pokemon Review App")).toBeInTheDocument();
		expect(screen.getByText("Markdown Notes App")).toBeInTheDocument();
	});

	it("calls supabase.auth.getUser on mount", async () => {
		mockGetUser.mockResolvedValue({
			data: { user: { id: "123" } },
			error: null,
		});

		render(<Dashboard supabase={mockSupabase} />);
		await waitFor(() => expect(mockGetUser).toHaveBeenCalledTimes(1));
	});

	it("navigates to the correct page on click", async () => {
		mockGetUser.mockResolvedValue({
			data: { user: { id: "test-user" } },
			error: null,
		});

		render(<Dashboard supabase={mockSupabase} />);
		await waitFor(() => expect(mockGetUser).toHaveBeenCalled());

		const todoCard = screen.getByText("Todo List").closest("a");
		expect(todoCard).toHaveAttribute("href", "/activity/todo-list");
	});
});
