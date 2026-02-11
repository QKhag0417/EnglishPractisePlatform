import { useState } from "react";
import { useNavigate } from "react-router";
import imgEllipse2 from "figma:asset/9a288964fe3263113bbb7774d6f4ff60e22ab39b.png";
import { ProfileDropdown } from "./ProfileDropdown";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { IELTSMastermindLogo } from "./Logo";

function DownArrow() {
  return (
    <div className="h-[24px] relative shrink-0 w-[29px]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 29 24"
      >
        <g id="Down Arrow">
          <path
            d="M10 10L14.5 14L19 10"
            id="Vector"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
}

interface NavItemProps {
  label: string;
  hasDropdown?: boolean;
  onClick?: () => void;
  dropdownItems?: { label: string; onClick: () => void }[];
}

function NavItem({
  label,
  hasDropdown = false,
  onClick,
  dropdownItems,
}: NavItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => hasDropdown && setIsOpen(true)}
      onMouseLeave={() => hasDropdown && setIsOpen(false)}
    >
      <div
        className="content-stretch flex gap-[10px] items-center relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity pb-2"
        onClick={onClick}
      >
        <p className="font-['DM_Sans'] font-medium leading-[23px] relative shrink-0 text-[18px] text-nowrap text-white whitespace-pre">
          {label}
        </p>
        {hasDropdown && <DownArrow />}
      </div>

      {/* Dropdown Menu */}
      {hasDropdown && isOpen && dropdownItems && (
        <div className="absolute top-full left-0 bg-white rounded-[8px] shadow-lg py-2 min-w-[180px] z-50">
          {dropdownItems.map((item, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                item.onClick();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors font-['DM_Sans'] text-[16px] text-gray-800"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NavMenu() {
  const navigate = useNavigate();

  return (
    <div className="content-stretch flex gap-[32px] items-center justify-center relative shrink-0">
      <NavItem label="Home" onClick={() => navigate("/")} />
      <NavItem
        label="Listening"
        hasDropdown
        dropdownItems={[
          {
            label: "Overview",
            onClick: () => navigate("/listening/overview"),
          },
          { label: "Exercise", onClick: () => navigate("/listening/browse") },
        ]}
      />
      <NavItem
        label="Reading"
        hasDropdown
        dropdownItems={[
          { label: "Overview", onClick: () => navigate("/reading/overview") },
          { label: "Exercise", onClick: () => navigate("/reading/browse") },
        ]}
      />
      <NavItem
        label="Writing"
        hasDropdown
        dropdownItems={[
          { label: "Overview", onClick: () => navigate("/writing/overview") },
          { label: "Exercise", onClick: () => navigate("/writing/browse") },
        ]}
      />
      <NavItem
        label="Speaking"
        hasDropdown
        dropdownItems={[
          {
            label: "Overview",
            onClick: () => navigate("/speaking/overview"),
          },
          { label: "Exercise", onClick: () => navigate("/speaking/browse") },
        ]}
      />
      <NavItem
        label="Test"
        hasDropdown
        dropdownItems={[
          { label: "Mock Test", onClick: () => navigate("/mocktest") },
          {
            label: "Evaluation Test",
            onClick: () => navigate("/evaluation-test"),
          },
        ]}
      />
    </div>
  );
}

interface ProfileProps {
  onLogout: () => void;
}

function Profile({ onLogout }: ProfileProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div
        className="content-stretch flex gap-[10px] items-start relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="relative shrink-0 size-[49px] rounded-full overflow-hidden">
          <ImageWithFallback
            alt="User profile"
            className="block max-w-none size-full object-cover"
            height="49"
            src="https://images.unsplash.com/photo-1655249493799-9cee4fe983bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBlcnNvbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MzYzODMyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            width="49"
          />
        </div>
      </div>

      {isOpen && (
        <ProfileDropdown
          onClose={() => setIsOpen(false)}
          onLogout={() => {
            setIsOpen(false);
            onLogout();
          }}
        />
      )}
    </div>
  );
}

interface NavBarLearnerProps {
  onLogout?: () => void;
}

export function NavBarLearner({ onLogout }: NavBarLearnerProps) {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-[#1977f3] box-border content-stretch flex h-[66px] items-center justify-between px-[12px] py-[8px] z-50">
      <IELTSMastermindLogo />
      <NavMenu />
      <Profile onLogout={handleLogout} />
    </div>
  );
}

export function NavBarGuest() {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 bg-[#1977f3] box-border content-stretch flex h-[66px] items-center justify-between px-[12px] py-[8px] z-50">
      <IELTSMastermindLogo />
      <NavMenu />
      <div className="flex gap-[12px] items-center">
        <button
          onClick={() => navigate("/login")}
          className="px-[24px] py-[8px] bg-white text-[#1977f3] rounded-[8px] font-['DM_Sans'] font-medium text-[16px] hover:bg-gray-100 transition-colors"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/register")}
          className="px-[24px] py-[8px] bg-[#fcbf65] text-black rounded-[8px] font-['DM_Sans'] font-medium text-[16px] hover:bg-[#e5ab52] transition-colors"
        >
          Register
        </button>
      </div>
    </div>
  );
}
