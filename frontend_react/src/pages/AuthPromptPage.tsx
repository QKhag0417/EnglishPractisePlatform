import { useNavigate } from "react-router";
import { NavBarGuest } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { LogIn, UserPlus } from "lucide-react";

export function AuthPromptPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1977f3] to-[#4a9fff] flex items-center justify-center px-4">
      <div className="bg-white rounded-[16px] shadow-2xl max-w-[600px] w-full p-[48px]">
        {/* Logo */}
        <div className="flex justify-center mb-[32px]">
          <div className="text-center">
            <h1 className="text-[#1977f3] mb-[8px]">IELTS Mastermind</h1>
            <div className="h-[4px] w-[80px] bg-[#fcbf65] mx-auto rounded-full"></div>
          </div>
        </div>

        {/* Main Message */}
        <div className="text-center mb-[40px]">
          <h2 className="text-[#1e1e1e] mb-[16px]">
            Ready to Start Your Practice?
          </h2>
          <p className="text-[#666666] text-[18px] leading-relaxed">
            To access practice exercises, mock tests, and track your progress,
            you'll need to create an account or log in to your existing account.
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-[#f8f9fa] rounded-[12px] p-[24px] mb-[40px]">
          <h3 className="text-[#1e1e1e] mb-[16px] text-center">
            What you'll get:
          </h3>
          <ul className="space-y-[12px]">
            <li className="flex items-start gap-[12px]">
              <div className="w-[6px] h-[6px] bg-[#1977f3] rounded-full mt-[8px] shrink-0"></div>
              <p className="text-[#666666]">
                Access to all practice exercises and mock tests
              </p>
            </li>
            <li className="flex items-start gap-[12px]">
              <div className="w-[6px] h-[6px] bg-[#1977f3] rounded-full mt-[8px] shrink-0"></div>
              <p className="text-[#666666]">
                Track your progress and performance
              </p>
            </li>
            <li className="flex items-start gap-[12px]">
              <div className="w-[6px] h-[6px] bg-[#1977f3] rounded-full mt-[8px] shrink-0"></div>
              <p className="text-[#666666]">Bookmark your favorite exercises</p>
            </li>
            <li className="flex items-start gap-[12px]">
              <div className="w-[6px] h-[6px] bg-[#1977f3] rounded-full mt-[8px] shrink-0"></div>
              <p className="text-[#666666]">Personalized learning experience</p>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-[16px]">
          <button
            onClick={() => navigate("/register")}
            className="w-full flex items-center justify-center gap-[12px] px-[32px] py-[16px] bg-[#1977f3] text-white rounded-[12px] font-['DM_Sans'] font-medium text-[18px] hover:bg-[#1567d3] transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <UserPlus className="w-[24px] h-[24px]" />
            Create Free Account
          </button>

          <button
            onClick={() => navigate("/login")}
            className="w-full flex items-center justify-center gap-[12px] px-[32px] py-[16px] bg-white text-[#1977f3] border-2 border-[#1977f3] rounded-[12px] font-['DM_Sans'] font-medium text-[18px] hover:bg-[#f0f7ff] transition-all duration-200"
          >
            <LogIn className="w-[24px] h-[24px]" />
            Log In to Existing Account
          </button>
        </div>

        {/* Back Link */}
        <div className="text-center mt-[32px]">
          <button
            onClick={() => navigate("/")}
            className="text-[#666666] hover:text-[#1977f3] transition-colors text-[16px]"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
