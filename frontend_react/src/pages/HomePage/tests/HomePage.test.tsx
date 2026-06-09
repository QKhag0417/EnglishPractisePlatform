import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { HomePage } from "../HomePage";

const { mockNavigate } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
}));

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../../../components/NavBarUnified", () => ({
  NavBarUnified: () => <div data-testid="navbar">Navbar</div>,
}));

vi.mock("../../../components/Footer", () => ({
  Footer: () => <div data-testid="footer">Footer</div>,
}));

vi.mock("../../../components/figma/ImageWithFallback", () => ({
  ImageWithFallback: ({ src, alt, className }: any) => (
    <img
      data-testid="image-with-fallback"
      src={src}
      alt={alt}
      className={className}
    />
  ),
}));

vi.mock("lucide-react", () => ({
  ChevronLeft: () => <span>ChevronLeft</span>,
  ChevronRight: () => <span>ChevronRight</span>,
  BookOpen: () => <span>BookOpen</span>,
  Trophy: () => <span>Trophy</span>,
  Users: () => <span>Users</span>,
  Zap: () => <span>Zap</span>,
}));

vi.mock("figma:asset/5c2f46fbe8110f6b9ff43987b477d1270d3ffeef.png", () => ({
  default: "feature-real-format.png",
}));

vi.mock("figma:asset/1eff21458494ef41c65462b2789f5a6082f161c8.png", () => ({
  default: "feature-ai-scoring.png",
}));

vi.mock("figma:asset/577d4868435baa881d5b64f45db557c1042d04e9.png", () => ({
  default: "reading.png",
}));

vi.mock("figma:asset/bcdd3bfc80e3d2ce8f4a19178b607cb85cb9a8ee.png", () => ({
  default: "speaking.png",
}));

vi.mock("figma:asset/e9c4ff12ea38c2a89800b6f3c2055fa2156f37fc.png", () => ({
  default: "listening.png",
}));

vi.mock("figma:asset/79f59bf5912d98c84c9d2e2055387a0bd9773a30.png", () => ({
  default: "writing.png",
}));

const renderPage = () => render(<HomePage />);

const getHeroSlides = (container: HTMLElement) => {
  const heroSection = container.querySelector("section") as HTMLElement;

  return Array.from(heroSection.children).filter((child) =>
    (child as HTMLElement).className.includes("transition-opacity"),
  ) as HTMLElement[];
};

const expectActiveSlide = (container: HTMLElement, activeIndex: number) => {
  const slides = getHeroSlides(container);

  expect(slides).toHaveLength(3);

  slides.forEach((slide, index) => {
    if (index === activeIndex) {
      expect(slide.className).toContain("opacity-100");
    } else {
      expect(slide.className).toContain("opacity-0");
    }
  });
};

const getSlideIndicatorButtons = (container: HTMLElement) => {
  const heroSection = container.querySelector("section") as HTMLElement;

  const indicatorContainer = Array.from(heroSection.children).find((child) =>
    (child as HTMLElement).className.includes("bottom-[24px]"),
  ) as HTMLElement;

  return within(indicatorContainer).getAllByRole("button");
};

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("rendering", () => {
    test("renders homepage layout and main sections", () => {
      renderPage();

      expect(screen.getByTestId("navbar")).toBeInTheDocument();
      expect(screen.getAllByTestId("footer").length).toBeGreaterThanOrEqual(1);

      expect(screen.getAllByText("WE TAKE YOUR").length).toBeGreaterThanOrEqual(
        1,
      );

      expect(
        screen.getAllByText("IELTS SCORE HIGHER").length,
      ).toBeGreaterThanOrEqual(1);

      expect(screen.getByText("Practice Exercises")).toBeInTheDocument();
      expect(screen.getByText("Active Students")).toBeInTheDocument();
      expect(screen.getByText("Skills Covered")).toBeInTheDocument();
      expect(screen.getByText("Instant Feedback")).toBeInTheDocument();

      expect(
        screen.getByText("Choose Your Path to Success"),
      ).toBeInTheDocument();
      expect(screen.getByText("Why IELTS Mastermind?")).toBeInTheDocument();

      expect(
        screen.getByText("Ready to Start Your IELTS Journey?"),
      ).toBeInTheDocument();
    });

    test("renders all carousel slides, skill cards, feature cards, and CTA content", () => {
      renderPage();

      expect(screen.getByText("IELTS SCORE HIGHER")).toBeInTheDocument();
      expect(screen.getByText("IELTS SKILLS")).toBeInTheDocument();
      expect(screen.getByText("AI-POWERED FEEDBACK")).toBeInTheDocument();

      expect(screen.getByText("Listening")).toBeInTheDocument();
      expect(screen.getByText("Reading")).toBeInTheDocument();
      expect(screen.getByText("Writing")).toBeInTheDocument();
      expect(screen.getByText("Speaking")).toBeInTheDocument();

      expect(screen.getByAltText("Listening")).toHaveAttribute(
        "src",
        "listening.png",
      );
      expect(screen.getByAltText("Reading")).toHaveAttribute(
        "src",
        "reading.png",
      );
      expect(screen.getByAltText("Writing")).toHaveAttribute(
        "src",
        "writing.png",
      );
      expect(screen.getByAltText("Speaking")).toHaveAttribute(
        "src",
        "speaking.png",
      );

      expect(
        screen.getByText("Real IELTS Format & Timing"),
      ).toBeInTheDocument();

      expect(
        screen.getByText("AI-Powered Instant Feedback"),
      ).toBeInTheDocument();

      expect(screen.getByAltText("Real IELTS Format")).toHaveAttribute(
        "src",
        "feature-real-format.png",
      );

      expect(screen.getByAltText("AI-Powered Scoring")).toHaveAttribute(
        "src",
        "feature-ai-scoring.png",
      );

      expect(screen.getByText(/Join 100,000\+ students/i)).toBeInTheDocument();
    });
  });

  describe("hero carousel", () => {
    test("shows the first slide as active by default", () => {
      const { container } = renderPage();

      expectActiveSlide(container, 0);
    });

    test("clicking next and previous buttons changes the active slide", async () => {
      const user = userEvent.setup();

      const { container } = renderPage();

      expectActiveSlide(container, 0);

      await user.click(
        screen.getByRole("button", {
          name: /chevronright/i,
        }),
      );

      expectActiveSlide(container, 1);

      await user.click(
        screen.getByRole("button", {
          name: /chevronleft/i,
        }),
      );

      expectActiveSlide(container, 0);
    });

    test("previous button wraps from first slide to last slide", async () => {
      const user = userEvent.setup();

      const { container } = renderPage();

      expectActiveSlide(container, 0);

      await user.click(
        screen.getByRole("button", {
          name: /chevronleft/i,
        }),
      );

      expectActiveSlide(container, 2);
    });

    test("clicking slide indicator changes the active slide", async () => {
      const user = userEvent.setup();

      const { container } = renderPage();

      expectActiveSlide(container, 0);

      const indicatorButtons = getSlideIndicatorButtons(container);

      await user.click(indicatorButtons[2]);

      expectActiveSlide(container, 2);
    });

    test("auto-play changes the active slide after interval", () => {
      vi.useFakeTimers();

      const { container } = renderPage();

      expectActiveSlide(container, 0);

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expectActiveSlide(container, 1);
    });
  });

  describe("navigation actions", () => {
    test("clicking hero Start Practicing navigates to listening page", async () => {
      const user = userEvent.setup();

      renderPage();

      const heroStartButtons = screen.getAllByRole("button", {
        name: /^start practicing$/i,
      });

      await user.click(heroStartButtons[0]);

      expect(mockNavigate).toHaveBeenCalledWith("/listening");
    });

    test("clicking bottom CTA navigates to listening page", async () => {
      const user = userEvent.setup();

      renderPage();

      await user.click(
        screen.getByRole("button", {
          name: /start practicing now/i,
        }),
      );

      expect(mockNavigate).toHaveBeenCalledWith("/listening");
    });

    test("clicking skill cards navigates to the correct skill pages", async () => {
      const user = userEvent.setup();

      renderPage();

      await user.click(screen.getByText("Listening"));
      expect(mockNavigate).toHaveBeenCalledWith("/listening");

      await user.click(screen.getByText("Reading"));
      expect(mockNavigate).toHaveBeenCalledWith("/reading");

      await user.click(screen.getByText("Writing"));
      expect(mockNavigate).toHaveBeenCalledWith("/writing");

      await user.click(screen.getByText("Speaking"));
      expect(mockNavigate).toHaveBeenCalledWith("/speaking");
    });
  });
});
