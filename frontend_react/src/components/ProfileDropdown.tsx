import { User, Settings, LogOut, UserCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getAvatarMeta } from "./utils";

interface ProfileDropdownProps {
  onClose: () => void;
  onLogout?: () => void;
}

export function ProfileDropdown({ onClose, onLogout }: ProfileDropdownProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // =========================
  // Get user role
  // =========================

  const role = user?.role;
  const isLearner = role === "learner";
  const isAdministrator = role === "administrator";
  const isTutor = role === "tutor";

  // =========================
  // Hangle navigation
  // =========================

  const handleMyProfile = () => {
    navigate("/my-profile");
    onClose();
  };

  const handleStudyPlan = () => {
    onClose();
    navigate("/study-plan");
  };

  const handleSettings = () => {
    onClose();
    // navigate("/settings");
  };

  const handleLogoutClick = () => {
    onClose();
    handleLogout();
  };

  // =========================
  // Get avatar meta
  // =========================

  const avatar = getAvatarMeta(
    user?.firstname,
    user?.lastname,
    user?.avatarUrl,
  );

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Dropdown */}
      <div className="absolute right-0 top-[60px] bg-white rounded-[8px] border border-[rgba(0,0,0,0.1)] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)] p-[12px] w-[280px] z-50">
        {/* Profile Info */}
        <div className="flex gap-[16px] items-center mb-[10px] pb-[10px] border-b border-gray-200">
          <Avatar className="w-[50px] h-[50px] flex-shrink-0">
            <AvatarImage src={avatar.avatarUrl || undefined} alt="Profile" />
            <AvatarFallback
              className={`${avatar.colorClass} text-white font-['Inter'] font-semibold text-[20px]`}
            >
              {avatar.initials}
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="font-['Poppins'] text-[16px] text-gray-800 leading-[18px]">
              {user?.name || "User"}
            </p>
            <p className="font-['Roboto'] text-[12px] text-gray-500 leading-[16px]">
              {user?.email || ""}
            </p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-[2px]">
          {(isLearner || isAdministrator || isTutor) && (
            <button
              onClick={handleMyProfile}
              className="w-full flex items-center gap-[10px] p-[10px] rounded-[6px] hover:bg-gray-100 transition-colors"
            >
              <UserCircle className="w-[24px] h-[24px] text-black" />
              <span className="font-['DM_Sans'] text-[14px] text-black">
                My Profile
              </span>
            </button>
          )}

          {isLearner && (
            <button
              onClick={handleStudyPlan}
              className="w-full flex items-center gap-[10px] p-[10px] rounded-[6px] hover:bg-gray-100 transition-colors"
            >
              <User className="w-[24px] h-[24px] text-black" />
              <span className="font-['DM_Sans'] text-[14px] text-black">
                Study Plan
              </span>
            </button>
          )}

          {(isLearner || isAdministrator || isTutor) && (
            <button
              onClick={handleSettings}
              className="w-full flex items-center gap-[10px] p-[10px] rounded-[6px] hover:bg-gray-100 transition-colors"
            >
              <Settings className="w-[24px] h-[24px] text-black" />
              <span className="font-['DM_Sans'] text-[14px] text-black">
                Settings
              </span>
            </button>
          )}

          {(isLearner || isAdministrator || isTutor) && (
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-[10px] p-[10px] rounded-[6px] hover:bg-gray-100 transition-colors"
            >
              <LogOut className="w-[24px] h-[24px] text-black" />
              <span className="font-['DM_Sans'] text-[14px] text-black">
                Log Out
              </span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
