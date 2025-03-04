import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LoadingScreen } from "../ui/loading-screen";

describe("LoadingScreen", () => {
  it("renders loading indicator", () => {
    render(<LoadingScreen />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("displays custom message when provided", () => {
    const testMessage = "Loading Pokemon data...";
    render(<LoadingScreen message={testMessage} />);

    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });

  it("displays default message when no message is provided", () => {
    render(<LoadingScreen />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
