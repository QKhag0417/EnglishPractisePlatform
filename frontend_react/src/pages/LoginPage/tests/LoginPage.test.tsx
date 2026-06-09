import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { LoginPage } from "../LoginPage";
import { useAuth } from "../../../contexts/AuthContext";

const { mockNavigate, mockLogin } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockLogin: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../../../contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../../components/Footer", () => ({
  Footer: () => <div data-testid="footer">Footer</div>,
}));

vi.mock("../../../components/NavBarUnified", () => ({
  NavBarUnified: () => <div data-testid="navbar">Navbar</div>,
}));

vi.mock("../../../components/figma/ImageWithFallback", () => ({
  ImageWithFallback: () => <div data-testid="background-image" />,
}));

vi.mock("../../../env", () => ({
  API_BASE: "#",
}));

const renderPage = () => render(<LoginPage />);

const emailInput = () => screen.getByPlaceholderText("your.email@example.com");
const passwordInput = () => screen.getByPlaceholderText("Enter your password");
const loginButton = () => screen.getByRole("button", { name: /^login$/i });

const fillLoginForm = async (
  user: ReturnType<typeof userEvent.setup>,
  email = "student@gmail.com",
  password = "123456",
) => {
  if (email) await user.type(emailInput(), email);
  if (password) await user.type(passwordInput(), password);
};

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.location.hash = "";

    vi.mocked(useAuth).mockReturnValue({
      login: mockLogin,
    } as any);
  });

  describe("rendering", () => {
    test("renders login page layout and main actions", () => {
      renderPage();

      expect(screen.getByTestId("navbar")).toBeInTheDocument();
      expect(screen.getByTestId("footer")).toBeInTheDocument();
      expect(screen.getByTestId("background-image")).toBeInTheDocument();

      expect(
        screen.getByRole("heading", { name: /login/i }),
      ).toBeInTheDocument();

      expect(emailInput()).toBeInTheDocument();
      expect(passwordInput()).toBeInTheDocument();
      expect(loginButton()).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /google/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /facebook/i }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /forgot password/i }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /register/i }),
      ).toBeInTheDocument();
    });
  });

  describe("validation", () => {
    test.each([
      ["empty email and password", "", ""],
      ["empty password", "student@gmail.com", ""],
      ["empty email", "", "123456"],
    ])("shows validation error when %s", async (_, email, password) => {
      const user = userEvent.setup();

      renderPage();
      await fillLoginForm(user, email, password);
      await user.click(loginButton());

      expect(
        screen.getByText("Please enter email and password."),
      ).toBeInTheDocument();

      expect(mockLogin).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("password visibility", () => {
    test("toggles password input type", async () => {
      const user = userEvent.setup();

      renderPage();

      const input = passwordInput() as HTMLInputElement;
      const toggleButton = input.parentElement?.querySelector("button");

      expect(input).toHaveAttribute("type", "password");

      await user.click(toggleButton as HTMLElement);
      expect(input).toHaveAttribute("type", "text");

      await user.click(toggleButton as HTMLElement);
      expect(input).toHaveAttribute("type", "password");
    });
  });

  describe("successful login", () => {
    test.each([
      ["ADMINISTRATOR", "/content-management"],
      ["Tutor", "/tutor/dashboard"],
      ["student", "/"],
      ["unknown", "/"],
    ])("navigates role %s to %s", async (role, expectedPath) => {
      const user = userEvent.setup();

      mockLogin.mockResolvedValue({ role });

      renderPage();
      await fillLoginForm(user);
      await user.click(loginButton());

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith("student@gmail.com", "123456");
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(expectedPath);
      });
    });

    test("shows loading state while login request is pending", async () => {
      const user = userEvent.setup();

      let resolveLogin!: (value: { role: string }) => void;

      mockLogin.mockReturnValue(
        new Promise((resolve) => {
          resolveLogin = resolve;
        }),
      );

      renderPage();
      await fillLoginForm(user);
      await user.click(loginButton());

      expect(
        await screen.findByRole("button", { name: /logging in/i }),
      ).toBeDisabled();

      resolveLogin({ role: "student" });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });
  });

  describe("failed login", () => {
    test.each([
      ["Error object", new Error("Invalid credentials"), "Invalid credentials"],
      ["string error", "Server unavailable", "Server unavailable"],
      ["unknown error object", {}, "Invalid email or password!"],
    ])("shows error message for %s", async (_, errorValue, expectedMessage) => {
      const user = userEvent.setup();

      mockLogin.mockRejectedValue(errorValue);

      renderPage();
      await fillLoginForm(user, "wrong@gmail.com", "wrongpassword");
      await user.click(loginButton());

      await waitFor(() => {
        expect(screen.getByText(expectedMessage)).toBeInTheDocument();
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("navigation buttons", () => {
    test.each([
      ["forgot password", /forgot password/i, "/forgot-password"],
      ["register", /register/i, "/register"],
    ])("navigates to %s page", async (_, buttonName, expectedPath) => {
      const user = userEvent.setup();

      renderPage();
      await user.click(screen.getByRole("button", { name: buttonName }));

      expect(mockNavigate).toHaveBeenCalledWith(expectedPath);
    });
  });

  describe("social login", () => {
    test.each([
      ["Google", /google/i, "#/oauth2/authorization/google"],
      ["Facebook", /facebook/i, "#/oauth2/authorization/facebook"],
    ])(
      "redirects to %s OAuth endpoint",
      async (_, buttonName, expectedHash) => {
        const user = userEvent.setup();

        renderPage();
        await user.click(screen.getByRole("button", { name: buttonName }));

        expect(window.location.hash).toBe(expectedHash);
      },
    );
  });
});
