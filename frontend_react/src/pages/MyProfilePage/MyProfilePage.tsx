import { useNavigate, useParams } from "react-router";
import { Footer } from "../../components/Footer";
import { User, ClipboardList, BarChart3 } from "lucide-react";
import { MyProfile, PracticeTestHistory, TestPerformance } from "./components";
import { NavBarUnified } from "../../components/NavBarUnified";
import { useAuth } from "../../contexts/AuthContext";

export function MyProfilePage() {
  // =========================
  // Auth
  // =========================

  const { user } = useAuth();

  // =========================
  // Get user role
  // =========================

  const role = user?.role;

  const isLearner = role === "learner";
  const isAdministrator = role === "administrator";
  const isTutor = role === "tutor";

  // =========================
  // Section from URL
  // =========================

  const { section } = useParams();

  const activeSection =
    section === "history" || section === "performance" ? section : "profile";

  // =========================
  // Navigation
  // =========================

  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <NavBarUnified />

      <div className="flex-1 pt-[80px]">
        <div className="max-w-[1400px] mx-auto px-[60px] py-[40px]">
          <div className="grid grid-cols-[280px_1fr] gap-[32px]">
            {/* Left Sidebar */}
            <div className="bg-white rounded-[12px] border border-gray-200 p-[20px] h-fit">
              <nav className="space-y-[8px]">
                <button
                  onClick={() => navigate("/my-profile")}
                  className={`w-full flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] transition-colors ${
                    activeSection === "profile"
                      ? "bg-blue-50 text-[#1977f3]"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <User className="w-[20px] h-[20px]" />
                  <span className="font-['Inter'] text-[14px] font-medium">
                    My Profile
                  </span>
                </button>

                {isLearner && (
                  <button
                    onClick={() => navigate("/my-profile/history")}
                    className={`w-full flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] transition-colors ${
                      activeSection === "history"
                        ? "bg-blue-50 text-[#1977f3]"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <ClipboardList className="w-[20px] h-[20px]" />
                    <span className="font-['Inter'] text-[14px] font-medium">
                      Practice Test History
                    </span>
                  </button>
                )}

                {isLearner && (
                  <button
                    onClick={() => navigate("/my-profile/performance")}
                    className={`w-full flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] transition-colors ${
                      activeSection === "performance"
                        ? "bg-blue-50 text-[#1977f3]"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <BarChart3 className="w-[20px] h-[20px]" />
                    <span className="font-['Inter'] text-[14px] font-medium">
                      Test Performance
                    </span>
                  </button>
                )}
              </nav>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-[12px] border border-gray-200 p-[40px]">
              {activeSection === "profile" ? (
                <MyProfile />
              ) : activeSection === "history" ? (
                <PracticeTestHistory />
              ) : activeSection === "performance" ? (
                <TestPerformance />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
