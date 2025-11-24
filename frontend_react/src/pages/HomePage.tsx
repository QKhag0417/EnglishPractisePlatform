import { NavBarLearner } from '../components/NavBar';
import { NavBarGuest } from '../components/NavBar';
import { NavBarAdmin } from '../components/NavBarAdmin';
import { Footer } from '../components/Footer';
import { Page } from '../App';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import imgImage34 from "figma:asset/5c2f46fbe8110f6b9ff43987b477d1270d3ffeef.png";
import imgImage35 from "figma:asset/1eff21458494ef41c65462b2789f5a6082f161c8.png";
import imgImage29 from "figma:asset/577d4868435baa881d5b64f45db557c1042d04e9.png";
import imgImage30 from "figma:asset/bcdd3bfc80e3d2ce8f4a19178b607cb85cb9a8ee.png";
import imgImage32 from "figma:asset/e9c4ff12ea38c2a89800b6f3c2055fa2156f37fc.png";
import imgImage33 from "figma:asset/79f59bf5912d98c84c9d2e2055387a0bd9773a30.png";
import imgImage27 from "figma:asset/55c06027cd33e90b1b09aa4decc6e708327bb372.png";
import { UserRole } from '../contexts/AuthContext';
import { useAuth } from "../contexts/AuthContext";

interface HomePageProps {
  setCurrentPage: (page: Page) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  userRole?: UserRole;
}

export function HomePage({ setCurrentPage,  userRole }: HomePageProps) {
  const { isLoggedIn, logout } = useAuth();

  const skills = [
    { name: 'Listening', image: imgImage32, page: 'listening' as Page, highlighted: false },
    { name: 'Reading', image: imgImage29, page: 'reading' as Page, highlighted: false },
    { name: 'Writing', image: imgImage33, page: 'writing' as Page, highlighted: false },
    { name: 'Speaking', image: imgImage30, page: 'speaking' as Page, highlighted: false }
  ];

  return (
    <div className="bg-white min-h-screen">
      {!isLoggedIn ? (
        <NavBarGuest setCurrentPage={setCurrentPage} />
      ) : userRole === 'Administrator' ? (
        <NavBarAdmin setCurrentPage={setCurrentPage} onLogout={logout} currentPage="user-management" />
      ) : (
        <NavBarLearner setCurrentPage={setCurrentPage} onLogout={logout} />
      )}

      {/* Hero Section */}
      <section className="relative h-[445px] mt-[66px] overflow-hidden bg-gradient-to-br from-[#1e3a5f] via-[#2d5a7b] to-[#3d7a9b]">
        <div className="max-w-[1440px] mx-auto px-[60px] h-full flex items-center">
          <div className="text-white max-w-[600px]">
            <h1 className="font-['DM_Sans'] font-bold text-[48px] leading-[56px] mb-[20px]">
              WE TAKE YOUR<br />
              <span className="text-[#fcbf65]">IELTS SCORE HIGHER</span>
            </h1>
            <p className="font-['DM_Sans'] text-[18px] leading-[28px] mb-[8px] text-gray-200">
              Get ready for your 2025 IELTS exam by practicing our 100+ IELTS mock tests for <span className="font-semibold">FREE</span>.
            </p>
            <p className="font-['DM_Sans'] text-[14px] text-gray-300 mb-[30px]">
              <span className="text-[#fcbf65]">●</span> 100,000+ students are using our free services.
            </p>
            <button 
              onClick={() => setCurrentPage('mocktest')}
              className="bg-[#fcbf65] text-white px-[40px] py-[14px] rounded-[30px] font-['DM_Sans'] font-semibold hover:bg-[#e5ab52] transition-colors"
            >
              START NOW
            </button>
          </div>
        </div>
        
        {/* Carousel Controls */}
        <button className="absolute left-[15px] top-1/2 -translate-y-1/2 w-[40px] h-[40px] bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors">
          <ChevronLeft className="w-[24px] h-[24px] text-white" />
        </button>
        <button className="absolute right-[15px] top-1/2 -translate-y-1/2 w-[40px] h-[40px] bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors">
          <ChevronRight className="w-[24px] h-[24px] text-white" />
        </button>
      </section>

      {/* Choose Skill Section */}
      <section className="py-[60px] bg-white">
        <div className="max-w-[1440px] mx-auto px-[60px]">
          <h2 className="font-['DM_Sans'] font-semibold text-[#4880ff] text-[32px] text-center mb-[40px]">
            Choose a Skill to Practice Now
          </h2>
          
          <div className="grid grid-cols-4 gap-[40px]">
            {skills.map((skill) => (
              <div 
                key={skill.name}
                onClick={() => setCurrentPage(skill.page)}
                className={`relative bg-white rounded-[12px] overflow-hidden cursor-pointer transition-all hover:scale-105 ${
                  skill.highlighted ? 'border-4 border-[#fcbf65]' : 'border-4 border-black'
                }`}
              >
                <div className="aspect-square">
                  <img 
                    src={skill.image} 
                    alt={skill.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-[20px]">
                  <p className={`font-['DM_Sans'] text-[20px] text-center ${
                    skill.highlighted ? 'text-[#fcbf65] font-extrabold' : 'text-white font-medium'
                  }`}>
                    {skill.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-[60px] bg-gray-50">
        <div className="max-w-[1440px] mx-auto px-[60px]">
          <h2 className="font-['DM_Sans'] font-semibold text-[#4880ff] text-[32px] text-center mb-[50px]">
            Why Choose Us?
          </h2>

          <div className="space-y-[30px]">
            {/* Feature 1 */}
            <div className="bg-[#fcbf65] border-2 border-black rounded-[10px] p-[30px] flex items-center gap-[30px]">
              <div className="shrink-0">
                <img 
                  src={imgImage34} 
                  alt="Real IELTS Format" 
                  className="w-[133px] h-[133px] object-cover rounded-[8px]"
                />
              </div>
              <div>
                <p className="font-['DM_Sans'] font-medium text-[20px] leading-[32px] text-black">
                  <span className="font-semibold">IELTS Mastermind simulates the real IELTS test format and timing,</span> allowing learners to practice in an authentic exam environment from home. It is accessible on both laptops and mobile devices, offering flexible learning. All tests are based on actual IELTS exams and follow the Cambridge IELTS book format.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#fcbf65] border-2 border-black rounded-[10px] p-[30px] flex items-center gap-[30px]">
              <div className="shrink-0">
                <img 
                  src={imgImage35} 
                  alt="AI-Powered Scoring" 
                  className="w-[133px] h-[133px] object-cover rounded-[8px]"
                />
              </div>
              <div>
                <p className="font-['DM_Sans'] font-medium text-[20px] leading-[32px] text-black">
                  <span className="font-semibold">Experience instant results with AI-powered scoring for Speaking and Writing.</span> Paired with realistic mock tests featuring real IELTS audio, the platform gives you immediate Listening and Reading band scores and AI feedback analyses - everything you need to track progress and improve effectively.
                </p>
              </div>
            </div>

            {/* Feature 3 - CTA */}
            <div className="bg-[#fcbf65] border-2 border-black rounded-[10px] p-[40px] text-center">
              <h3 className="font-['DM_Sans'] font-semibold text-[28px] text-black mb-[20px]">
                Ready to Start Your IELTS Journey?
              </h3>
              <button 
                onClick={() => setCurrentPage('mocktest')}
                className="bg-[#1977f3] text-white px-[50px] py-[16px] rounded-[30px] font-['DM_Sans'] font-semibold hover:bg-[#1565d8] transition-colors"
              >
                Take a Free Mock Test
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}