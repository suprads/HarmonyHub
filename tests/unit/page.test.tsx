import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

jest.mock("../../services/auth/server", () => ({
  verifySession: jest.fn().mockResolvedValue({ user: { id: "user-1" } }),
}));

jest.mock("../../lib/auth", () => ({
  auth: {
    api: {
      getAccessToken: jest.fn(),
    },
  },
}));

jest.mock("../../lib/prisma", () => ({
  prisma: {
    account: {
      findFirst: jest.fn().mockResolvedValue(null),
    },
    youtubeMusicAccount: {
      findUnique: jest.fn().mockResolvedValue(null),
    },
  },
}));

jest.mock("next/link", () => {
  return function MockLink({ href, children, ...rest }: any) {
    return (
      <a href={typeof href === "string" ? href : href.pathname} {...rest}>
        {children}
      </a>
    );
  };
});

describe("Home Page", () => {
  it("renders a main element", async () => {
    render(await HomePage());

    const main = screen.getByRole("main");

    expect(main).toBeInTheDocument();
  });
});
