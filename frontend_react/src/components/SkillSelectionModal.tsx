import { X, Headphones, BookOpen, PenTool, Mic } from 'lucide-react';
import { useState } from 'react';

type Skill = 'Listening' | 'Reading' | 'Writing' | 'Speaking';

interface SkillSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSkillSelect: (skill: Skill) => void;
}

interface SkillCardData {
  name: Skill;
  icon: React.ReactNode;
  description: string;
}

const skillsData: SkillCardData[] = [
  {
    name: 'Listening',
    icon: <Headphones className="w-[48px] h-[48px]" />,
    description: 'Audio-based questions and comprehension tasks.',
  },
  {
    name: 'Reading',
    icon: <BookOpen className="w-[48px] h-[48px]" />,
    description: 'Passages with multiple-choice and short-answer questions.',
  },
  {
    name: 'Writing',
    icon: <PenTool className="w-[48px] h-[48px]" />,
    description: 'Task 1 and Task 2 writing prompts.',
  },
  {
    name: 'Speaking',
    icon: <Mic className="w-[48px] h-[48px]" />,
    description: 'Interview-style and cue card prompts.',
  },
];

export function SkillSelectionModal({ isOpen, onClose, onSkillSelect }: SkillSelectionModalProps) {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  if (!isOpen) return null;

  const handleContinue = () => {
    if (selectedSkill) {
      onSkillSelect(selectedSkill);
      setSelectedSkill(null);
    }
  };

  const handleClose = () => {
    setSelectedSkill(null);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        onClick={handleClose}
      >
        {/* Modal */}
        <div 
          className="bg-white rounded-[16px] w-[700px] max-h-[90vh] overflow-y-auto shadow-[0_10px_40px_rgba(0,0,0,0.15)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative border-b border-gray-200 px-[40px] py-[32px]">
            <button
              onClick={handleClose}
              className="absolute top-[24px] right-[24px] bg-gray-100 hover:bg-gray-200 rounded-full p-[8px] transition-colors"
            >
              <X className="w-[20px] h-[20px] text-gray-600" />
            </button>
            
            <h2 className="font-['Inter'] text-[28px] text-gray-900 mb-[8px]">
              Choose Skill to Add Content
            </h2>
            <p className="font-['Inter'] text-[16px] text-gray-500">
              Select the IELTS skill you want to create a new exercise for.
            </p>
          </div>

          {/* Content */}
          <div className="px-[40px] py-[32px]">
            {/* Skill Cards Grid */}
            <div className="grid grid-cols-2 gap-[20px] mb-[32px]">
              {skillsData.map((skill) => (
                <button
                  key={skill.name}
                  onClick={() => setSelectedSkill(skill.name)}
                  className={`
                    relative bg-white border-2 rounded-[12px] p-[24px] 
                    text-left transition-all cursor-pointer
                    hover:border-[#1977f3] hover:shadow-[0_4px_12px_rgba(25,119,243,0.15)]
                    ${
                      selectedSkill === skill.name
                        ? 'border-[#1977f3] bg-[#1977f3]/5 shadow-[0_4px_12px_rgba(25,119,243,0.15)]'
                        : 'border-gray-200'
                    }
                  `}
                >
                  {/* Selected Indicator */}
                  {selectedSkill === skill.name && (
                    <div className="absolute top-[16px] right-[16px] w-[24px] h-[24px] bg-[#1977f3] rounded-full flex items-center justify-center">
                      <svg
                        className="w-[14px] h-[14px] text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  )}

                  {/* Icon */}
                  <div 
                    className={`
                      mb-[16px] transition-colors
                      ${selectedSkill === skill.name ? 'text-[#1977f3]' : 'text-gray-400'}
                    `}
                  >
                    {skill.icon}
                  </div>

                  {/* Skill Name */}
                  <h3 
                    className={`
                      font-['Inter'] font-semibold text-[20px] mb-[8px] transition-colors
                      ${selectedSkill === skill.name ? 'text-[#1977f3]' : 'text-gray-900'}
                    `}
                  >
                    {skill.name}
                  </h3>

                  {/* Description */}
                  <p className="font-['Inter'] text-[14px] text-gray-500 leading-[1.5]">
                    {skill.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-[40px] py-[24px] flex justify-end gap-[12px]">
            <button
              onClick={handleClose}
              className="px-[24px] py-[12px] font-['Inter'] font-medium text-[16px] text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              disabled={!selectedSkill}
              className={`
                px-[32px] py-[12px] font-['Inter'] font-semibold text-[16px] 
                rounded-[8px] transition-all
                ${
                  selectedSkill
                    ? 'bg-[#1977f3] hover:bg-[#1567d3] text-white cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
