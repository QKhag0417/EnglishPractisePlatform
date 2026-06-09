import { useState } from "react";
import { NavBarGuest } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useNavigate } from "react-router";

type Step = "email" | "code" | "new-password" | "success";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        "http://localhost:8080/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      if (!res.ok) {
        throw new Error("Failed to send reset code");
      }

      setCode(["", "", "", ""]);
      setCurrentStep("code");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleCodeKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyCode = async () => {
    const enteredCode = code.join("");

    if (enteredCode.length !== 4) {
      setError("Please enter the 4-digit code");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        "http://localhost:8080/api/auth/verify-reset-code",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            code: enteredCode,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Invalid or expired code");
      }

      setResetToken(data.data.resetToken);
      setCurrentStep("new-password");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetToken) {
      setError("Reset token missing. Please retry forgot password.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:8080/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resetToken,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to reset password");
      }

      setCurrentStep("success");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    navigate("/login");
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

        <div className="absolute inset-0 bg-gradient-to-br from-[#fcbf65]/90 via-[#ffd491]/85 to-[#1977f3]/80"></div>

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
        <NavBarGuest />

        <div className="flex-1 flex items-center justify-center px-8 py-[80px]">
          <div className="bg-white rounded-[12px] border-4 border-[#4880ff] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-[60px] w-[738px]">
            {/* Step 1: Enter Email */}
            {currentStep === "email" && (
              <>
                <h1 className="font-['Inter'] font-extrabold text-[#4880ff] text-[32px] text-center mb-[20px]">
                  Forgot Password?
                </h1>
                <p className="font-['Inter'] text-[18px] text-gray-600 text-center mb-[40px]">
                  Enter your email address and we'll send you a verification
                  code
                </p>

                {/* Email */}
                <div className="mb-[30px]">
                  <label className="font-['Inter'] font-semibold text-[24px] text-black block mb-[10px]">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-[60px] px-[20px] border border-[rgba(0,0,0,0.44)] rounded-[10px] focus:outline-none focus:border-[#4880ff]"
                    placeholder="your.email@example.com"
                  />
                </div>

                {error && (
                  <p className="font-['Inter'] text-[16px] text-red-600 mb-[20px] text-center">
                    {error}
                  </p>
                )}

                {/* Send Code Button */}
                <button
                  onClick={handleSendCode}
                  disabled={loading}
                  className="w-full h-[60px] bg-[#fcbf65] border-2 border-black rounded-[10px] font-['Inter'] font-extrabold text-[24px] text-black hover:bg-[#e5ab52] transition-colors mb-[30px]"
                >
                  {loading ? "Processing..." : "Send Code"}
                </button>

                {/* Back to Login */}
                <p className="font-['Inter'] text-[22px] text-black text-center">
                  Remember your password?{" "}
                  <button
                    onClick={() => navigate("/login")}
                    className="font-['Inter'] font-semibold italic text-[#4880ff] hover:underline"
                  >
                    Back to Login
                  </button>
                </p>
              </>
            )}

            {/* Step 2: Enter Verification Code */}
            {currentStep === "code" && (
              <>
                <h1 className="font-['Inter'] font-extrabold text-[#4880ff] text-[32px] text-center mb-[20px]">
                  Enter Verification Code
                </h1>
                <p className="font-['Inter'] text-[18px] text-gray-600 text-center mb-[10px]">
                  We've sent a 4-digit code to
                </p>
                <p className="font-['Inter'] text-[18px] font-semibold text-[#4880ff] text-center mb-[40px]">
                  {email}
                </p>

                {/* Code Inputs */}
                <div className="mb-[30px]">
                  <label className="font-['Inter'] font-semibold text-[24px] text-black block mb-[20px] text-center">
                    Verification Code
                  </label>
                  <div className="flex gap-[20px] justify-center">
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        id={`code-input-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleCodeChange(index, e.target.value)
                        }
                        onKeyDown={(e) => handleCodeKeyDown(index, e)}
                        className="w-[80px] h-[80px] text-center text-[32px] font-bold border-2 border-[rgba(0,0,0,0.44)] rounded-[10px] focus:outline-none focus:border-[#4880ff]"
                      />
                    ))}
                  </div>
                </div>

                {error && (
                  <p className="font-['Inter'] text-[16px] text-red-600 mb-[20px] text-center">
                    {error}
                  </p>
                )}

                {/* Verify Button */}
                <button
                  onClick={handleVerifyCode}
                  className="w-full h-[60px] bg-[#fcbf65] border-2 border-black rounded-[10px] font-['Inter'] font-extrabold text-[24px] text-black hover:bg-[#e5ab52] transition-colors mb-[20px]"
                >
                  Verify Code
                </button>

                {/* Resend Code */}
                <p className="font-['Inter'] text-[18px] text-black text-center">
                  Didn't receive the code?{" "}
                  <button
                    onClick={handleSendCode}
                    className="font-['Inter'] font-semibold text-[#4880ff] hover:underline"
                  >
                    Resend
                  </button>
                </p>
              </>
            )}

            {/* Step 3: Enter New Password */}
            {currentStep === "new-password" && (
              <>
                <h1 className="font-['Inter'] font-extrabold text-[#4880ff] text-[32px] text-center mb-[20px]">
                  Create New Password
                </h1>
                <p className="font-['Inter'] text-[18px] text-gray-600 text-center mb-[40px]">
                  Please enter your new password
                </p>

                {/* New Password */}
                <div className="mb-[30px]">
                  <label className="font-['Inter'] font-semibold text-[24px] text-black block mb-[10px]">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full h-[60px] px-[20px] pr-[60px] border border-[rgba(0,0,0,0.44)] rounded-[10px] focus:outline-none focus:border-[#4880ff]"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-[20px] top-1/2 -translate-y-1/2"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-[24px] h-[24px] text-gray-600" />
                      ) : (
                        <Eye className="w-[24px] h-[24px] text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="mb-[30px]">
                  <label className="font-['Inter'] font-semibold text-[24px] text-black block mb-[10px]">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-[60px] px-[20px] pr-[60px] border border-[rgba(0,0,0,0.44)] rounded-[10px] focus:outline-none focus:border-[#4880ff]"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-[20px] top-1/2 -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-[24px] h-[24px] text-gray-600" />
                      ) : (
                        <Eye className="w-[24px] h-[24px] text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="font-['Inter'] text-[16px] text-red-600 mb-[20px] text-center">
                    {error}
                  </p>
                )}

                {/* Reset Password Button */}
                <button
                  onClick={handleResetPassword}
                  className="w-full h-[60px] bg-[#fcbf65] border-2 border-black rounded-[10px] font-['Inter'] font-extrabold text-[24px] text-black hover:bg-[#e5ab52] transition-colors"
                >
                  Reset Password
                </button>
              </>
            )}

            {/* Step 4: Success */}
            {currentStep === "success" && (
              <>
                <div className="flex flex-col items-center">
                  <div className="w-[100px] h-[100px] bg-green-100 rounded-full flex items-center justify-center mb-[30px]">
                    <CheckCircle className="w-[60px] h-[60px] text-green-600" />
                  </div>

                  <h1 className="font-['Inter'] font-extrabold text-[#4880ff] text-[32px] text-center mb-[20px]">
                    Password Reset Successful!
                  </h1>

                  <p className="font-['Inter'] text-[20px] text-gray-600 text-center mb-[50px]">
                    Your password has been successfully updated. You can now
                    login with your new password.
                  </p>

                  {/* Continue Button */}
                  <button
                    onClick={handleContinue}
                    className="w-full h-[60px] bg-[#fcbf65] border-2 border-black rounded-[10px] font-['Inter'] font-extrabold text-[24px] text-black hover:bg-[#e5ab52] transition-colors"
                  >
                    Continue to Login
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
