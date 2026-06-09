import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { RegisterPage } from "../RegisterPage";
import { useAuth } from "../../../contexts/AuthContext";

const { mockNavigate, mockRegister } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockRegister: vi.fn(),
}));

vi.mock("react-router", () => ({
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

const renderPage = () => render(<RegisterPage />);

const firstNameInput = () =>
  screen.getByPlaceholderText("Enter your first name");
const lastNameInput = () => screen.getByPlaceholderText("Enter your last name");
const emailInput = () => screen.getByPlaceholderText("your.email@example.com");
const passwordInput = () => screen.getByPlaceholderText("Create a password");
const confirmPasswordInput = () =>
  screen.getByPlaceholderText("Confirm your password");

const registerButton = () =>
  screen.getByRole("button", { name: /^register$/i });

const fillRegisterForm = async (
  user: ReturnType<typeof userEvent.setup>,
  values: Partial<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }> = {},
) => {
  const data = {
    firstName: "Duy",
    lastName: "Huynh",
    email: "duy@gmail.com",
    password: "123456",
    confirmPassword: "123456",
    ...values,
  };

  if (data.firstName !== "") await user.type(firstNameInput(), data.firstName);
  if (data.lastName !== "") await user.type(lastNameInput(), data.lastName);
  if (data.email !== "") await user.type(emailInput(), data.email);
  if (data.password !== "") await user.type(passwordInput(), data.password);

  if (data.confirmPassword !== "") {
    await user.type(confirmPasswordInput(), data.confirmPassword);
  }
};

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuth).mockReturnValue({
      register: mockRegister,
    } as any);
  });

  describe("rendering", () => {
    test("renders register page layout and main actions", () => {
      renderPage();

      expect(screen.getByTestId("navbar")).toBeInTheDocument();
      expect(screen.getByTestId("footer")).toBeInTheDocument();
      expect(screen.getByTestId("background-image")).toBeInTheDocument();

      expect(
        screen.getByRole("heading", { name: /register/i }),
      ).toBeInTheDocument();

      expect(firstNameInput()).toBeInTheDocument();
      expect(lastNameInput()).toBeInTheDocument();
      expect(emailInput()).toBeInTheDocument();
      expect(passwordInput()).toBeInTheDocument();
      expect(confirmPasswordInput()).toBeInTheDocument();
      expect(registerButton()).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /google/i }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /facebook/i }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /^login$/i }),
      ).toBeInTheDocument();
    });
  });

  describe("validation", () => {
    test.each([
      [
        "all fields are empty",
        {
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        },
      ],
      ["first name is empty", { firstName: "" }],
      ["last name is empty", { lastName: "" }],
      ["email is empty", { email: "" }],
      ["password is empty", { password: "" }],
      ["confirm password is empty", { confirmPassword: "" }],
    ])("shows validation error when %s", async (_, overrideValues) => {
      const user = userEvent.setup();

      renderPage();
      await fillRegisterForm(user, overrideValues);
      await user.click(registerButton());

      expect(screen.getByText("Please fill in all fields")).toBeInTheDocument();
      expect(mockRegister).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    test("shows validation error when passwords do not match", async () => {
      const user = userEvent.setup();

      renderPage();

      await fillRegisterForm(user, {
        password: "123456",
        confirmPassword: "654321",
      });

      await user.click(registerButton());

      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
      expect(mockRegister).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("password visibility", () => {
    test("toggles password and confirm password input types", async () => {
      const user = userEvent.setup();

      renderPage();

      const password = passwordInput() as HTMLInputElement;
      const confirmPassword = confirmPasswordInput() as HTMLInputElement;

      const passwordToggleButton =
        password.parentElement?.querySelector("button");

      const confirmPasswordToggleButton =
        confirmPassword.parentElement?.querySelector("button");

      expect(password).toHaveAttribute("type", "password");
      expect(confirmPassword).toHaveAttribute("type", "password");

      await user.click(passwordToggleButton as HTMLElement);
      expect(password).toHaveAttribute("type", "text");

      await user.click(passwordToggleButton as HTMLElement);
      expect(password).toHaveAttribute("type", "password");

      await user.click(confirmPasswordToggleButton as HTMLElement);
      expect(confirmPassword).toHaveAttribute("type", "text");

      await user.click(confirmPasswordToggleButton as HTMLElement);
      expect(confirmPassword).toHaveAttribute("type", "password");
    });
  });

  describe("successful registration", () => {
    test("calls register and navigates to homepage", async () => {
      const user = userEvent.setup();

      mockRegister.mockResolvedValue({
        success: true,
      });

      renderPage();
      await fillRegisterForm(user);
      await user.click(registerButton());

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith(
          "Duy",
          "Huynh",
          "duy@gmail.com",
          "123456",
        );
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });

    test("shows loading state while registration request is pending", async () => {
      const user = userEvent.setup();

      let resolveRegister!: (value: { success: boolean }) => void;

      mockRegister.mockReturnValue(
        new Promise((resolve) => {
          resolveRegister = resolve;
        }),
      );

      renderPage();
      await fillRegisterForm(user);
      await user.click(registerButton());

      expect(
        await screen.findByRole("button", { name: /registering/i }),
      ).toBeDisabled();

      resolveRegister({
        success: true,
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });
  });

  describe("failed registration", () => {
    test.each([
      [
        "server error object with colon",
        {
          error: "email: Email already exists",
        },
        "Email already exists",
      ],
      [
        "server error object without colon",
        {
          error: "Email already exists",
        },
        "Email already exists",
      ],
      ["thrown Error instance", new Error("Network error"), "Network error"],
      ["unknown error object", {}, "Registration failed. Please try again."],
    ])(
      "shows cleaned general error message for %s",
      async (_, errorValue, message) => {
        const user = userEvent.setup();
        const consoleSpy = vi
          .spyOn(console, "log")
          .mockImplementation(() => {});

        mockRegister.mockRejectedValue(errorValue);

        renderPage();
        await fillRegisterForm(user);
        await user.click(registerButton());

        await waitFor(() => {
          expect(screen.getByText(message)).toBeInTheDocument();
        });

        expect(mockNavigate).not.toHaveBeenCalled();

        consoleSpy.mockRestore();
      },
    );

    test.each([
      [
        "firstname with colon",
        { firstname: "firstname: First name is required" },
        "First name is required",
      ],
      [
        "lastname with colon",
        { lastname: "lastname: Last name is required" },
        "Last name is required",
      ],
      [
        "email with colon",
        { email: "email: Invalid email format" },
        "Invalid email format",
      ],
      [
        "password with colon",
        { password: "password: Password is too weak" },
        "Password is too weak",
      ],
      [
        "email without colon",
        { email: "Email already exists" },
        "Email already exists",
      ],
    ])("shows cleaned field error from %s", async (_, errorValue, message) => {
      const user = userEvent.setup();
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      mockRegister.mockRejectedValue(errorValue);

      renderPage();
      await fillRegisterForm(user);
      await user.click(registerButton());

      await waitFor(() => {
        expect(screen.getByText(message)).toBeInTheDocument();
      });

      expect(mockNavigate).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("navigation", () => {
    test("navigates to login page", async () => {
      const user = userEvent.setup();

      renderPage();

      await user.click(screen.getByRole("button", { name: /^login$/i }));

      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  describe("social registration", () => {
    test.each([
      [
        "Google",
        /google/i,
        "http://localhost:8080/oauth2/authorization/google",
      ],
      [
        "Facebook",
        /facebook/i,
        "http://localhost:8080/oauth2/authorization/facebook",
      ],
    ])(
      "redirects to %s OAuth endpoint",
      async (_, buttonName, expectedHref) => {
        const user = userEvent.setup();

        const originalLocation = window.location;

        Object.defineProperty(window, "location", {
          configurable: true,
          value: {
            href: "",
          },
        });

        renderPage();

        await user.click(screen.getByRole("button", { name: buttonName }));

        expect(window.location.href).toBe(expectedHref);

        Object.defineProperty(window, "location", {
          configurable: true,
          value: originalLocation,
        });
      },
    );
  });
});
