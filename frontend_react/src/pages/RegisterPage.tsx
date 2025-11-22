import { useState } from "react";
import { NavBarGuest } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { Page } from "../App";
import { Eye, EyeOff } from "lucide-react";
import imgGoogle from "figma:asset/0fc5f61d030fba7f22a0e8832857641f73b1429d.png";
import imgFacebook from "figma:asset/87f8e5f96448d8585bf2ee689bd3cf9d28c432bb.png";
import { useAuth } from "../contexts/AuthContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface RegisterPageProps {
  setCurrentPage: (page: Page) => void;
}

export function RegisterPage({ setCurrentPage }: RegisterPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<any>({});
  const [generalError, setGeneralError] = useState("");

  const [loading, setLoading] = useState(false);

  const { register } = useAuth();

  // -----------------------------------------
  // REGISTER HANDLER (FULL FIXED)
  // -----------------------------------------
const handleRegister = async () => {
  setErrors({});
  setGeneralError("");

  // --------------------------------------------------
  // CLIENT-SIDE VALIDATION (confirmPassword only exists here)
  // --------------------------------------------------
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

    setCurrentPage("home");
  } catch (err: any) {
    console.log("REGISTER ERR:", err);

    // --------------------------------------------------
    // BACKEND GENERAL ERROR: { error: "field: message" }
    // --------------------------------------------------
    if (err.error) {
      const raw = err.error;
      const cleanMsg = raw.includes(":")
        ? raw.split(":").slice(1).join(":").trim()
        : raw;

      setGeneralError(cleanMsg);
      return;
    }

    // --------------------------------------------------
    // BACKEND FIELD ERRORS: show ONLY FIRST in priority order
    // --------------------------------------------------
    const fieldOrder = ["firstname", "lastname", "email", "password"];

    for (const field of fieldOrder) {
      if (err[field]) {
        const raw = err[field];

        const cleanMsg = raw.includes(":")
          ? raw.split(":").slice(1).join(":").trim()
          : raw;

        setGeneralError(cleanMsg);
        return; // stop after first error
      }
    }

    // fallback
    setGeneralError("Registration failed. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1752920299210-0b727800ea50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWJyYXJ5JTIwYm9va3MlMjBsZWFybmluZ3xlbnwxfHx8fDE3NjM2NDM0NTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
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
      <div className="relative z-10">
        <NavBarGuest setCurrentPage={setCurrentPage} />

        <div className="pt-[100px] pb-[60px] flex items-center justify-center min-h-[calc(100vh-66px-400px)]">
          <div className="bg-white rounded-[12px] border-4 border-[#4880ff] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-[60px] w-[738px]">
            <h1 className="font-['Inter'] font-extrabold text-[#4880ff] text-[32px] text-center mb-[40px]">
              Register
            </h1>

            {/* NAME */}
            <div className="grid grid-cols-2 gap-[20px] mb-[30px]">
              <InputField
                label="First Name"
                value={firstName}
                setValue={setFirstName}
                placeholder="Enter your first name"
                error={errors.firstname}
              />
              <InputField
                label="Last Name"
                value={lastName}
                setValue={setLastName}
                placeholder="Enter your last name"
                error={errors.lastname}
              />
            </div>

            {/* EMAIL */}
            <InputField
              label="Email"
              type="email"
              value={email}
              setValue={setEmail}
              placeholder="your.email@example.com"
              error={errors.email}
            />

            {/* PASSWORD */}
            <PasswordField
              label="Password"
              value={password}
              setValue={setPassword}
              show={showPassword}
              setShow={setShowPassword}
              placeholder="Create a password"
              error={errors.password}
            />

            {/* CONFIRM PASSWORD */}
            <PasswordField
              label="Confirm Password"
              value={confirmPassword}
              setValue={setConfirmPassword}
              show={showConfirmPassword}
              setShow={setShowConfirmPassword}
              placeholder="Confirm your password"
            />

            {/* GENERAL ERROR */}
            {generalError && (
              <p className="text-red-500 text-center text-[20px] mb-[20px]">
                {generalError}
              </p>
            )}

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full h-[60px] bg-[#fcbf65] border-2 border-black rounded-[10px] font-['Inter'] font-extrabold text-[24px] text-black hover:bg-[#e5ab52] transition-colors mb-[30px]"
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

            {/* Social */}
            <div className="flex gap-[20px] mb-[30px]">
              <SocialButton src={imgGoogle} label="Google" />
              <SocialButton src={imgFacebook} label="Facebook" />
            </div>

            {/* Login link */}
            <p className="font-['Inter'] text-[22px] text-black text-center">
              Already have an account?{" "}
              <button
                onClick={() => setCurrentPage("login")}
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

/* ----------------------------- */
/*       INPUT COMPONENT         */
/* ----------------------------- */
function InputField({ label, value, setValue, type = "text", placeholder, error }: any) {
  return (
    <div className="mb-[10px]">
      <label className="font-['Inter'] font-semibold text-[24px] text-black block mb-[10px]">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={`w-full h-[60px] px-[20px] border rounded-[10px] focus:outline-none ${
          error ? "border-red-500" : "border-[rgba(0,0,0,0.44)] focus:border-[#4880ff]"
        }`}
      />

      {error && <p className="text-red-500 mt-[5px] text-[18px]">{error}</p>}
    </div>
  );
}

/* ----------------------------- */
/*       PASSWORD COMPONENT      */
/* ----------------------------- */
function PasswordField({ label, value, setValue, show, setShow, placeholder, error }: any) {
  return (
    <div className="mb-[10px]">
      <label className="font-['Inter'] font-semibold text-[24px] text-black block mb-[10px]">
        {label}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className={`w-full h-[60px] px-[20px] pr-[60px] border rounded-[10px] focus:outline-none ${
            error ? "border-red-500" : "border-[rgba(0,0,0,0.44)] focus:border-[#4880ff]"
          }`}
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-[20px] top-1/2 -translate-y-1/2"
        >
          {show ? (
            <EyeOff className="w-[24px] h-[24px] text-gray-600" />
          ) : (
            <Eye className="w-[24px] h-[24px] text-gray-600" />
          )}
        </button>
      </div>

      {error && <p className="text-red-500 mt-[5px] text-[18px]">{error}</p>}
    </div>
  );
}

/* ----------------------------- */
/*       SOCIAL BUTTONS          */
/* ----------------------------- */
function SocialButton({ src, label }: any) {
  return (
    <button className="flex-1 h-[60px] bg-white border border-[rgba(0,0,0,0.44)] rounded-[6px] flex items-center justify-center gap-[12px] hover:bg-gray-50 transition-colors">
      <img src={src} alt={label} className="w-[43px] h-[43px]" />
      <span className="font-['Inter'] font-semibold text-[24px] text-black">
        {label}
      </span>
    </button>
  );
}