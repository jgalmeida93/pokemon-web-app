import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../../app/page";

describe("Home", () => {
  it("renders home", () => {
    render(<Home />);

    expect(screen.getByTestId("home-title")).toBeInTheDocument();
    expect(screen.getByTestId("home-subtitle")).toBeInTheDocument();
    expect(screen.getByTestId("home-view-pokemon")).toBeInTheDocument();
  });
});
