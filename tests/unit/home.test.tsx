import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("Home Page", () => {
  it("renders a main element", () => {
    render(<HomePage />);

    const main = screen.getByRole("main");

    expect(main).toBeInTheDocument();
  });
});
