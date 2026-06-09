import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { UserManagementPage } from "../UserManagementPage";
import { useAuth } from "../../../contexts/AuthContext";

const { mockNavigate, mockLogout, mockOnLogout } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockLogout: vi.fn(),
  mockOnLogout: vi.fn(),
}));

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../../../contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../../components/NavBarUnified", () => ({
  NavBarUnified: () => <div data-testid="navbar">Navbar</div>,
}));

vi.mock("../../../components/Footer", () => ({
  Footer: () => <div data-testid="footer">Footer</div>,
}));

vi.mock("../../../env", () => ({
  API_BASE: "http://localhost:8080",
}));

vi.mock("lucide-react", () => ({
  Plus: () => <span>Plus</span>,
  Pencil: () => <span>Pencil</span>,
  Trash2: () => <span>Trash2</span>,
  Search: () => <span>Search</span>,
  Mail: () => <span>Mail</span>,
  Users: () => <span>Users</span>,
  BookOpen: () => <span>BookOpen</span>,
  UserX: () => <span>UserX</span>,
  UserCheck: () => <span>UserCheck</span>,
}));

vi.mock("../../../components/ui/button", () => ({
  Button: ({ children, onClick, disabled, type = "button", ...props }: any) => (
    <button type={type} onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}));

vi.mock("../../../components/ui/input", () => ({
  Input: (props: any) => <input {...props} />,
}));

vi.mock("../../../components/ui/badge", () => ({
  Badge: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}));

vi.mock("../../../components/ui/label", () => ({
  Label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
}));

vi.mock("../../../components/ui/dialog", () => ({
  Dialog: ({ open, children }: any) => (open ? <div>{children}</div> : null),
  DialogContent: ({ children }: any) => <div role="dialog">{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogDescription: ({ children }: any) => <p>{children}</p>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("../../../components/ui/select", () => ({
  Select: ({ value, onValueChange, children }: any) => (
    <select
      aria-label="select"
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
    >
      {children}
    </select>
  ),
  SelectTrigger: ({ children }: any) => <>{children}</>,
  SelectValue: () => null,
  SelectContent: ({ children }: any) => <>{children}</>,
  SelectItem: ({ value, children }: any) => (
    <option value={value}>{children}</option>
  ),
}));

vi.mock("../../TutorDashboardPage/components/SelectV2", () => ({
  SelectV2: ({ value, onChange, options, placeholder }: any) => (
    <select
      aria-label={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {options.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

const mockUsersResponse = {
  success: true,
  data: [
    {
      userId: "user-1",
      firstname: "John",
      lastname: "Learner",
      email: "john@example.com",
      role: "Learner",
      isActive: true,
      createdAt: [2026, 1, 1, 10, 0, 0, 0],
      lastLoginAt: [2026, 1, 2, 10, 0, 0, 0],
    },
    {
      userId: "user-2",
      firstname: "Mary",
      lastname: "Tutor",
      email: "mary@example.com",
      role: "Tutor",
      isActive: false,
      createdAt: [2026, 1, 3, 10, 0, 0, 0],
      lastLoginAt: [2026, 1, 4, 10, 0, 0, 0],
    },
    {
      userId: "user-3",
      firstname: "Admin",
      lastname: "User",
      email: "admin@example.com",
      role: "Administrator",
      isActive: true,
      createdAt: [2026, 1, 5, 10, 0, 0, 0],
      lastLoginAt: [2026, 1, 6, 10, 0, 0, 0],
    },
  ],
};

const updatedUserResponse = {
  success: true,
  data: {
    userId: "user-1",
    firstname: "Updated",
    lastname: "Learner",
    email: "updated@example.com",
    role: "Learner",
    isActive: false,
    createdAt: [2026, 1, 1, 10, 0, 0, 0],
    lastLoginAt: [2026, 1, 2, 10, 0, 0, 0],
  },
};

const okJson = (json: any, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => json,
  text: async () => "",
});

const failJson = (message: string, status = 400) => ({
  ok: false,
  status,
  json: async () => ({ success: false, message }),
  text: async () => message,
});

const failText = (message: string, status = 400) => ({
  ok: false,
  status,
  json: async () => {
    throw new Error("Invalid JSON");
  },
  text: async () => message,
});

const mockFetch = (...responses: any[]) => {
  const fetchMock = vi.fn();

  responses.forEach((response) => {
    fetchMock.mockResolvedValueOnce(response);
  });

  globalThis.fetch = fetchMock as any;

  return fetchMock;
};

const renderPage = (props?: { onLogout?: () => void }) =>
  render(<UserManagementPage {...props} />);

const waitForUsers = async () => {
  await waitFor(() => {
    expect(screen.getByText("John Learner")).toBeInTheDocument();
  });
};

const openAddUserDialog = async () => {
  const user = userEvent.setup();

  renderPage();
  await waitForUsers();

  await user.click(screen.getByRole("button", { name: /add new user/i }));

  return user;
};

const openEditUserDialog = async () => {
  const user = userEvent.setup();

  renderPage();
  await waitForUsers();

  await user.click(screen.getAllByRole("button", { name: /pencil/i })[0]);

  return user;
};

describe("UserManagementPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuth).mockReturnValue({
      logout: mockLogout,
    } as any);

    mockFetch(okJson(mockUsersResponse));

    vi.stubGlobal("alert", vi.fn());
  });

  describe("initial rendering and loading", () => {
    test("fetches and renders users, statistics, navbar, and footer", async () => {
      renderPage();

      expect(screen.getByText("Loading users...")).toBeInTheDocument();

      await waitForUsers();

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8080/api/user?include=email,firstname,lastname,isactive,createdat,lastloginat,role",
        expect.objectContaining({
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }),
      );

      expect(screen.getByTestId("navbar")).toBeInTheDocument();
      expect(screen.getAllByTestId("footer").length).toBeGreaterThanOrEqual(1);

      expect(screen.getByText("User Management")).toBeInTheDocument();
      expect(
        screen.getByText("Manage user accounts and permissions"),
      ).toBeInTheDocument();

      expect(screen.getByText("John Learner")).toBeInTheDocument();
      expect(screen.getByText("Mary Tutor")).toBeInTheDocument();
      expect(screen.getByText("Admin User")).toBeInTheDocument();

      expect(screen.getByText("Total Users")).toBeInTheDocument();
      expect(screen.getByText("Active Users")).toBeInTheDocument();
      expect(screen.getByText("Learners")).toBeInTheDocument();
      expect(screen.getByText("Administrators")).toBeInTheDocument();
    });

    test("renders empty table state when backend returns no users", async () => {
      mockFetch(
        okJson({
          success: true,
          data: [],
        }),
      );

      renderPage();

      await waitFor(() => {
        expect(screen.getByText("No users found")).toBeInTheDocument();
      });

      expect(
        screen.getByText("Try adjusting your filters or search query"),
      ).toBeInTheDocument();
    });

    test("maps fallback user fields safely", async () => {
      mockFetch(
        okJson({
          success: true,
          data: [
            {
              userId: 99,
              firstname: null,
              lastname: null,
              email: null,
              role: "Unknown",
              isActive: null,
              createdAt: null,
              lastLoginAt: null,
            },
          ],
        }),
      );

      renderPage();

      await waitFor(() => {
        expect(screen.getByText("(No name)")).toBeInTheDocument();
      });

      expect(screen.getByText("—")).toBeInTheDocument();
      expect(screen.getAllByText("Learner").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("Inactive").length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("filtering", () => {
    test("filters users by search query", async () => {
      const user = userEvent.setup();

      renderPage();
      await waitForUsers();

      await user.type(
        screen.getByPlaceholderText("Search by name or email..."),
        "mary",
      );

      expect(screen.getByText("Mary Tutor")).toBeInTheDocument();
      expect(screen.queryByText("John Learner")).not.toBeInTheDocument();
      expect(screen.queryByText("Admin User")).not.toBeInTheDocument();
    });

    test("filters users by role and status", async () => {
      const user = userEvent.setup();

      renderPage();
      await waitForUsers();

      await user.selectOptions(
        screen.getByLabelText("Filter by role"),
        "Tutor",
      );

      expect(screen.getByText("Mary Tutor")).toBeInTheDocument();
      expect(screen.queryByText("John Learner")).not.toBeInTheDocument();

      await user.selectOptions(
        screen.getByLabelText("Filter by status"),
        "Inactive",
      );

      expect(screen.getByText("Mary Tutor")).toBeInTheDocument();
      expect(screen.queryByText("Admin User")).not.toBeInTheDocument();
    });

    test("shows no users found when filters remove all rows", async () => {
      const user = userEvent.setup();

      renderPage();
      await waitForUsers();

      await user.type(
        screen.getByPlaceholderText("Search by name or email..."),
        "not-existing-user",
      );

      expect(screen.getByText("No users found")).toBeInTheDocument();
    });
  });

  describe("add user dialog", () => {
    test("opens add user dialog and validates empty required fields", async () => {
      const user = await openAddUserDialog();

      const dialog = screen.getByRole("dialog");

      expect(dialog).toBeInTheDocument();

      expect(
        within(dialog).getByRole("heading", { name: "Add New User" }),
      ).toBeInTheDocument();

      expect(
        within(dialog).getByText("Create a new user account."),
      ).toBeInTheDocument();

      await user.click(within(dialog).getByRole("button", { name: /create/i }));

      expect(
        screen.getByText("Please fill in all required fields."),
      ).toBeInTheDocument();
    });

    test("validates password when creating a new user", async () => {
      const user = await openAddUserDialog();

      const dialog = screen.getByRole("dialog");

      await user.type(within(dialog).getByPlaceholderText("John"), "New");
      await user.type(within(dialog).getByPlaceholderText("Smith"), "User");
      await user.type(
        within(dialog).getByPlaceholderText("john.smith@example.com"),
        "new@example.com",
      );

      await user.click(within(dialog).getByRole("button", { name: /create/i }));

      expect(
        screen.getByText("Password is required for new users."),
      ).toBeInTheDocument();
    });

    test("creates a new user and refreshes the user list", async () => {
      const fetchMock = mockFetch(
        okJson(mockUsersResponse),
        okJson({
          success: true,
        }),
        okJson(mockUsersResponse),
      );

      const user = await openAddUserDialog();

      const dialog = screen.getByRole("dialog");

      await user.type(within(dialog).getByPlaceholderText("John"), "New");
      await user.type(within(dialog).getByPlaceholderText("Smith"), "User");
      await user.type(
        within(dialog).getByPlaceholderText("john.smith@example.com"),
        "new@example.com",
      );
      await user.type(
        within(dialog).getByPlaceholderText("Enter password"),
        "123456",
      );

      await user.click(within(dialog).getByRole("button", { name: /create/i }));

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          "http://localhost:8080/api/user",
          expect.objectContaining({
            method: "POST",
            credentials: "include",
            headers: expect.objectContaining({
              "Content-Type": "application/json",
              Accept: "application/json",
            }),
            body: JSON.stringify({
              firstname: "New",
              lastname: "User",
              email: "new@example.com",
              password: "123456",
              role: "Learner",
            }),
          }),
        );
      });

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    test("shows create error message from backend", async () => {
      mockFetch(okJson(mockUsersResponse), failJson("Email already exists"));

      const user = await openAddUserDialog();

      const dialog = screen.getByRole("dialog");

      await user.type(within(dialog).getByPlaceholderText("John"), "New");
      await user.type(within(dialog).getByPlaceholderText("Smith"), "User");
      await user.type(
        within(dialog).getByPlaceholderText("john.smith@example.com"),
        "new@example.com",
      );
      await user.type(
        within(dialog).getByPlaceholderText("Enter password"),
        "123456",
      );

      await user.click(within(dialog).getByRole("button", { name: /create/i }));

      await waitFor(() => {
        expect(screen.getByText("Email already exists")).toBeInTheDocument();
      });
    });
  });

  describe("edit user dialog", () => {
    test("opens edit dialog with user data", async () => {
      await openEditUserDialog();

      const dialog = screen.getByRole("dialog");

      expect(
        within(dialog).getByRole("heading", { name: "Edit User" }),
      ).toBeInTheDocument();

      expect(
        within(dialog).getByText("Update the user details and permissions."),
      ).toBeInTheDocument();

      expect(within(dialog).getByDisplayValue("John")).toBeInTheDocument();
      expect(
        within(dialog).getByDisplayValue("john@example.com"),
      ).toBeInTheDocument();

      const dialogSelects = within(dialog).getAllByLabelText("select");

      expect(dialogSelects[0]).toHaveValue("Learner");
      expect(dialogSelects[1]).toHaveValue("Active");

      expect(
        within(dialog).getByText("Leave blank to keep the current password."),
      ).toBeInTheDocument();
    });

    test("updates user without password when password field is blank", async () => {
      const fetchMock = mockFetch(
        okJson(mockUsersResponse),
        okJson(updatedUserResponse),
      );

      const user = await openEditUserDialog();

      const dialog = screen.getByRole("dialog");

      const firstNameInput = within(dialog).getByDisplayValue("John");

      await user.clear(firstNameInput);
      await user.type(firstNameInput, "Updated");

      const selects = within(dialog).getAllByLabelText("select");
      await user.selectOptions(selects[1], "Inactive");

      await user.click(within(dialog).getByRole("button", { name: /update/i }));

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          "http://localhost:8080/api/user/user-1",
          expect.objectContaining({
            method: "PUT",
            credentials: "include",
            body: JSON.stringify({
              firstname: "Updated",
              lastname: "Learner",
              email: "john@example.com",
              role: "Learner",
              isActive: false,
            }),
          }),
        );
      });

      await waitFor(() => {
        expect(screen.getByText("Updated Learner")).toBeInTheDocument();
      });
    });

    test("updates user with password when password field is provided", async () => {
      const fetchMock = mockFetch(
        okJson(mockUsersResponse),
        okJson(updatedUserResponse),
      );

      const user = await openEditUserDialog();

      const dialog = screen.getByRole("dialog");

      await user.type(
        within(dialog).getByPlaceholderText("Enter password"),
        "new-password",
      );

      await user.click(within(dialog).getByRole("button", { name: /update/i }));

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          "http://localhost:8080/api/user/user-1",
          expect.objectContaining({
            method: "PUT",
            body: expect.stringContaining('"password":"new-password"'),
          }),
        );
      });
    });

    test("uses fetchUsers fallback when update response does not contain updated data", async () => {
      const fetchMock = mockFetch(
        okJson(mockUsersResponse),
        okJson({
          success: true,
        }),
        okJson(mockUsersResponse),
      );

      const user = await openEditUserDialog();

      const dialog = screen.getByRole("dialog");

      await user.click(within(dialog).getByRole("button", { name: /update/i }));

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledTimes(3);
      });
    });

    test("shows update error message from text fallback", async () => {
      mockFetch(okJson(mockUsersResponse), failText("Update failed"));

      const user = await openEditUserDialog();

      const dialog = screen.getByRole("dialog");

      await user.click(within(dialog).getByRole("button", { name: /update/i }));

      await waitFor(() => {
        expect(screen.getByText("Update failed")).toBeInTheDocument();
      });
    });
  });

  describe("delete user", () => {
    test("deletes user and removes it from the table", async () => {
      const fetchMock = mockFetch(
        okJson(mockUsersResponse),
        okJson({
          success: true,
        }),
      );

      const user = userEvent.setup();

      renderPage();
      await waitForUsers();

      await user.click(screen.getAllByRole("button", { name: /trash2/i })[0]);

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          "http://localhost:8080/api/user/user-1",
          expect.objectContaining({
            method: "DELETE",
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }),
        );
      });

      await waitFor(() => {
        expect(screen.queryByText("John Learner")).not.toBeInTheDocument();
      });
    });

    test("shows alert when delete fails", async () => {
      mockFetch(okJson(mockUsersResponse), failJson("Cannot delete user"));

      const user = userEvent.setup();

      renderPage();
      await waitForUsers();

      await user.click(screen.getAllByRole("button", { name: /trash2/i })[0]);

      await waitFor(() => {
        expect(globalThis.alert).toHaveBeenCalledWith("Failed to delete user");
      });
    });

    test("shows alert when delete throws an error", async () => {
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce(okJson(mockUsersResponse))
        .mockRejectedValueOnce(new Error("Network error"));

      globalThis.fetch = fetchMock as any;

      const user = userEvent.setup();

      renderPage();
      await waitForUsers();

      await user.click(screen.getAllByRole("button", { name: /trash2/i })[0]);

      await waitFor(() => {
        expect(globalThis.alert).toHaveBeenCalledWith("Failed to delete user");
      });
    });
  });

  describe("unauthorized and error handling", () => {
    test("handles unauthorized initial fetch by logging out and navigating home", async () => {
      mockFetch({
        ok: false,
        status: 401,
        json: async () => ({}),
        text: async () => "",
      });

      renderPage();

      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalled();
      });

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    test("uses parent onLogout when unauthorized and onLogout prop is supplied", async () => {
      mockFetch({
        ok: false,
        status: 401,
        json: async () => ({}),
        text: async () => "",
      });

      renderPage({
        onLogout: mockOnLogout,
      });

      await waitFor(() => {
        expect(mockOnLogout).toHaveBeenCalled();
      });

      expect(mockLogout).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    test("handles unauthorized delete by logging out", async () => {
      mockFetch(okJson(mockUsersResponse), {
        ok: false,
        status: 401,
        json: async () => ({}),
        text: async () => "",
      });

      const user = userEvent.setup();

      renderPage();
      await waitForUsers();

      await user.click(screen.getAllByRole("button", { name: /trash2/i })[0]);

      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalled();
      });
    });

    test("handles unauthorized create by logging out", async () => {
      mockFetch(okJson(mockUsersResponse), {
        ok: false,
        status: 401,
        json: async () => ({}),
        text: async () => "",
      });

      const user = await openAddUserDialog();

      const dialog = screen.getByRole("dialog");

      await user.type(within(dialog).getByPlaceholderText("John"), "New");
      await user.type(within(dialog).getByPlaceholderText("Smith"), "User");
      await user.type(
        within(dialog).getByPlaceholderText("john.smith@example.com"),
        "new@example.com",
      );
      await user.type(
        within(dialog).getByPlaceholderText("Enter password"),
        "123456",
      );

      await user.click(within(dialog).getByRole("button", { name: /create/i }));

      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalled();
      });
    });

    test("shows generic save error when save request throws", async () => {
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce(okJson(mockUsersResponse))
        .mockRejectedValueOnce(new Error("Network error"));

      globalThis.fetch = fetchMock as any;

      const user = await openAddUserDialog();

      const dialog = screen.getByRole("dialog");

      await user.type(within(dialog).getByPlaceholderText("John"), "New");
      await user.type(within(dialog).getByPlaceholderText("Smith"), "User");
      await user.type(
        within(dialog).getByPlaceholderText("john.smith@example.com"),
        "new@example.com",
      );
      await user.type(
        within(dialog).getByPlaceholderText("Enter password"),
        "123456",
      );

      await user.click(within(dialog).getByRole("button", { name: /create/i }));

      await waitFor(() => {
        expect(screen.getByText("Failed to save user.")).toBeInTheDocument();
      });
    });
  });
});
