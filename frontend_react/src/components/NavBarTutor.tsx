import { useNavigate } from "react-router";
import { IELTSMastermindLogo } from "./Logo";
import { NavItem, Profile } from "./NavBar";
import { useAuth } from "../contexts/AuthContext";

function TutorNavMenu() {
  const navigate = useNavigate();

  return (
    <div className="content-stretch flex gap-[32px] items-center justify-center relative shrink-0">
      <NavItem
        label="Student Submissions"
        onClick={() => navigate("/tutor/dashboard")}
      />
      <NavItem
        label="Practice Content"
        onClick={() => navigate("/content-management")}
      />
    </div>
  );
}

interface NavBarTutorProps {
  /**
   * @deprecated No longer used. This prop has no effect.
   */
  onLogout?: () => void;
}

export function NavBarTutor({ onLogout }: NavBarTutorProps) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-[#1977f3] box-border content-stretch flex h-[66px] items-center justify-between px-[12px] py-[8px] z-50">
      <IELTSMastermindLogo />
      <TutorNavMenu />
      <Profile />
    </div>
  );
}
