import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { Footer } from "../../components/Footer";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { useRegisterForm, useTogglePassword } from "./hooks";
import { NavBarUnified } from "../../components/NavBarUnified";

type FieldErrors = Partial<
  Record<"firstname" | "lastname" | "email" | "password", string>
>;

export function RegisterPage() {
  // =========================
  // Auth
  // =========================

  const { register } = useAuth();

  // =========================
  // Toggle Password
  // =========================

  const togglePassword = useTogglePassword();

  // =========================
  // Register Form
  // =========================

  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
  } = useRegisterForm();

  // =========================
  // Handle Register
  // =========================

  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setGeneralError("");

    const formData = e?.currentTarget ? new FormData(e.currentTarget) : null;

    const submittedFirstName = formData
      ? String(formData.get("firstName") || "").trim()
      : firstName.trim();

    const submittedLastName = formData
      ? String(formData.get("lastName") || "").trim()
      : lastName.trim();

    const submittedEmail = formData
      ? String(formData.get("email") || "").trim()
      : email.trim();

    const submittedPassword = formData
      ? String(formData.get("password") || "")
      : password;

    const submittedConfirmPassword = formData
      ? String(formData.get("confirmPassword") || "")
      : confirmPassword;

    if (
      !submittedFirstName ||
      !submittedLastName ||
      !submittedEmail ||
      !submittedPassword ||
      !submittedConfirmPassword
    ) {
      setGeneralError("Please fill in all fields");
      return;
    }

    if (submittedPassword !== submittedConfirmPassword) {
      setGeneralError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await register(
        submittedFirstName,
        submittedLastName,
        submittedEmail,
        submittedPassword,
      );

      navigate("/");
    } catch (err: any) {
      console.log("REGISTER ERR:", err);

      // Server validation
      if (err?.error) {
        const raw = String(err.error);
        const cleanMsg = raw.includes(":")
          ? raw.split(":").slice(1).join(":").trim()
          : raw;

        setGeneralError(cleanMsg);
        return;
      }

      const fieldOrder: Array<keyof FieldErrors> = [
        "firstname",
        "lastname",
        "email",
        "password",
      ];

      for (const field of fieldOrder) {
        if (err?.[field]) {
          const raw = String(err[field]);
          const cleanMsg = raw.includes(":")
            ? raw.split(":").slice(1).join(":").trim()
            : raw;

          setGeneralError(cleanMsg);
          return;
        }
      }

      // fallback (or thrown Error)
      if (err instanceof Error && err.message) {
        setGeneralError(err.message);
        return;
      }

      setGeneralError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const handleFacebookRegister = () => {
    window.location.href =
      "http://localhost:8080/oauth2/authorization/facebook";
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1752920299210-0b727800ea50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWJyYXJ5JTIwYm9va3MlMjBsZWFybmluZ3xlbnwxfHx8fDE3NjM2NDM0NTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#fff3e0]/95 via-[#ffe4b5]/90 to-[#ffd89b]/95"></div>
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
              Register
            </h1>

            <form id="register-form" onSubmit={handleRegister}>
              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-[20px] mb-[30px]">
                <div>
                  <label className="font-['Inter'] font-semibold text-[24px] text-black block mb-[10px]">
                    First Name
                  </label>
                  <input
                    id="register-first-name"
                    name="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    autoComplete="given-name"
                    className="w-full h-[60px] px-[20px] border border-[rgba(0,0,0,0.44)] rounded-[10px] focus:outline-none focus:border-[#4880ff]"
                  />
                </div>

                <div>
                  <label className="font-['Inter'] font-semibold text-[24px] text-black block mb-[10px]">
                    Last Name
                  </label>
                  <input
                    id="register-last-name"
                    name="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    autoComplete="family-name"
                    className="w-full h-[60px] px-[20px] border border-[rgba(0,0,0,0.44)] rounded-[10px] focus:outline-none focus:border-[#4880ff]"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-[30px]">
                <label className="font-['Inter'] font-semibold text-[24px] text-black block mb-[10px]">
                  Email
                </label>
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  autoComplete="email"
                  className="w-full h-[60px] px-[20px] border border-[rgba(0,0,0,0.44)] rounded-[10px] focus:outline-none focus:border-[#4880ff]"
                />
              </div>

              {/* Password */}
              <div className="mb-[30px]">
                <label className="font-['Inter'] font-semibold text-[24px] text-black block mb-[10px]">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="register-password"
                    name="password"
                    type={togglePassword.showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    className="w-full h-[60px] px-[20px] pr-[60px] border border-[rgba(0,0,0,0.44)] rounded-[10px] focus:outline-none focus:border-[#4880ff]"
                  />
                  <button
                    id="register-password-toggle-button"
                    type="button"
                    onClick={() =>
                      togglePassword.setShowPassword(
                        !togglePassword.showPassword,
                      )
                    }
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

              {/* Confirm Password */}
              <div className="mb-[20px]">
                <label className="font-['Inter'] font-semibold text-[24px] text-black block mb-[10px]">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="register-confirm-password"
                    name="confirmPassword"
                    type={
                      togglePassword.showConfirmPassword ? "text" : "password"
                    }
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    className="w-full h-[60px] px-[20px] pr-[60px] border border-[rgba(0,0,0,0.44)] rounded-[10px] focus:outline-none focus:border-[#4880ff]"
                  />
                  <button
                    id="register-confirm-password-toggle-button"
                    type="button"
                    onClick={() =>
                      togglePassword.setShowConfirmPassword(
                        !togglePassword.showConfirmPassword,
                      )
                    }
                    className="absolute right-[20px] top-1/2 -translate-y-1/2"
                  >
                    {togglePassword.showConfirmPassword ? (
                      <EyeOff className="w-[24px] h-[24px] text-gray-600" />
                    ) : (
                      <Eye className="w-[24px] h-[24px] text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* GENERAL ERROR (old logic) */}
              {generalError && (
                <p
                  id="register-error-message"
                  className="text-red-500 text-center text-[20px] mb-[20px]"
                >
                  {generalError}
                </p>
              )}

              {/* Register Button */}
              <button
                id="register-submit-button"
                type="submit"
                disabled={loading}
                className="w-full h-[60px] bg-[#fcbf65] border-2 border-black rounded-[10px] font-['Inter'] font-extrabold text-[24px] text-black hover:bg-[#e5ab52] transition-colors mb-[30px] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-[20px] mb-[30px]">
              <div className="flex-1 h-[1px] bg-black" />
              <span className="font-['Inter'] text-[22px] text-black">
                or register with
              </span>
              <div className="flex-1 h-[1px] bg-black" />
            </div>

            {/* Social Register */}
            <div className="flex gap-[20px] mb-[30px]">
              <button
                id="google-register-button"
                type="button"
                onClick={handleGoogleRegister}
                className="flex-1 h-[60px] bg-white border border-[rgba(0,0,0,0.44)] rounded-[6px] flex items-center justify-center gap-[12px] hover:bg-gray-50 transition-colors"
              >
                <FcGoogle className="w-[43px] h-[43px]" />
                <span className="font-['Inter'] font-semibold text-[24px] text-black">
                  Google
                </span>
              </button>
              <button
                id="facebook-register-button"
                type="button"
                onClick={handleFacebookRegister}
                className="flex-1 h-[60px] bg-white border border-[rgba(0,0,0,0.44)] rounded-[6px] flex items-center justify-center gap-[12px] hover:bg-gray-50 transition-colors"
              >
                <FaFacebook className="w-[43px] h-[43px] text-[#1877F2]" />
                <span className="font-['Inter'] font-semibold text-[24px] text-black">
                  Facebook
                </span>
              </button>
            </div>

            {/* Login Link */}
            <p className="font-['Inter'] text-[22px] text-black text-center">
              Already have an account?{" "}
              <button
                id="login-link-button"
                type="button"
                onClick={() => navigate("/login")}
                className="font-['Inter'] font-semibold italic text-[#4880ff] hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
