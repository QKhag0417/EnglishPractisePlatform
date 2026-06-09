import { useNavigate } from 'react-router';
import { NavBarLearner, NavBarGuest } from '../components/NavBar';
import { Footer } from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function ReadingOverviewPage() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const skills = [
    'Reading for gist',
    'Reading for main ideas',
    'Reading for detail',
    'Skimming',
    'Understanding logical argument',
    'Recognising writer\'s opinions, attitudes and purpose'
  ];

  const questionTypes = [
    { name: 'Multiple choice', category: 'Selection' },
    { name: 'Identifying information', detail: 'True/False/Not Given', category: 'Verification' },
    { name: 'Identifying writer\'s views', detail: 'Yes/No/Not Given', category: 'Verification' },
    { name: 'Matching information', category: 'Matching' },
    { name: 'Matching headings', category: 'Matching' },
    { name: 'Matching features', category: 'Matching' },
    { name: 'Matching sentence endings', category: 'Matching' },
    { name: 'Sentence completion', category: 'Completion' },
    { name: 'Summary completion', category: 'Completion' },
    { name: 'Note completion', category: 'Completion' },
    { name: 'Table completion', category: 'Completion' },
    { name: 'Flow-chart completion', category: 'Completion' },
    { name: 'Diagram label completion', category: 'Completion' },
    { name: 'Short-answer questions', category: 'Open-ended' }
  ];

  return (
    <div className="bg-gradient-to-br from-[#f0fdf4] via-white to-[#fef3f2] min-h-screen">
      {isLoggedIn ? (
        <NavBarLearner onLogout={handleLogout} />
      ) : (
        <NavBarGuest />
      )}

      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1769650796510-069f76e2a8ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxwZXJzb24lMjByZWFkaW5nJTIwYm9vayUyMHN0dWR5aW5nJTIwbGlicmFyeXxlbnwxfHx8fDE3NzY3NTc5MDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Person reading in library"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e]/90 via-[#1e1e1e]/60 to-transparent"></div>
        <div className="relative h-full max-w-[1400px] mx-auto px-[120px] flex items-end pb-16">
          <div className="max-w-[800px]">
            <div className="text-[#fcbf65] uppercase tracking-[0.2em] mb-4" style={{ fontFamily: 'Georgia, serif' }}>IELTS Reading</div>
            <h1 className="text-white text-[56px] leading-[1.15] mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Decode Academic Texts with Precision
            </h1>
            <p className="text-white/90 text-[18px] leading-[1.7]">
              Three passages. Sixty minutes. A comprehensive test of your ability to understand, interpret, and analyze written English at an academic level.
            </p>
          </div>
        </div>
      </div>

      {/* Key Info */}
      <div className="max-w-[1400px] mx-auto px-[120px] py-[80px]">
        <div className="grid grid-cols-2 gap-16 items-center mb-[100px]">
          <div>
            <h2 className="text-[42px] text-[#1e1e1e] mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              What to Expect
            </h2>
            <p className="text-[#1e1e1e] text-[18px] leading-[1.8] mb-6">
              The Reading test consists of <strong>40 questions</strong>, designed to test a wide range of reading skills. The IELTS Academic Reading test contains three long texts which range from the descriptive and factual to the discursive and analytical.
            </p>
            <p className="text-[#666] text-[16px] leading-[1.7]">
              These are taken from books, journals, magazines and newspapers. They have been selected for a non-specialist audience but are appropriate for people entering university courses or seeking professional registration.
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#1977f3] to-[#1558c7] rounded-2xl p-12 text-white">
            <div className="text-[#fcbf65] mb-3">Skills Tested</div>
            <ul className="space-y-3">
              {skills.map((skill, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#fcbf65] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-[16px]">{skill}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mb-[100px]">
          <div className="text-center p-10 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl border-2 border-emerald-200">
            <div className="text-[64px] text-[#1977f3] mb-2" style={{ fontFamily: 'Georgia, serif' }}>3</div>
            <div className="text-[20px] text-[#1e1e1e] mb-2">Passages</div>
            <div className="text-[#666]">Long academic texts</div>
          </div>
          <div className="text-center p-10 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl border-2 border-amber-200">
            <div className="text-[64px] text-[#1977f3] mb-2" style={{ fontFamily: 'Georgia, serif' }}>60</div>
            <div className="text-[20px] text-[#1e1e1e] mb-2">Minutes</div>
            <div className="text-[#666]">No extra transfer time</div>
          </div>
          <div className="text-center p-10 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl border-2 border-emerald-200">
            <div className="text-[64px] text-[#1977f3] mb-2" style={{ fontFamily: 'Georgia, serif' }}>40</div>
            <div className="text-[20px] text-[#1e1e1e] mb-2">Questions</div>
            <div className="text-[#666]">Each worth one mark</div>
          </div>
        </div>

        {/* Question Types */}
        <div>
          <h2 className="text-[42px] text-[#1e1e1e] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Question Types
          </h2>
          <p className="text-[#666] text-[18px] mb-10 max-w-[800px]">
            Fourteen different question formats assess your comprehension from multiple angles.
          </p>

          <div className="grid grid-cols-2 gap-6">
            {questionTypes.map((type, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white via-emerald-50/20 to-white border-2 border-emerald-100 rounded-lg p-6 hover:border-[#1977f3] hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-[18px] text-[#1e1e1e] mb-1">
                      {type.name}
                    </div>
                    {type.detail && (
                      <div className="text-[14px] text-[#1977f3]">{type.detail}</div>
                    )}
                  </div>
                  <div className="text-[12px] text-white bg-[#fcbf65] px-3 py-1 rounded-full uppercase tracking-wider">
                    {type.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Marking */}
      <div className="bg-gradient-to-br from-[#1e3a5f] via-[#1e1e1e] to-[#2d1810] py-[80px]">
        <div className="max-w-[1400px] mx-auto px-[120px]">
          <h2 className="text-[42px] text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            How It's Scored
          </h2>
          <p className="text-white/80 text-[18px] leading-[1.8] mb-10">
            The IELTS Reading scoring scale is clearly published to help candidates easily set their study goals. The table shows the conversion from the number of correct answers to band scores:
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { correct: '39–40', band: '9.0' },
              { correct: '37–38', band: '8.5' },
              { correct: '35–36', band: '8.0' },
              { correct: '33–34', band: '7.5' },
              { correct: '30–32', band: '7.0' },
              { correct: '27–29', band: '6.5' },
              { correct: '23–26', band: '6.0' },
              { correct: '19–22', band: '5.5' },
              { correct: '15–18', band: '5.0' },
              { correct: '13–14', band: '4.5' },
              { correct: '10–12', band: '4.0' }
            ].map((score, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20 hover:bg-white/15 transition-colors">
                <div className="text-[#fcbf65] text-[28px] mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                  {score.band}
                </div>
                <div className="text-white/70 text-[14px]">{score.correct} correct</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}