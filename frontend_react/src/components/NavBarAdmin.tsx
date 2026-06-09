import { useState } from "react";
import { useNavigate } from "react-router";
import { IELTSMastermindLogo } from "./Logo";
import { NavItem, Profile } from "./NavBar";
import { useAuth } from "../contexts/AuthContext";

function AdminNavMenu() {
  const navigate = useNavigate();

  return (
    <div className="content-stretch flex gap-[32px] items-center justify-center relative shrink-0">
      <NavItem
        label="Practice Content"
        onClick={() => navigate("/content-management")}
      />
      <NavItem
        label="User Management"
        onClick={() => navigate("/admin/users")}
      />
    </div>
  );
}

interface NavBarAdminProps {
  /**
   * @deprecated No longer used. This prop has no effect.
   */
  onLogout?: () => void;
}

export function NavBarAdmin({ onLogout }: NavBarAdminProps) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-[#1977f3] box-border content-stretch flex h-[66px] items-center justify-between px-[12px] py-[8px] z-50">
      <IELTSMastermindLogo />
      <AdminNavMenu />
      <Profile />
    </div>
  );
}
