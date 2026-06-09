import { useNavigate } from 'react-router';
import { NavBarLearner, NavBarGuest } from '../components/NavBar';
import { Footer } from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function SpeakingOverviewPage() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const parts = [
    {
      part: 'Part 1',
      title: 'Introduction & Interview',
      duration: '4-5 minutes',
      description: 'General questions about yourself and familiar topics',
      topics: ['Home & Family', 'Work & Studies', 'Interests & Hobbies', 'Daily Routines'],
      color: 'from-[#1977f3] to-[#1558c7]'
    },
    {
      part: 'Part 2',
      title: 'Long Turn',
      duration: '3-4 minutes',
      description: 'Speak about a particular topic for up to 2 minutes',
      topics: ['1 minute preparation', '2 minutes speaking', 'Follow-up questions'],
      color: 'from-[#fcbf65] to-[#f4a940]'
    },
    {
      part: 'Part 3',
      title: 'Discussion',
      duration: '4-5 minutes',
      description: 'Discuss more abstract ideas and issues',
      topics: ['Critical thinking', 'Abstract concepts', 'Opinion justification', 'Future implications'],
      color: 'from-[#1977f3] to-[#1558c7]'
    }
  ];

  const criteria = [
    {
      name: 'Fluency and Coherence',
      description: 'How smoothly you speak and connect your ideas',
      icon: '💬',
      percentage: '25%'
    },
    {
      name: 'Lexical Resource',
      description: 'Your range and accuracy of vocabulary',
      icon: '📚',
      percentage: '25%'
    },
    {
      name: 'Grammatical Range and Accuracy',
      description: 'Your variety and correctness of grammar',
      icon: '✓',
      percentage: '25%'
    },
    {
      name: 'Pronunciation',
      description: 'How clearly and naturally you speak',
      icon: '🎯',
      percentage: '25%'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-[#fef3f2] via-white to-[#f0f7ff] min-h-screen">
      {isLoggedIn ? (
        <NavBarLearner onLogout={handleLogout} />
      ) : (
        <NavBarGuest />
      )}

      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1758873269276-9518d0cb4a0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxwZW9wbGUlMjBjb252ZXJzYXRpb24lMjBzcGVha2luZyUyMGRpc2N1c3Npb258ZW58MXx8fHwxNzc2NzU3OTAxfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="People in discussion"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e1e1e]/95 via-[#1e1e1e]/75 to-transparent"></div>
        <div className="relative h-full max-w-[1400px] mx-auto px-[120px] flex items-center">
          <div className="max-w-[750px]">
            <div className="text-[#fcbf65] uppercase tracking-[0.2em] mb-4" style={{ fontFamily: 'Georgia, serif' }}>IELTS Speaking</div>
            <h1 className="text-white text-[56px] leading-[1.15] mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Communicate with Confidence and Fluency
            </h1>
            <p className="text-white/90 text-[18px] leading-[1.7]">
              A face-to-face conversation with a certified examiner. Three parts. Eleven to fourteen minutes to showcase your spoken English skills.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Facts */}
      <div className="py-[60px]">
        <div className="max-w-[1400px] mx-auto px-[120px]">
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-6 rounded-lg border-2 border-purple-200 text-center">
              <div className="text-[42px] text-[#1977f3] mb-2" style={{ fontFamily: 'Georgia, serif' }}>3</div>
              <div className="text-[#1e1e1e]">Parts</div>
            </div>
            <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 p-6 rounded-lg border-2 border-rose-200 text-center">
              <div className="text-[42px] text-[#1977f3] mb-2" style={{ fontFamily: 'Georgia, serif' }}>11-14</div>
              <div className="text-[#1e1e1e]">Minutes</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-6 rounded-lg border-2 border-purple-200 text-center">
              <div className="text-[42px] text-[#fcbf65] mb-2" style={{ fontFamily: 'Georgia, serif' }}>1:1</div>
              <div className="text-[#1e1e1e]">Face-to-face</div>
            </div>
            <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 p-6 rounded-lg border-2 border-rose-200 text-center">
              <div className="text-[42px] text-[#fcbf65] mb-2" style={{ fontFamily: 'Georgia, serif' }}>📹</div>
              <div className="text-[#1e1e1e]">Recorded</div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Structure */}
      <div className="max-w-[1400px] mx-auto px-[120px] py-[100px]">
        <h2 className="text-[42px] text-[#1e1e1e] mb-4" style={{ fontFamily: 'Georgia, serif' }}>Test Structure</h2>
        <p className="text-[#666] text-[18px] mb-12 max-w-[800px]">
          The Speaking test is the same for both Academic and General Training. Your performance is assessed by certificated IELTS examiners.
        </p>

        <div className="space-y-6">
          {parts.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="grid grid-cols-3">
                <div className={`bg-gradient-to-br ${item.color} p-10 text-white`}>
                  <div className="text-white/80 text-[14px] uppercase tracking-wider mb-2">{item.part}</div>
                  <h3 className="text-[32px] mb-4" style={{ fontFamily: 'Georgia, serif' }}>{item.title}</h3>
                  <div className="text-white/90 text-[18px]">{item.duration}</div>
                </div>
                <div className="col-span-2 p-10">
                  <p className="text-[#1e1e1e] text-[18px] mb-6 leading-[1.7]">
                    {item.description}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {item.topics.map((topic, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-[#fcbf65] rounded-full flex-shrink-0"></div>
                        <span className="text-[#666]">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assessment Criteria */}
      <div className="bg-gradient-to-br from-purple-50/30 via-white to-rose-50/30 py-[100px]">
        <div className="max-w-[1400px] mx-auto px-[120px]">
          <h2 className="text-[42px] text-[#1e1e1e] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            How It's Scored
          </h2>
          <p className="text-[#666] text-[18px] mb-12 max-w-[800px]">
            Four equally-weighted criteria assess different aspects of your speaking ability. Each contributes 25% to your overall Speaking band score.
          </p>

          <div className="grid grid-cols-2 gap-8">
            {criteria.map((criterion, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-purple-50/50 via-white to-rose-50/50 rounded-xl p-10 border-2 border-purple-100 hover:border-[#1977f3] hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-6">
                  <div className="text-[56px]">{criterion.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[#1e1e1e] text-[24px]" style={{ fontFamily: 'Georgia, serif' }}>
                        {criterion.name}
                      </h3>
                      <div className="text-[#1977f3] text-[20px]" style={{ fontFamily: 'Georgia, serif' }}>
                        {criterion.percentage}
                      </div>
                    </div>
                    <p className="text-[#666] leading-[1.7]">
                      {criterion.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-xl p-8 border-2 border-[#fcbf65]/30">
            <p className="text-[#1e1e1e] text-[16px] leading-[1.8]">
              Scores are reported in whole and half bands, providing a precise assessment of your spoken English proficiency. The test is recorded for quality assurance and monitoring purposes.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}