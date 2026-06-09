import { useNavigate } from 'react-router';
import { NavBarLearner, NavBarGuest } from '../components/NavBar';
import { Footer } from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function WritingOverviewPage() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const task1Types = [
    'Line graph',
    'Bar chart',
    'Pie chart',
    'Table',
    'Process diagram',
    'Map',
    'Mixed visuals'
  ];

  const task2Types = [
    { name: 'Agree–Disagree', description: 'State your position on a statement' },
    { name: 'Opinion', description: 'Give your opinion on an issue' },
    { name: 'Discussion', description: 'Discuss both sides of an argument' },
    { name: 'Problem–Solution', description: 'Analyze problems and propose solutions' },
    { name: 'Advantages–Disadvantages', description: 'Evaluate pros and cons' },
    { name: 'Two-part question', description: 'Answer two related questions' }
  ];

  const criteria = [
    {
      name: 'Task Achievement/Response',
      description: 'How accurately and relevantly you address the task requirements'
    },
    {
      name: 'Coherence and Cohesion',
      description: 'How well your ideas are organized and linked together'
    },
    {
      name: 'Lexical Resource',
      description: 'Your range and accuracy of vocabulary usage'
    },
    {
      name: 'Grammatical Range and Accuracy',
      description: 'Your variety and correctness of grammatical structures'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-[#fff9f0] via-white to-[#f0f7ff] min-h-screen">
      {isLoggedIn ? (
        <NavBarLearner onLogout={handleLogout} />
      ) : (
        <NavBarGuest />
      )}

      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1758876017749-d1bd378e2577?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxwZXJzb24lMjB3cml0aW5nJTIwbm90ZWJvb2slMjBwZW4lMjBkZXNrfGVufDF8fHx8MTc3Njc1NzkwMHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Person writing at desk"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e]/90 via-[#1e1e1e]/60 to-transparent"></div>
        <div className="relative h-full max-w-[1400px] mx-auto px-[120px] flex items-end pb-16">
          <div className="max-w-[800px]">
            <div className="text-[#fcbf65] uppercase tracking-[0.2em] mb-4" style={{ fontFamily: 'Georgia, serif' }}>IELTS Writing</div>
            <h1 className="text-white text-[56px] leading-[1.15] mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Express Your Ideas with Clarity and Impact
            </h1>
            <p className="text-white/90 text-[18px] leading-[1.7]">
              Two tasks. Two distinct challenges. One opportunity to demonstrate your written English proficiency.
            </p>
          </div>
        </div>
      </div>

      {/* Tasks Overview */}
      <div className="max-w-[1400px] mx-auto px-[120px] py-[80px]">
        <div className="grid grid-cols-2 gap-8">
          {/* Task 1 */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#1977f3] to-[#1558c7] p-8">
              <div className="text-white/80 text-[14px] uppercase tracking-wider mb-2">Task 1</div>
              <h3 className="text-white text-[32px] mb-3" style={{ fontFamily: 'Georgia, serif' }}>Visual Description</h3>
              <div className="flex items-baseline gap-6 text-white">
                <div>
                  <div className="text-[36px]" style={{ fontFamily: 'Georgia, serif' }}>150</div>
                  <div className="text-[12px] text-white/70">words minimum</div>
                </div>
                <div>
                  <div className="text-[36px]" style={{ fontFamily: 'Georgia, serif' }}>20</div>
                  <div className="text-[12px] text-white/70">minutes suggested</div>
                </div>
              </div>
            </div>
            <div className="p-8">
              <p className="text-[#1e1e1e] mb-6 leading-[1.7]">
                Describe visual information in your own words — graphs, tables, charts, or diagrams.
              </p>
              <div className="space-y-2">
                <div className="text-[#666] text-[14px] mb-3">Visual Types:</div>
                {task1Types.map((type, index) => (
                  <div key={index} className="flex items-center gap-3 text-[#1e1e1e]">
                    <div className="w-1.5 h-1.5 bg-[#fcbf65] rounded-full"></div>
                    <span>{type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Task 2 */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#fcbf65] to-[#f4a940] p-8">
              <div className="text-[#1e1e1e]/70 text-[14px] uppercase tracking-wider mb-2">Task 2</div>
              <h3 className="text-[#1e1e1e] text-[32px] mb-3" style={{ fontFamily: 'Georgia, serif' }}>Essay Writing</h3>
              <div className="flex items-baseline gap-6 text-[#1e1e1e]">
                <div>
                  <div className="text-[36px]" style={{ fontFamily: 'Georgia, serif' }}>250</div>
                  <div className="text-[12px] text-[#1e1e1e]/70">words minimum</div>
                </div>
                <div>
                  <div className="text-[36px]" style={{ fontFamily: 'Georgia, serif' }}>40</div>
                  <div className="text-[12px] text-[#1e1e1e]/70">minutes suggested</div>
                </div>
              </div>
            </div>
            <div className="p-8">
              <p className="text-[#1e1e1e] mb-6 leading-[1.7]">
                Respond to a point of view, argument, or problem with a well-structured essay.
              </p>
              <div className="space-y-3">
                <div className="text-[#666] text-[14px] mb-3">Essay Types:</div>
                {task2Types.map((type, index) => (
                  <div key={index} className="border-l-2 border-[#1977f3] pl-4">
                    <div className="text-[#1e1e1e]">{type.name}</div>
                    <div className="text-[#666] text-[14px]">{type.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Criteria */}
      <div className="max-w-[1400px] mx-auto px-[120px] py-[100px]">
        <h2 className="text-[42px] text-[#1e1e1e] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          How It's Scored
        </h2>
        <p className="text-[#666] text-[18px] mb-12 max-w-[800px]">
          Certificated IELTS examiners assess your performance using four equally-weighted criteria. Each contributes 25% to your overall Writing band score.
        </p>

        <div className="grid grid-cols-2 gap-8">
          {criteria.map((criterion, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-orange-50/50 via-white to-blue-50/50 rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-orange-100"
            >
              <div className="flex items-start gap-4">
                <div className="text-[48px] text-[#fcbf65]/30 leading-none" style={{ fontFamily: 'Georgia, serif' }}>
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="flex-1">
                  <h3 className="text-[22px] text-[#1e1e1e] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                    {criterion.name}
                  </h3>
                  <p className="text-[#666] leading-[1.7]">{criterion.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-[#fcbf65]/10 rounded-xl p-8 border-2 border-[#fcbf65]/30">
          <p className="text-[#1e1e1e] text-[16px] leading-[1.8]">
            <strong>Task Achievement</strong> (in Task 1) and <strong>Task Response</strong> (in Task 2) assess how accurately, appropriately and relevantly your response covers the task requirements, using the minimum word count.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}