import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SortingControlls from "../SortingContolls";

describe("SortingControlls Component", () => {
  let setSortByMock: jest.Mock;
  let setOrderByMock: jest.Mock;

  beforeEach(() => {
    setSortByMock = jest.fn();
    setOrderByMock = jest.fn();
  });

  it("renders buttons for sorting by name and upload date", () => {
    render(
      <SortingControlls
        sortBy="name"
        orderBy="asc"
        setSortBy={setSortByMock}
        setOrderBy={setOrderByMock}
      />
    );

    expect(screen.getByText("Sort by Name ↑")).toBeInTheDocument();
    expect(screen.getByText("Sort by Upload Date")).toBeInTheDocument();
  });

  it("calls setSortBy and setOrderBy correctly when sort by name is clicked", () => {
    render(
      <SortingControlls
        sortBy="upload_date"
        orderBy="asc"
        setSortBy={setSortByMock}
        setOrderBy={setOrderByMock}
      />
    );

    const nameButton = screen.getByText("Sort by Name");
    fireEvent.click(nameButton);

    expect(setSortByMock).toHaveBeenCalledWith("name");
    expect(setOrderByMock).toHaveBeenCalledWith("asc");
  });

  it("toggles orderBy when the same sort field button is clicked", () => {
    render(
      <SortingControlls
        sortBy="name"
        orderBy="asc"
        setSortBy={setSortByMock}
        setOrderBy={setOrderByMock}
      />
    );

    const nameButton = screen.getByText("Sort by Name ↑");
    fireEvent.click(nameButton);

    expect(setSortByMock).not.toHaveBeenCalled();
    expect(setOrderByMock).toHaveBeenCalledWith("desc");

    fireEvent.click(nameButton);
    expect(setOrderByMock).toHaveBeenCalledWith("desc");
  });

  it("switches to a new sort field and resets order to ascending", () => {
    render(
      <SortingControlls
        sortBy="name"
        orderBy="desc"
        setSortBy={setSortByMock}
        setOrderBy={setOrderByMock}
      />
    );

    const uploadDateButton = screen.getByText("Sort by Upload Date");
    fireEvent.click(uploadDateButton);

    expect(setSortByMock).toHaveBeenCalledWith("upload_date");
    expect(setOrderByMock).toHaveBeenCalledWith("asc");
  });
});