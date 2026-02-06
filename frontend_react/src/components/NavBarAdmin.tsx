import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { AdminProfileDropdown } from "./AdminProfileDropdown";
import imgEllipse2 from "figma:asset/9a288964fe3263113bbb7774d6f4ff60e22ab39b.png";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { IELTSMastermindLogo } from "./Logo";

interface NavBarAdminProps {
  onLogout?: () => void;
}

export function NavBarAdmin({ onLogout }: NavBarAdminProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const isActiveRoute = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="fixed top-0 left-0 right-0 bg-[#1977f3] box-border content-stretch flex h-[66px] items-center justify-between px-[12px] py-[8px] z-50">
      <IELTSMastermindLogo />

      <div className="flex gap-[32px] items-center">
        <button
          onClick={() => navigate("/admin/content-management")}
          className={`font-['DM_Sans'] font-medium text-[18px] ${
            isActiveRoute("/admin/content")
              ? "text-[#fcbf65]"
              : "text-white hover:opacity-80"
          } transition-opacity`}
        >
          Practice Content
        </button>
        <button
          onClick={() => navigate("/admin/users")}
          className={`font-['DM_Sans'] font-medium text-[18px] ${
            isActiveRoute("/admin/users")
              ? "text-[#fcbf65]"
              : "text-white hover:opacity-80"
          } transition-opacity`}
        >
          User Management
        </button>
      </div>

      <div className="relative">
        <div
          className="content-stretch flex gap-[10px] items-start relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setIsProfileOpen(!isProfileOpen)}
        >
          <div className="relative shrink-0 size-[49px] rounded-full overflow-hidden">
            <ImageWithFallback
              alt="Admin profile"
              className="block max-w-none size-full object-cover"
              height="49"
              src="https://images.unsplash.com/photo-1655249493799-9cee4fe983bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBlcnNvbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MzYzODMyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              width="49"
            />
          </div>
        </div>

        {isProfileOpen && (
          <AdminProfileDropdown
            onClose={() => setIsProfileOpen(false)}
            onLogout={() => {
              setIsProfileOpen(false);
              handleLogout();
            }}
          />
        )}
      </div>
    </div>
  );
}
