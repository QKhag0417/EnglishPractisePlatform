import { useState } from 'react';
import { NavBarLearner, NavBarGuest } from '../components/NavBar';
import { Footer } from '../components/Footer';
import { Page } from '../App';
import { Clock, FileText, Users, Target, Headphones, Wifi, AlertCircle } from 'lucide-react';

interface EvaluationTestPageProps {
  setCurrentPage: (page: Page) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

// Mock data for previous test result (set to null if no previous test)
const previousResult = {
  overallBand: 6.5,
  listening: 7.0,
  reading: 6.5,
  writing: 6.0,
  speaking: 6.5,
  dateTaken: '12 May 2026'
};

export function EvaluationTestPage({ setCurrentPage, isLoggedIn, onLogout }: EvaluationTestPageProps) {
  const [hasPreviousResult] = useState(false); // Set to true to show previous results

  const handleStartTest = () => {
    if (!isLoggedIn) {
      setCurrentPage('auth-prompt');
    } else {
      // Handle start evaluation test
      console.log('Starting evaluation test...');
    }
  };

  const handleViewProfile = () => {
    // Navigate to skill profile page
    console.log('Viewing skill profile...');
  };

  return (
    <div className="bg-white min-h-screen">
      {isLoggedIn ? <NavBarLearner setCurrentPage={setCurrentPage} onLogout={onLogout} /> : <NavBarGuest setCurrentPage={setCurrentPage} />}

      <div className="pt-[90px] px-[30px] pb-[60px] max-w-[1200px] mx-auto">
        {/* Hero & Summary Card */}
        <div className="bg-white border-4 border-[#4880ff] rounded-[12px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-[40px] mb-[40px]">
          <h1 className="font-['Inter'] font-extrabold text-[36px] text-[#4880ff] mb-[12px]">
            Evaluation Test – Discover Your Current IELTS Level
          </h1>
          <p className="font-['Inter'] text-[18px] text-[rgba(0,0,0,0.7)] mb-[30px]">
            A diagnostic test that analyzes your Listening, Reading, Writing, and Speaking skills and builds a personalized study plan.
          </p>

          {/* Test Summary */}
          <div className="bg-[rgba(119,203,242,0.12)] border border-[rgba(0,0,0,0.11)] rounded-[10px] p-[24px] mb-[30px]">
            <h3 className="font-['Inter'] font-bold text-[20px] mb-[20px]">Test Summary</h3>
            <div className="grid grid-cols-2 gap-[20px]">
              <div className="flex items-start gap-[12px]">
                <Clock className="w-[24px] h-[24px] text-[#4880ff] flex-shrink-0 mt-[2px]" />
                <div>
                  <p className="font-['Inter'] font-semibold text-[16px]">Duration</p>
                  <p className="font-['Inter'] text-[14px] text-[rgba(0,0,0,0.6)]">~90 minutes</p>
                </div>
              </div>
              <div className="flex items-start gap-[12px]">
                <FileText className="w-[24px] h-[24px] text-[#4880ff] flex-shrink-0 mt-[2px]" />
                <div>
                  <p className="font-['Inter'] font-semibold text-[16px]">Format</p>
                  <p className="font-['Inter'] text-[14px] text-[rgba(0,0,0,0.6)]">Mixed Listening, Reading, Writing & Speaking tasks</p>
                </div>
              </div>
              <div className="flex items-start gap-[12px]">
                <Users className="w-[24px] h-[24px] text-[#4880ff] flex-shrink-0 mt-[2px]" />
                <div>
                  <p className="font-['Inter'] font-semibold text-[16px]">Question Source</p>
                  <p className="font-['Inter'] text-[14px] text-[rgba(0,0,0,0.6)]">Randomized from our official-style question bank</p>
                </div>
              </div>
              <div className="flex items-start gap-[12px]">
                <Target className="w-[24px] h-[24px] text-[#4880ff] flex-shrink-0 mt-[2px]" />
                <div>
                  <p className="font-['Inter'] font-semibold text-[16px]">Result</p>
                  <p className="font-['Inter'] text-[14px] text-[rgba(0,0,0,0.6)]">Instant band estimate + detailed skill profile</p>
                </div>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartTest}
            className="w-full h-[60px] bg-[#fcbf65] border-2 border-black rounded-[10px] font-['Inter'] font-extrabold text-[24px] text-black hover:bg-[#e5ab52] transition-colors"
          >
            Start Evaluation Test
          </button>
        </div>

        {/* Previous Result (if exists) */}
        {hasPreviousResult && (
          <div className="bg-[rgba(252,191,101,0.15)] border-2 border-[#fcbf65] rounded-[12px] p-[30px] mb-[40px]">
            <h3 className="font-['Inter'] font-bold text-[22px] mb-[20px]">Last Evaluation Result</h3>
            <div className="flex items-center gap-[40px] mb-[20px]">
              <div>
                <p className="font-['Inter'] text-[14px] text-[rgba(0,0,0,0.6)] mb-[8px]">Overall Band</p>
                <p className="font-['Inter'] font-extrabold text-[48px] text-[#4880ff]">{previousResult.overallBand}</p>
              </div>
              <div className="flex-1 grid grid-cols-4 gap-[20px]">
                <div>
                  <p className="font-['Inter'] font-semibold text-[14px] mb-[6px]">Listening</p>
                  <p className="font-['Inter'] font-bold text-[28px] text-[#4880ff]">{previousResult.listening}</p>
                </div>
                <div>
                  <p className="font-['Inter'] font-semibold text-[14px] mb-[6px]">Reading</p>
                  <p className="font-['Inter'] font-bold text-[28px] text-[#4880ff]">{previousResult.reading}</p>
                </div>
                <div>
                  <p className="font-['Inter'] font-semibold text-[14px] mb-[6px]">Writing</p>
                  <p className="font-['Inter'] font-bold text-[28px] text-[#4880ff]">{previousResult.writing}</p>
                </div>
                <div>
                  <p className="font-['Inter'] font-semibold text-[14px] mb-[6px]">Speaking</p>
                  <p className="font-['Inter'] font-bold text-[28px] text-[#4880ff]">{previousResult.speaking}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-['Inter'] text-[14px] text-[rgba(0,0,0,0.6)]">
                Date taken: {previousResult.dateTaken}
              </p>
              <button
                onClick={handleViewProfile}
                className="px-[24px] py-[10px] bg-[#4880ff] rounded-[8px] font-['Inter'] font-semibold text-[16px] text-white hover:bg-[#3a6bdb] transition-colors"
              >
                View Your Skill Profile
              </button>
            </div>
          </div>
        )}

        {/* How It Works Section */}
        <h2 className="font-['Inter'] font-bold text-[28px] mb-[24px]">How It Works</h2>
        <div className="grid grid-cols-3 gap-[24px] mb-[40px]">
          {/* Step 1 */}
          <div className="bg-[rgba(119,203,242,0.12)] border border-[rgba(0,0,0,0.11)] rounded-[10px] p-[24px]">
            <div className="w-[56px] h-[56px] bg-[#4880ff] rounded-full flex items-center justify-center mb-[16px]">
              <span className="font-['Inter'] font-extrabold text-[28px] text-white">1</span>
            </div>
            <h3 className="font-['Inter'] font-bold text-[18px] mb-[12px]">Take the Test</h3>
            <p className="font-['Inter'] text-[14px] text-[rgba(0,0,0,0.7)]">
              60–90 minutes, IELTS-style tasks across all four skills.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[rgba(119,203,242,0.12)] border border-[rgba(0,0,0,0.11)] rounded-[10px] p-[24px]">
            <div className="w-[56px] h-[56px] bg-[#4880ff] rounded-full flex items-center justify-center mb-[16px]">
              <span className="font-['Inter'] font-extrabold text-[28px] text-white">2</span>
            </div>
            <h3 className="font-['Inter'] font-bold text-[18px] mb-[12px]">Get Your Skill Profile</h3>
            <p className="font-['Inter'] text-[14px] text-[rgba(0,0,0,0.7)]">
              We analyze your answers and estimate your band for Listening, Reading, Writing, and Speaking.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[rgba(119,203,242,0.12)] border border-[rgba(0,0,0,0.11)] rounded-[10px] p-[24px]">
            <div className="w-[56px] h-[56px] bg-[#4880ff] rounded-full flex items-center justify-center mb-[16px]">
              <span className="font-['Inter'] font-extrabold text-[28px] text-white">3</span>
            </div>
            <h3 className="font-['Inter'] font-bold text-[18px] mb-[12px]">Follow Your Study Plan</h3>
            <p className="font-['Inter'] text-[14px] text-[rgba(0,0,0,0.7)]">
              We unlock a personalized path with mock tests, exercises, and recommendations.
            </p>
          </div>
        </div>

        {/* Pre-Test Checklist */}
        <div className="bg-[rgba(252,191,101,0.15)] border-2 border-[#fcbf65] rounded-[10px] p-[24px]">
          <div className="flex items-start gap-[12px] mb-[16px]">
            <AlertCircle className="w-[24px] h-[24px] text-[#fcbf65] flex-shrink-0 mt-[2px]" />
            <h3 className="font-['Inter'] font-bold text-[20px]">Before You Start</h3>
          </div>
          <div className="grid grid-cols-2 gap-x-[40px] gap-y-[12px] ml-[36px]">
            <div className="flex items-center gap-[12px]">
              <Headphones className="w-[20px] h-[20px] text-[rgba(0,0,0,0.6)] flex-shrink-0" />
              <p className="font-['Inter'] text-[15px]">Use headphones for Listening sections</p>
            </div>
            <div className="flex items-center gap-[12px]">
              <Target className="w-[20px] h-[20px] text-[rgba(0,0,0,0.6)] flex-shrink-0" />
              <p className="font-['Inter'] text-[15px]">Make sure you're in a quiet place</p>
            </div>
            <div className="flex items-center gap-[12px]">
              <Wifi className="w-[20px] h-[20px] text-[rgba(0,0,0,0.6)] flex-shrink-0" />
              <p className="font-['Inter'] text-[15px]">Stable internet connection</p>
            </div>
            <div className="flex items-center gap-[12px]">
              <Clock className="w-[20px] h-[20px] text-[rgba(0,0,0,0.6)] flex-shrink-0" />
              <p className="font-['Inter'] text-[15px]">Enough time to finish without pausing</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}