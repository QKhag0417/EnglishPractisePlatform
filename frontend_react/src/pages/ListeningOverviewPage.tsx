import { useNavigate } from 'react-router';
import { NavBarLearner, NavBarGuest } from '../components/NavBar';
import { Footer } from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function ListeningOverviewPage() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const skills = [
    'Understanding main ideas',
    'Identifying specific information',
    'Understanding speaker opinions and attitudes',
    'Following the development of an argument',
    'Recognizing function and purpose'
  ];

  const testSections = [
    {
      section: 1,
      title: 'Section 1',
      context: 'Social context',
      format: 'Conversation between two people',
      example: 'A conversation about travel arrangements'
    },
    {
      section: 2,
      title: 'Section 2',
      context: 'Social context',
      format: 'Monologue',
      example: 'A speech about local facilities'
    },
    {
      section: 3,
      title: 'Section 3',
      context: 'Educational/training',
      format: 'Conversation (up to 4 people)',
      example: 'University tutor and student discussing an assignment'
    },
    {
      section: 4,
      title: 'Section 4',
      context: 'Academic',
      format: 'Monologue',
      example: 'A university lecture'
    }
  ];

  const questionTypes = [
    { name: 'Multiple choice', category: 'Selection' },
    { name: 'Matching', category: 'Matching' },
    { name: 'Plan/map/diagram labelling', category: 'Completion' },
    { name: 'Form completion', category: 'Completion' },
    { name: 'Note completion', category: 'Completion' },
    { name: 'Table completion', category: 'Completion' },
    { name: 'Flow-chart completion', category: 'Completion' },
    { name: 'Summary completion', category: 'Completion' },
    { name: 'Sentence completion', category: 'Completion' },
    { name: 'Short-answer questions', category: 'Open-ended' }
  ];

  return (
    <div className="bg-gradient-to-br from-[#f0f9ff] via-white to-[#fef7e6] min-h-screen">
      {isLoggedIn ? (
        <NavBarLearner onLogout={handleLogout} />
      ) : (
        <NavBarGuest />
      )}

      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1590650153855-d9e808231d41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxwZXJzb24lMjB3ZWFyaW5nJTIwaGVhZHBob25lcyUyMHN0dWR5aW5nfGVufDF8fHx8MTc3Njc1NzkwMHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Person wearing headphones studying"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e]/90 via-[#1e1e1e]/60 to-transparent"></div>
        <div className="relative h-full max-w-[1400px] mx-auto px-[120px] flex items-end pb-16">
          <div className="max-w-[800px]">
            <div className="text-[#fcbf65] uppercase tracking-[0.2em] mb-4" style={{ fontFamily: 'Georgia, serif' }}>IELTS Listening</div>
            <h1 className="text-white text-[56px] leading-[1.15] mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Master Spoken English in Real-World Contexts
            </h1>
            <p className="text-white/90 text-[18px] leading-[1.7]">
              Four recordings. Forty questions. A comprehensive assessment of your ability to understand spoken English in academic and everyday situations.
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
              The Listening test consists of <strong>four recordings</strong> made by native English speakers. You will listen to recordings of a range of conversations and monologues and answer <strong>40 questions</strong>.
            </p>
            <p className="text-[#666] text-[16px] leading-[1.7]">
              Recordings are heard only once. You will have time before you listen to read the questions, and time after to check your answers. All answers must be transferred to the answer sheet within 10 minutes after the test.
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
        <div className="grid grid-cols-4 gap-6 mb-[100px]">
          <div className="text-center p-10 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border-2 border-blue-200">
            <div className="text-[64px] text-[#1977f3] mb-2" style={{ fontFamily: 'Georgia, serif' }}>4</div>
            <div className="text-[20px] text-[#1e1e1e] mb-2">Sections</div>
            <div className="text-[#666]">Progressive difficulty</div>
          </div>
          <div className="text-center p-10 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl border-2 border-amber-200">
            <div className="text-[64px] text-[#1977f3] mb-2" style={{ fontFamily: 'Georgia, serif' }}>30</div>
            <div className="text-[20px] text-[#1e1e1e] mb-2">Minutes</div>
            <div className="text-[#666]">Plus 10 for transfer</div>
          </div>
          <div className="text-center p-10 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border-2 border-blue-200">
            <div className="text-[64px] text-[#1977f3] mb-2" style={{ fontFamily: 'Georgia, serif' }}>40</div>
            <div className="text-[20px] text-[#1e1e1e] mb-2">Questions</div>
            <div className="text-[#666]">Each worth one mark</div>
          </div>
          <div className="text-center p-10 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl border-2 border-amber-200">
            <div className="text-[64px] text-[#1977f3] mb-2" style={{ fontFamily: 'Georgia, serif' }}>1×</div>
            <div className="text-[20px] text-[#1e1e1e] mb-2">Played</div>
            <div className="text-[#666]">Heard once only</div>
          </div>
        </div>

        {/* Test Sections */}
        <div className="mb-[100px]">
          <h2 className="text-[42px] text-[#1e1e1e] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Test Structure
          </h2>
          <p className="text-[#666] text-[18px] mb-10 max-w-[800px]">
            Four sections progress from everyday social situations to academic contexts.
          </p>

          <div className="grid grid-cols-2 gap-6">
            {testSections.map((section) => (
              <div
                key={section.section}
                className="bg-gradient-to-br from-blue-50/50 via-white to-amber-50/50 rounded-xl p-8 border-2 border-blue-100 hover:border-[#1977f3] hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-[48px] text-[#fcbf65]/30 leading-none" style={{ fontFamily: 'Georgia, serif' }}>
                    {section.section}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[24px] text-[#1e1e1e] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                      {section.title}
                    </h3>
                    <div className="text-[14px] text-[#1977f3] mb-3">{section.context}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="text-[#666] text-[14px] font-semibold min-w-[70px]">Format:</div>
                    <div className="text-[#1e1e1e] text-[14px]">{section.format}</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="text-[#666] text-[14px] font-semibold min-w-[70px]">Example:</div>
                    <div className="text-[#1e1e1e] text-[14px]">{section.example}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Question Types */}
        <div>
          <h2 className="text-[42px] text-[#1e1e1e] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Question Types
          </h2>
          <p className="text-[#666] text-[18px] mb-10 max-w-[800px]">
            Ten different question formats assess your listening comprehension from multiple angles.
          </p>

          <div className="grid grid-cols-2 gap-6">
            {questionTypes.map((type, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white via-blue-50/20 to-white border-2 border-blue-100 rounded-lg p-6 hover:border-[#1977f3] hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-[18px] text-[#1e1e1e]">
                      {type.name}
                    </div>
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
            The IELTS Listening scoring scale is clearly published to help candidates easily set their study goals. The table shows the conversion from the number of correct answers to band scores:
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { correct: '39–40', band: '9.0' },
              { correct: '37–38', band: '8.5' },
              { correct: '35–36', band: '8.0' },
              { correct: '32–34', band: '7.5' },
              { correct: '30–31', band: '7.0' },
              { correct: '26–29', band: '6.5' },
              { correct: '23–25', band: '6.0' },
              { correct: '18–22', band: '5.5' },
              { correct: '16–17', band: '5.0' },
              { correct: '13–15', band: '4.5' },
              { correct: '11–12', band: '4.0' }
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
