import { useState } from "react";
import { useNavigate } from "react-router";
import { ProfileDropdown } from "./ProfileDropdown";
import { IELTSMastermindLogo } from "./Logo";
import { useAuth } from "../contexts/AuthContext";
import { getAvatarMeta } from "./utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

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

export function NavItem({
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
      {/* <NavItem
        label="Test"
        hasDropdown
        dropdownItems={[
          { label: "Mock Test", onClick: () => navigate("/mocktest") },
          {
            label: "Evaluation Test",
            onClick: () => navigate("/evaluation-test"),
          },
        ]}
      /> */}
    </div>
  );
}

interface ProfileProps {}

export function Profile({}: ProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  // =========================
  // Get avatar meta
  // =========================

  const avatarMeta = getAvatarMeta(
    user?.firstname,
    user?.lastname,
    user?.avatarUrl,
  );

  return (
    <div className="relative">
      <div
        className="content-stretch flex gap-[10px] items-start relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className="content-stretch flex gap-[10px] items-start relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Avatar className="w-[44px] h-[44px] flex-shrink-0">
            <AvatarImage
              src={avatarMeta.avatarUrl || undefined}
              alt="User profile"
            />
            <AvatarFallback
              className={`${avatarMeta.colorClass} text-white font-['Inter'] font-semibold text-[20px]`}
            >
              {avatarMeta.initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {isOpen && <ProfileDropdown onClose={() => setIsOpen(false)} />}
    </div>
  );
}

interface NavBarLearnerProps {
  /**
   * @deprecated No longer used. This prop has no effect.
   */
  onLogout?: () => void;
}

export function NavBarLearner({ onLogout }: NavBarLearnerProps) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-[#1977f3] box-border content-stretch flex h-[66px] items-center justify-between px-[12px] py-[8px] z-50">
      <IELTSMastermindLogo />
      <NavMenu />
      <Profile />
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
          id="nav-login-button"
          onClick={() => navigate("/login")}
          className="px-[24px] py-[8px] bg-white text-[#1977f3] rounded-[8px] font-['DM_Sans'] font-medium text-[16px] hover:bg-gray-100 transition-colors"
        >
          Login
        </button>
        <button
          id="nav-register-button"
          onClick={() => navigate("/register")}
          className="px-[24px] py-[8px] bg-[#fcbf65] text-black rounded-[8px] font-['DM_Sans'] font-medium text-[16px] hover:bg-[#e5ab52] transition-colors"
        >
          Register
        </button>
      </div>
    </div>
  );
}
