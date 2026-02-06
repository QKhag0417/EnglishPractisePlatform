import { useState } from "react";
import { useNavigate } from "react-router";
import { NavBarGuest } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { Eye, EyeOff } from "lucide-react";
import imgGoogle from "figma:asset/0fc5f61d030fba7f22a0e8832857641f73b1429d.png";
import imgFacebook from "figma:asset/87f8e5f96448d8585bf2ee689bd3cf9d28c432bb.png";
import { useAuth } from "../contexts/AuthContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

type FieldErrors = Partial<
  Record<"firstname" | "lastname" | "email" | "password", string>
>;

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async () => {
    // Client-side validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setGeneralError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setGeneralError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await register(firstName, lastName, email, password);

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
        <NavBarGuest />

        <div className="flex-1 flex items-center justify-center px-8 py-[80px]">
          <div className="bg-white rounded-[12px] border-4 border-[#4880ff] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-[60px] w-[738px]">
            <h1 className="font-['Inter'] font-extrabold text-[#4880ff] text-[32px] text-center mb-[40px]">
              Register
            </h1>

            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-[20px] mb-[30px]">
              <div>
                <label className="font-['Inter'] font-semibold text-[24px] text-black block mb-[10px]">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  className="w-full h-[60px] px-[20px] border border-[rgba(0,0,0,0.44)] rounded-[10px] focus:outline-none focus:border-[#4880ff]"
                />
              </div>

              <div>
                <label className="font-['Inter'] font-semibold text-[24px] text-black block mb-[10px]">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
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
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
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
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full h-[60px] px-[20px] pr-[60px] border border-[rgba(0,0,0,0.44)] rounded-[10px] focus:outline-none focus:border-[#4880ff]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-[20px] top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
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
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full h-[60px] px-[20px] pr-[60px] border border-[rgba(0,0,0,0.44)] rounded-[10px] focus:outline-none focus:border-[#4880ff]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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

            {/* GENERAL ERROR (old logic) */}
            {generalError && (
              <p className="text-red-500 text-center text-[20px] mb-[20px]">
                {generalError}
              </p>
            )}

            {/* Register Button */}
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full h-[60px] bg-[#fcbf65] border-2 border-black rounded-[10px] font-['Inter'] font-extrabold text-[24px] text-black hover:bg-[#e5ab52] transition-colors mb-[30px] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Register"}
            </button>

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
              <button className="flex-1 h-[60px] bg-white border border-[rgba(0,0,0,0.44)] rounded-[6px] flex items-center justify-center gap-[12px] hover:bg-gray-50 transition-colors">
                <img
                  src={imgGoogle}
                  alt="Google"
                  className="w-[43px] h-[43px]"
                />
                <span className="font-['Inter'] font-semibold text-[24px] text-black">
                  Google
                </span>
              </button>
              <button className="flex-1 h-[60px] bg-white border border-[rgba(0,0,0,0.44)] rounded-[6px] flex items-center justify-center gap-[12px] hover:bg-gray-50 transition-colors">
                <img
                  src={imgFacebook}
                  alt="Facebook"
                  className="w-[43px] h-[43px]"
                />
                <span className="font-['Inter'] font-semibold text-[24px] text-black">
                  Facebook
                </span>
              </button>
            </div>

            {/* Login Link */}
            <p className="font-['Inter'] text-[22px] text-black text-center">
              Already have an account?{" "}
              <button
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
