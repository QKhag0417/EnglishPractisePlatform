// frontend_react/src/pages/PracticeContentManagementPage/tests/PracticeContentManagementPage.test.tsx

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { PracticeContentManagementPage } from "../PracticeContentManagementPage";
import { usePracticeContentState } from "../hooks/usePracticeContentState";

const {
  mockNavigate,
  mockSetSearchQuery,
  mockSetFilterSkill,
  mockHandleDelete,
  mockHandleEdit,
  mockHandleAddNew,
  mockSetIsSkillModalOpen,
  mockHandleSkillSelect,
} = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockSetSearchQuery: vi.fn(),
  mockSetFilterSkill: vi.fn(),
  mockHandleDelete: vi.fn(),
  mockHandleEdit: vi.fn(),
  mockHandleAddNew: vi.fn(),
  mockSetIsSkillModalOpen: vi.fn(),
  mockHandleSkillSelect: vi.fn(),
}));

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../hooks/usePracticeContentState", () => ({
  usePracticeContentState: vi.fn(),
}));

vi.mock("../../../components/NavBarUnified", () => ({
  NavBarUnified: () => <div data-testid="navbar">Navbar</div>,
}));

vi.mock("../../../components/Footer", () => ({
  Footer: () => <div data-testid="footer">Footer</div>,
}));

vi.mock("../components/PracticeContentHeader", () => ({
  PracticeContentHeader: ({ onAddNew }: any) => (
    <div data-testid="practice-content-header">
      <button onClick={onAddNew}>Add New Content</button>
    </div>
  ),
}));

vi.mock("../components/StatisticsCards", () => ({
  StatisticsCards: ({ contents }: any) => (
    <div data-testid="statistics-cards">
      Statistics Count: {contents.length}
    </div>
  ),
}));

vi.mock("../components/PracticeContentFilter", () => ({
  PracticeContentFilter: ({
    searchQuery,
    setSearchQuery,
    filterSkill,
    setFilterSkill,
  }: any) => (
    <div data-testid="practice-content-filter">
      <input
        placeholder="Search content"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <select
        aria-label="Filter skill"
        value={filterSkill}
        onChange={(e) => setFilterSkill(e.target.value)}
      >
        <option value="ALL">All</option>
        <option value="READING">Reading</option>
        <option value="LISTENING">Listening</option>
        <option value="WRITING">Writing</option>
      </select>
    </div>
  ),
}));

vi.mock("../components/PracticeContentTable", () => ({
  PracticeContentTable: ({ contents, onEdit, onDelete }: any) => (
    <div data-testid="practice-content-table">
      {contents.map((content: any) => (
        <div key={content.id}>
          <span>{content.title}</span>
          <button onClick={() => onEdit(content)}>Edit {content.title}</button>
          <button onClick={() => onDelete(content.id)}>
            Delete {content.title}
          </button>
        </div>
      ))}
    </div>
  ),
}));

vi.mock("../../../components/SkillSelectionModal", () => ({
  SkillSelectionModal: ({ isOpen, onClose, onSkillSelect }: any) =>
    isOpen ? (
      <div data-testid="skill-selection-modal">
        <button onClick={onClose}>Close Modal</button>
        <button onClick={() => onSkillSelect("READING")}>Select Reading</button>
      </div>
    ) : null,
}));

describe("PracticeContentManagementPage", () => {
  const mockContents = [
    {
      id: "content-1",
      title: "Reading Practice 1",
      skill: "READING",
    },
    {
      id: "content-2",
      title: "Listening Practice 1",
      skill: "LISTENING",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(usePracticeContentState).mockReturnValue({
      searchQuery: "",
      setSearchQuery: mockSetSearchQuery,
      filterSkill: "ALL",
      setFilterSkill: mockSetFilterSkill,
      filteredContents: mockContents,
      handleDelete: mockHandleDelete,
      handleEdit: mockHandleEdit,
      handleAddNew: mockHandleAddNew,
      isSkillModalOpen: false,
      setIsSkillModalOpen: mockSetIsSkillModalOpen,
      handleSkillSelect: mockHandleSkillSelect,
    } as any);
  });

  test("renders page layout and content table", () => {
    render(<PracticeContentManagementPage />);

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();

    expect(screen.getByTestId("practice-content-header")).toBeInTheDocument();
    expect(screen.getByTestId("statistics-cards")).toHaveTextContent(
      "Statistics Count: 2",
    );
    expect(screen.getByTestId("practice-content-filter")).toBeInTheDocument();
    expect(screen.getByTestId("practice-content-table")).toBeInTheDocument();

    expect(screen.getByText("Reading Practice 1")).toBeInTheDocument();
    expect(screen.getByText("Listening Practice 1")).toBeInTheDocument();
  });

  test("calls handleAddNew when Add New button is clicked", async () => {
    const user = userEvent.setup();

    render(<PracticeContentManagementPage />);

    await user.click(screen.getByRole("button", { name: /add new content/i }));

    expect(mockHandleAddNew).toHaveBeenCalled();
  });

  test("calls search and filter handlers", async () => {
    const user = userEvent.setup();

    render(<PracticeContentManagementPage />);

    await user.type(screen.getByPlaceholderText("Search content"), "reading");

    expect(mockSetSearchQuery).toHaveBeenCalled();

    await user.selectOptions(screen.getByLabelText("Filter skill"), "READING");

    expect(mockSetFilterSkill).toHaveBeenCalledWith("READING");
  });

  test("calls edit and delete handlers from table", async () => {
    const user = userEvent.setup();

    render(<PracticeContentManagementPage />);

    await user.click(
      screen.getByRole("button", { name: /edit reading practice 1/i }),
    );

    expect(mockHandleEdit).toHaveBeenCalledWith(mockContents[0]);

    await user.click(
      screen.getByRole("button", { name: /delete reading practice 1/i }),
    );

    expect(mockHandleDelete).toHaveBeenCalledWith("content-1");
  });

  test("renders skill modal when open and calls modal handlers", async () => {
    const user = userEvent.setup();

    vi.mocked(usePracticeContentState).mockReturnValue({
      searchQuery: "",
      setSearchQuery: mockSetSearchQuery,
      filterSkill: "ALL",
      setFilterSkill: mockSetFilterSkill,
      filteredContents: mockContents,
      handleDelete: mockHandleDelete,
      handleEdit: mockHandleEdit,
      handleAddNew: mockHandleAddNew,
      isSkillModalOpen: true,
      setIsSkillModalOpen: mockSetIsSkillModalOpen,
      handleSkillSelect: mockHandleSkillSelect,
    } as any);

    render(<PracticeContentManagementPage />);

    expect(screen.getByTestId("skill-selection-modal")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /select reading/i }));

    expect(mockHandleSkillSelect).toHaveBeenCalledWith("READING");

    await user.click(screen.getByRole("button", { name: /close modal/i }));

    expect(mockSetIsSkillModalOpen).toHaveBeenCalledWith(false);
  });
});
