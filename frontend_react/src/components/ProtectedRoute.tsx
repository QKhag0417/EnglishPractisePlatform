import { ReactNode } from "react";
import { Navigate, useNavigate } from "react-router";
import { useAuth, UserRole } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // If not logged in, redirect to login
  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-[32px] font-bold text-gray-800 mb-4">
            Access Denied
          </h2>
          <p className="text-[18px] text-gray-600 mb-6">
            You need to be logged in to access this page.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-[24px] py-[12px] bg-[#1977f3] text-white rounded-[8px] font-medium hover:bg-[#1567d3] transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // If logged in but doesn't have the required role
  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-[32px] font-bold text-gray-800 mb-4">
            Access Denied
          </h2>
          <p className="text-[18px] text-gray-600 mb-6">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-[24px] py-[12px] bg-[#1977f3] text-white rounded-[8px] font-medium hover:bg-[#1567d3] transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // User has the required role, render the page
  return <>{children}</>;
}
