import { useNavigate } from "react-router";
import { Footer } from "../../components/Footer";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import imgImage34 from "figma:asset/5c2f46fbe8110f6b9ff43987b477d1270d3ffeef.png";
import imgImage35 from "figma:asset/1eff21458494ef41c65462b2789f5a6082f161c8.png";
import imgImage29 from "figma:asset/577d4868435baa881d5b64f45db557c1042d04e9.png";
import imgImage30 from "figma:asset/bcdd3bfc80e3d2ce8f4a19178b607cb85cb9a8ee.png";
import imgImage32 from "figma:asset/e9c4ff12ea38c2a89800b6f3c2055fa2156f37fc.png";
import imgImage33 from "figma:asset/79f59bf5912d98c84c9d2e2055387a0bd9773a30.png";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { NavBarUnified } from "../../components/NavBarUnified";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

export function HomePage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "WE TAKE YOUR",
      highlight: "IELTS SCORE HIGHER",
      subtitle:
        "Get ready for your 2025 IELTS exam by practicing with our comprehensive skill-based exercises for FREE.",
      stat: "100,000+ students are using our free services.",
      image:
        "https://images.unsplash.com/photo-1760351561007-526f5353cc76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwSUVMVFMlMjBleGFtJTIwcHJlcGFyYXRpb258ZW58MXx8fHwxNzc2NzcxNTI4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      gradient: "from-[#1e3a5f] via-[#2d5a7b] to-[#3d7a9b]",
    },
    {
      title: "MASTER ALL FOUR",
      highlight: "IELTS SKILLS",
      subtitle:
        "Comprehensive training for Listening, Reading, Writing, and Speaking with real exam formats.",
      stat: "Practice with authentic Cambridge IELTS materials.",
      image:
        "https://images.unsplash.com/photo-1548690312-3b978c893df0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwSUVMVFMlMjBleGFtJTIwcHJlcGFyYXRpb258ZW58MXx8fHwxNzc2NzcxNTI4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      gradient: "from-[#1977f3] via-[#1565d8] to-[#1e3a5f]",
    },
    {
      title: "GET INSTANT",
      highlight: "AI-POWERED FEEDBACK",
      subtitle:
        "Receive immediate band scores and detailed analysis for all your practice exercises.",
      stat: "Smart AI evaluates your performance in real-time.",
      image:
        "https://images.unsplash.com/photo-1668092547528-62bdec358652?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwSUVMVFMlMjBleGFtJTIwcHJlcGFyYXRpb258ZW58MXx8fHwxNzc2NzcxNTI4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      gradient: "from-[#2d5a7b] via-[#1977f3] to-[#1e3a5f]",
    },
  ];

  const skills = [
    {
      name: "Listening",
      image: imgImage32,
      path: "/listening",
      highlighted: false,
    },
    {
      name: "Reading",
      image: imgImage29,
      path: "/reading",
      highlighted: false,
    },
    {
      name: "Writing",
      image: imgImage33,
      path: "/writing",
      highlighted: false,
    },
    {
      name: "Speaking",
      image: imgImage30,
      path: "/speaking",
      highlighted: false,
    },
  ];

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="bg-white min-h-screen">
      <NavBarUnified />

      <section className="relative h-[500px] mt-[66px] overflow-hidden">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <ImageWithFallback
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-90`}
              ></div>
            </div>

            {/* Content */}
            <div className="relative max-w-[1440px] mx-auto px-[60px] h-full flex items-center">
              <div className="text-white max-w-[650px] animate-[fadeIn_0.8s_ease-out]">
                <h1 className="font-['DM_Sans'] font-bold text-[52px] leading-[60px] mb-[24px]">
                  {slide.title}
                  <br />
                  <span className="text-[#fcbf65]">{slide.highlight}</span>
                </h1>
                <p className="font-['DM_Sans'] text-[20px] leading-[32px] mb-[12px] text-white/90">
                  {slide.subtitle}
                </p>
                <p className="font-['DM_Sans'] text-[15px] text-white/80 mb-[32px] flex items-center gap-[8px]">
                  <span className="text-[#fcbf65]">●</span> {slide.stat}
                </p>
                <button
                  onClick={() => navigate("/listening")}
                  className="bg-[#fcbf65] text-white px-[48px] py-[16px] rounded-[30px] font-['DM_Sans'] font-semibold text-[16px] hover:bg-[#e5ab52] hover:scale-105 transition-all shadow-lg"
                >
                  START PRACTICING
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-[20px] top-1/2 -translate-y-1/2 w-[48px] h-[48px] bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center backdrop-blur-sm transition-all z-10"
        >
          <ChevronLeft className="w-[28px] h-[28px] text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-[20px] top-1/2 -translate-y-1/2 w-[48px] h-[48px] bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center backdrop-blur-sm transition-all z-10"
        >
          <ChevronRight className="w-[28px] h-[28px] text-white" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-[24px] left-1/2 -translate-x-1/2 flex gap-[12px] z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-[10px] h-[10px] rounded-full transition-all ${
                index === currentSlide
                  ? "bg-[#fcbf65] w-[32px]"
                  : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-[40px] border-b-2 border-gray-100">
        <div className="max-w-[1440px] mx-auto px-[60px]">
          <div className="grid grid-cols-4 gap-[32px]">
            <div className="text-center">
              <div className="w-[56px] h-[56px] bg-[#1977f3]/10 rounded-full flex items-center justify-center mx-auto mb-[12px]">
                <BookOpen className="w-[28px] h-[28px] text-[#1977f3]" />
              </div>
              <h3 className="font-['DM_Sans'] font-bold text-[32px] text-[#1977f3] mb-[4px]">
                100+
              </h3>
              <p className="font-['DM_Sans'] text-[14px] text-gray-600">
                Practice Exercises
              </p>
            </div>
            <div className="text-center">
              <div className="w-[56px] h-[56px] bg-[#fcbf65]/10 rounded-full flex items-center justify-center mx-auto mb-[12px]">
                <Users className="w-[28px] h-[28px] text-[#fcbf65]" />
              </div>
              <h3 className="font-['DM_Sans'] font-bold text-[32px] text-[#fcbf65] mb-[4px]">
                100K+
              </h3>
              <p className="font-['DM_Sans'] text-[14px] text-gray-600">
                Active Students
              </p>
            </div>
            <div className="text-center">
              <div className="w-[56px] h-[56px] bg-[#1977f3]/10 rounded-full flex items-center justify-center mx-auto mb-[12px]">
                <Trophy className="w-[28px] h-[28px] text-[#1977f3]" />
              </div>
              <h3 className="font-['DM_Sans'] font-bold text-[32px] text-[#1977f3] mb-[4px]">
                4
              </h3>
              <p className="font-['DM_Sans'] text-[14px] text-gray-600">
                Skills Covered
              </p>
            </div>
            <div className="text-center">
              <div className="w-[56px] h-[56px] bg-[#fcbf65]/10 rounded-full flex items-center justify-center mx-auto mb-[12px]">
                <Zap className="w-[28px] h-[28px] text-[#fcbf65]" />
              </div>
              <h3 className="font-['DM_Sans'] font-bold text-[32px] text-[#fcbf65] mb-[4px]">
                AI
              </h3>
              <p className="font-['DM_Sans'] text-[14px] text-gray-600">
                Instant Feedback
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Choose Skill Section */}
      <section className="py-[80px] bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-[1440px] mx-auto px-[60px]">
          <div className="text-center mb-[56px]">
            <h2 className="font-['DM_Sans'] font-bold text-[#1e1e1e] text-[40px] mb-[16px]">
              Choose Your Path to Success
            </h2>
            <p className="font-['DM_Sans'] text-[18px] text-gray-600 max-w-[600px] mx-auto">
              Master all four IELTS skills with our comprehensive practice
              exercises and real exam simulations
            </p>
          </div>

          <div className="grid grid-cols-4 gap-[32px]">
            {skills.map((skill) => (
              <div
                key={skill.name}
                onClick={() => navigate(skill.path)}
                className="group relative bg-white rounded-[16px] overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-2xl border-2 border-gray-200 hover:border-[#1977f3]"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={skill.image}
                    alt={skill.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-[24px]">
                  <div className="flex items-center justify-between mb-[8px]">
                    <h3 className="font-['DM_Sans'] text-[24px] text-white font-bold">
                      {skill.name}
                    </h3>
                    <div className="w-[40px] h-[40px] bg-[#fcbf65] rounded-full flex items-center justify-center group-hover:bg-[#1977f3] transition-colors">
                      <ChevronRight className="w-[20px] h-[20px] text-white" />
                    </div>
                  </div>
                  <p className="font-['DM_Sans'] text-[13px] text-white/80">
                    Practice & improve
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-[80px] bg-white">
        <div className="max-w-[1440px] mx-auto px-[60px]">
          <div className="text-center mb-[56px]">
            <h2 className="font-['DM_Sans'] font-bold text-[#1e1e1e] text-[40px] mb-[16px]">
              Why IELTS Mastermind?
            </h2>
            <p className="font-['DM_Sans'] text-[18px] text-gray-600 max-w-[600px] mx-auto">
              Your complete preparation platform for IELTS success
            </p>
          </div>

          <div className="grid grid-cols-2 gap-[32px] mb-[32px]">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-[#1977f3] to-[#1565d8] rounded-[16px] p-[40px] text-white shadow-xl">
              <div className="flex items-start gap-[24px]">
                <div className="shrink-0">
                  <img
                    src={imgImage34}
                    alt="Real IELTS Format"
                    className="w-[120px] h-[120px] object-cover rounded-[12px] shadow-lg"
                  />
                </div>
                <div>
                  <h3 className="font-['DM_Sans'] font-bold text-[24px] mb-[12px]">
                    Real IELTS Format & Timing
                  </h3>
                  <p className="font-['DM_Sans'] text-[16px] leading-[26px] text-white/90">
                    Practice in an authentic exam environment from home.
                    Accessible on laptops and mobile devices. All tests based on
                    actual IELTS exams following the Cambridge IELTS book
                    format.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-[#fcbf65] to-[#f4a940] rounded-[16px] p-[40px] text-white shadow-xl">
              <div className="flex items-start gap-[24px]">
                <div className="shrink-0">
                  <img
                    src={imgImage35}
                    alt="AI-Powered Scoring"
                    className="w-[120px] h-[120px] object-cover rounded-[12px] shadow-lg"
                  />
                </div>
                <div>
                  <h3 className="font-['DM_Sans'] font-bold text-[24px] mb-[12px]">
                    AI-Powered Instant Feedback
                  </h3>
                  <p className="font-['DM_Sans'] text-[16px] leading-[26px] text-white/90">
                    Get immediate band scores and detailed analysis for Speaking
                    and Writing. Practice with real IELTS audio for Listening
                    and Reading exercises.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-[#1e3a5f] to-[#1977f3] rounded-[20px] p-[56px] text-center shadow-2xl">
            <h3 className="font-['DM_Sans'] font-bold text-[36px] text-white mb-[16px]">
              Ready to Start Your IELTS Journey?
            </h3>
            <p className="font-['DM_Sans'] text-[18px] text-white/90 mb-[32px] max-w-[700px] mx-auto">
              Join 100,000+ students who are achieving their target IELTS scores
              with our comprehensive preparation platform
            </p>
            <button
              onClick={() => navigate("/listening")}
              className="bg-[#fcbf65] text-white px-[56px] py-[18px] rounded-[30px] font-['DM_Sans'] font-bold text-[18px] hover:bg-[#e5ab52] hover:scale-105 transition-all shadow-lg"
            >
              Start Practicing Now
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
