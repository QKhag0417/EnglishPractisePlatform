import { useState } from 'react';
import { NavBarGuest } from '../components/NavBar';
import { Footer } from '../components/Footer';
import { Page } from '../App';
import { Eye, EyeOff } from 'lucide-react';
import imgGoogle from "figma:asset/0fc5f61d030fba7f22a0e8832857641f73b1429d.png";
import imgFacebook from "figma:asset/87f8e5f96448d8585bf2ee689bd3cf9d28c432bb.png";
import { useAuth } from '../contexts/AuthContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface LoginPageProps {
  setCurrentPage: (page: Page) => void;
}

export function LoginPage({ setCurrentPage }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login} = useAuth();

  const handleLogin = async () => {
    setError("");

    try {
      const loggedInUser = await login(email, password);

      if (loggedInUser.role === "Administrator") {
        setCurrentPage("content-management");
      } else {
        setCurrentPage("home");
      }

    } catch (err) {
      setError("Invalid email or password");
    }
  };


  return (
    <div className="min-h-screen relative">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1531280518436-9f2cc0fff88a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkeSUyMGJvb2tzJTIwZWR1Y2F0aW9uJTIwZ3JhZGllbnR8ZW58MXx8fHwxNzYzNjQzNDU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Background"
          className="w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 bg-gradient-to-br from-[#1977f3]/90 via-[#4a9fff]/85 to-[#77cbf2]/90"></div>

        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <NavBarGuest setCurrentPage={setCurrentPage} />

        <div className="pt-[100px] pb-[60px] flex items-center justify-center min-h-[calc(100vh-66px-400px)]">
          <div className="bg-white rounded-[12px] border-4 border-[#4880ff] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-[60px] w-[738px]">
            <h1 className="font-['Inter'] font-extrabold text-[#4880ff] text-[32px] text-center mb-[40px]">
              Login
            </h1>

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

            {/* Password */}
            <div className="mb-[40px]">
              <label className="font-['Inter'] font-semibold text-[24px] text-black block mb-[10px]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[60px] px-[20px] pr-[60px] border border-[rgba(0,0,0,0.44)] rounded-[10px] focus:outline-none focus:border-[#4880ff]"
                  placeholder="Enter your password"
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

            {/* Error message */}
            {error && (
              <p className="text-red-500 text-center text-[20px] mb-[20px]">
                {error}
              </p>
            )}

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="w-full h-[60px] bg-[#fcbf65] border-2 border-black rounded-[10px] font-['Inter'] font-extrabold text-[24px] text-black hover:bg-[#e5ab52] transition-colors mb-[30px]"
            >
              Login
            </button>

            {/* Divider */}
            <div className="flex items-center gap-[20px] mb-[30px]">
              <div className="flex-1 h-[1px] bg-black" />
              <span className="font-['Inter'] text-[22px] text-black">or login with</span>
              <div className="flex-1 h-[1px] bg-black" />
            </div>

            {/* Social Login */}
            <div className="flex gap-[20px] mb-[30px]">
              <button className="flex-1 h-[60px] bg-white border border-[rgba(0,0,0,0.44)] rounded-[6px] flex items-center justify-center gap-[12px] hover:bg-gray-50 transition-colors">
                <img src={imgGoogle} alt="Google" className="w-[43px] h-[43px]" />
                <span className="font-['Inter'] font-semibold text-[24px] text-black">Google</span>
              </button>

              <button className="flex-1 h-[60px] bg-white border border-[rgba(0,0,0,0.44)] rounded-[6px] flex items-center justify-center gap-[12px] hover:bg-gray-50 transition-colors">
                <img src={imgFacebook} alt="Facebook" className="w-[43px] h-[43px]" />
                <span className="font-['Inter'] font-semibold text-[24px] text-black">Facebook</span>
              </button>
            </div>

            {/* Register Link */}
            <p className="font-['Inter'] text-[22px] text-black text-center">
              Don't have an account?{' '}
              <button
                onClick={() => setCurrentPage('register')}
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
