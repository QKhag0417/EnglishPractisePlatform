import { X, Headphones, BookOpen, PenTool, Mic, Calendar, TrendingUp } from 'lucide-react';
import { Page } from '../App';

type TestStatus = 'not-started' | 'in-progress' | 'completed';

interface Test {
  id: number;
  title: string;
  attempts: string;
  status: TestStatus;
  image: string;
  testFormat: string;
  updated: string;
  taken: number;
}

interface TestModalProps {
  test: Test;
  onClose: () => void;
  isLoggedIn: boolean;
  setCurrentPage: (page: Page) => void;
}

export function TestModal({ test, onClose, isLoggedIn, setCurrentPage }: TestModalProps) {
  const skills = [
    { icon: Headphones, label: 'Listening', color: '#1977f3' },
    { icon: BookOpen, label: 'Reading', color: '#1977f3' },
    { icon: PenTool, label: 'Writing', color: '#1977f3' },
    { icon: Mic, label: 'Speaking', color: '#1977f3' }
  ];

  // Extract test number from title (e.g., "Academic Cambridge 16 Test 1" -> "1")
  const testNumber = test.title.match(/Test (\d+)/)?.[1] || '1';
  const modalTitle = test.testFormat === 'Academic' 
    ? `ACADEMIC Test ${testNumber}` 
    : `GENERAL TRAINING Test ${testNumber}`;

  const getStatusColor = () => {
    switch (test.status) {
      case 'completed':
        return 'text-green-600';
      case 'in-progress':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = () => {
    switch (test.status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      default:
        return 'Not Started';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Modal */}
        <div 
          className="bg-white rounded-[12px] w-[700px]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Image */}
          <div className="relative h-[200px]">
            <img 
              src={test.image} 
              alt={test.title}
              className="w-full h-full object-cover rounded-t-[12px]"
            />
            <button
              onClick={onClose}
              className="absolute top-[16px] right-[16px] bg-white rounded-full p-[8px] hover:bg-gray-100 transition-colors"
            >
              <X className="w-[24px] h-[24px] text-black" />
            </button>
          </div>

          {/* Content */}
          <div className="p-[24px]">
            {/* Title */}
            <h2 className="font-['Inter'] font-bold text-[24px] text-black mb-[16px]">
              {test.title}
            </h2>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-x-[20px] gap-y-[12px] mb-[20px]">
              {/* Test Format */}
              <div>
                <p className="font-['Inter'] font-semibold text-[13px] text-gray-600 mb-[6px]">
                  Test Format
                </p>
                <span className="px-[10px] py-[3px] bg-[#fcbf65] rounded-[6px] font-['Inter'] text-[13px] text-black inline-block">
                  {test.testFormat}
                </span>
              </div>

              {/* Status */}
              <div>
                <p className="font-['Inter'] font-semibold text-[13px] text-gray-600 mb-[6px]">
                  Status
                </p>
                <span className={`font-['Inter'] font-medium text-[13px] ${getStatusColor()}`}>
                  {getStatusText()}
                </span>
              </div>

              {/* Updated On */}
              <div>
                <p className="font-['Inter'] font-semibold text-[13px] text-gray-600 mb-[6px]">
                  Updated On
                </p>
                <div className="flex items-center gap-[6px] text-gray-700">
                  <Calendar className="w-[16px] h-[16px]" />
                  <span className="font-['Inter'] text-[13px]">
                    {test.updated}
                  </span>
                </div>
              </div>

              {/* Attempts */}
              <div>
                <p className="font-['Inter'] font-semibold text-[13px] text-gray-600 mb-[6px]">
                  Attempts
                </p>
                <div className="flex items-center gap-[6px] text-gray-700">
                  <span className="font-['Inter'] text-[13px]">
                    {test.attempts}
                  </span>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="mb-[20px]">
              <p className="font-['Inter'] font-semibold text-[13px] text-gray-600 mb-[10px]">
                Skills
              </p>
              <div className="grid grid-cols-4 gap-[10px]">
                {skills.map((skill) => (
                  <div 
                    key={skill.label} 
                    className="flex flex-col items-center gap-[6px]"
                    onClick={() => {
                      if (!isLoggedIn) {
                        onClose();
                        setCurrentPage('auth-prompt');
                      } else {
                        // Handle skill click for logged-in users
                        console.log('Skill clicked:', skill.label);
                      }
                    }}
                  >
                    <div className="w-full aspect-square bg-white border-2 border-gray-200 rounded-[8px] flex items-center justify-center hover:border-[#fcbf65] transition-colors cursor-pointer">
                      <skill.icon className="w-[28px] h-[28px]" style={{ color: skill.color }} />
                    </div>
                    <span className="font-['Inter'] text-[11px] text-gray-700">{skill.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Full Test Button */}
            <button 
              onClick={() => {
                if (!isLoggedIn) {
                  onClose();
                  setCurrentPage('auth-prompt');
                } else {
                  // Handle start test - in real app would navigate to test page
                  console.log('Starting test:', test.title);
                  onClose();
                }
              }}
              className="w-full h-[48px] bg-[#fcbf65] hover:bg-[#e5ab52] rounded-[12px] font-['Inter'] font-bold text-[16px] text-black transition-colors"
            >
              Take Full IELTS Mock Test
            </button>
          </div>
        </div>
      </div>
    </>
  );
}