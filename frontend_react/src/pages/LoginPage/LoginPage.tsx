import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../../components/Footer";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { API_BASE } from "../../env";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useTogglePassword, useAuthForm } from "./hooks";
import { NavBarUnified } from "../../components/NavBarUnified";

export function LoginPage() {
  // =========================
  // Auth
  // =========================

  const { login } = useAuth();

  // =========================
  // Toggle Password
  // =========================

  const togglePassword = useTogglePassword(false);

  // =========================
  // Auth Form
  // =========================

  const authForm = useAuthForm();

  // =========================
  // Handle Login
  // =========================

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setError("");

    const formData = e?.currentTarget ? new FormData(e.currentTarget) : null;

    const email = (
      formData ? String(formData.get("email") || "") : authForm.email
    ).trim();

    const password = formData
      ? String(formData.get("password") || "")
      : authForm.password;

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const loggedInUser = await login(email, password);

      const role = String(loggedInUser.role).toLowerCase();
      if (role === "administrator") {
        navigate("/content-management");
      } else if (role === "tutor") {
        navigate("/tutor/dashboard");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      const msg =
        typeof err === "string" ? err : err?.message ? String(err.message) : "";
      setError(msg || "Invalid email or password!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = API_BASE + "/oauth2/authorization/google";
  };

  const handleFacebookLogin = () => {
    window.location.href = API_BASE + "/oauth2/authorization/facebook";
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1531280518436-9f2cc0fff88a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkeSUyMGJvb2tzJTIwZWR1Y2F0aW9uJTIwZ3JhZGllbnR8ZW58MXx8fHwxNzYzNjQzNDU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#e8f4f8]/95 via-[#f0f9ff]/90 to-[#dbeafe]/95"></div>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        <NavBarUnified />

        <div className="flex-1 flex items-center justify-center px-8 py-[80px]">
          <div className="bg-white rounded-[12px] border-4 border-[#4880ff] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-[60px] w-[738px]">
            <h1 className="font-['Inter'] font-extrabold text-[#4880ff] text-[32px] text-center mb-[40px]">
              Login
            </h1>

            <form onSubmit={handleLogin}>
              {/* Email */}
              <div className="mb-[30px]">
                <label
                  htmlFor="login-email"
                  className="font-['Inter'] font-semibold text-[24px] text-black block mb-[10px]"
                >
                  Email
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  value={authForm.email}
                  onChange={(e) => authForm.setEmail(e.target.value)}
                  className="w-full h-[60px] px-[20px] border border-[rgba(0,0,0,0.44)] rounded-[10px] focus:outline-none focus:border-[#4880ff]"
                  placeholder="your.email@example.com"
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div className="mb-[15px]">
                <label
                  htmlFor="login-password"
                  className="font-['Inter'] font-semibold text-[24px] text-black block mb-[10px]"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    name="password"
                    type={togglePassword.showPassword ? "text" : "password"}
                    value={authForm.password}
                    onChange={(e) => authForm.setPassword(e.target.value)}
                    className="w-full h-[60px] px-[20px] pr-[60px] border border-[rgba(0,0,0,0.44)] rounded-[10px] focus:outline-none focus:border-[#4880ff]"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    id="toggle-password-button"
                    type="button"
                    onClick={togglePassword.togglePassword}
                    className="absolute right-[20px] top-1/2 -translate-y-1/2"
                  >
                    {togglePassword.showPassword ? (
                      <EyeOff className="w-[24px] h-[24px] text-gray-600" />
                    ) : (
                      <Eye className="w-[24px] h-[24px] text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="mb-[20px] text-right">
                <button
                  id="forgot-password-button"
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="font-['Inter'] font-semibold text-[20px] text-[#dc3545] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Error message */}
              {error && (
                <p className="text-red-500 text-center text-[20px] mb-[20px]">
                  {error}
                </p>
              )}

              {/* Login Button */}
              <button
                id="login-submit-button"
                type="submit"
                disabled={loading}
                className="w-full h-[60px] bg-[#fcbf65] border-2 border-black rounded-[10px] font-['Inter'] font-extrabold text-[24px] text-black hover:bg-[#e5ab52] transition-colors mb-[30px] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-[20px] mb-[30px]">
              <div className="flex-1 h-[1px] bg-black" />
              <span className="font-['Inter'] text-[22px] text-black">
                or login with
              </span>
              <div className="flex-1 h-[1px] bg-black" />
            </div>

            {/* Social Login */}
            <div className="flex gap-[20px] mb-[30px]">
              <button
                id="google-login-button"
                type="button"
                onClick={handleGoogleLogin}
                className="flex-1 h-[60px] bg-white border border-[rgba(0,0,0,0.44)] rounded-[6px] flex items-center justify-center gap-[12px] hover:bg-gray-50 transition-colors"
              >
                <FcGoogle className="w-[43px] h-[43px]" />
                <span className="font-['Inter'] font-semibold text-[24px] text-black">
                  Google
                </span>
              </button>

              <button
                id="facebook-login-button"
                type="button"
                onClick={handleFacebookLogin}
                className="flex-1 h-[60px] bg-white border border-[rgba(0,0,0,0.44)] rounded-[6px] flex items-center justify-center gap-[12px] hover:bg-gray-50 transition-colors"
              >
                <FaFacebook className="w-[43px] h-[43px] text-[#1877F2]" />
                <span className="font-['Inter'] font-semibold text-[24px] text-black">
                  Facebook
                </span>
              </button>
            </div>

            {/* Register Link */}
            <p className="font-['Inter'] text-[22px] text-black text-center">
              Don&apos;t have an account?{" "}
              <button
                id="register-button"
                type="button"
                onClick={() => navigate("/register")}
                className="font-['Inter'] font-semibold italic text-[#4880ff] hover:underline"
              >
                Register
              </button>
            </p>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
