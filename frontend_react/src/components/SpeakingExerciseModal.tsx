import { X, Clock, FileText, Calendar, CheckCircle, Circle, PlayCircle } from 'lucide-react';
import { Page } from '../App';
import { TagChips } from './TagChips';

interface Exercise {
  id: number;
  title: string;
  attempts: string;
  image: string;
  task: number[];
  questionTypes: string[];
  topics: string[];
  status: 'not-started' | 'in-progress' | 'completed';
  updated: string;
  questions: number;
  duration: number;
}

interface SpeakingExerciseModalProps {
  exercise: Exercise;
  onClose: () => void;
  onStart: () => void;
  isLoggedIn: boolean;
  setCurrentPage: (page: Page) => void;
}

export function SpeakingExerciseModal({ exercise, onClose, onStart, isLoggedIn, setCurrentPage }: SpeakingExerciseModalProps) {
  const getStatusColor = () => {
    switch (exercise.status) {
      case 'completed':
        return 'text-green-600';
      case 'in-progress':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (exercise.status) {
      case 'completed':
        return <CheckCircle className="w-[20px] h-[20px]" />;
      case 'in-progress':
        return <PlayCircle className="w-[20px] h-[20px]" />;
      default:
        return <Circle className="w-[20px] h-[20px]" />;
    }
  };

  const getStatusText = () => {
    switch (exercise.status) {
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
          className="bg-white rounded-[12px] w-[800px] max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Image */}
          <div className="relative h-[300px]">
            <img 
              src={exercise.image} 
              alt={exercise.title}
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
          <div className="p-[32px]">
            {/* Title */}
            <h2 className="font-['Inter'] font-bold text-[28px] text-black mb-[24px]">
              {exercise.title}
            </h2>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-[24px] mb-[32px]">
              {/* Topic */}
              <div>
                <p className="font-['Inter'] font-semibold text-[14px] text-gray-600 mb-[8px]">
                  Topic
                </p>
                <div className="flex gap-[8px] flex-wrap">
                  <TagChips tags={exercise.topics} colorClass="bg-blue-100" />
                </div>
              </div>

              {/* Status */}
              <div>
                <p className="font-['Inter'] font-semibold text-[14px] text-gray-600 mb-[8px]">
                  Status
                </p>
                <div className={`flex items-center gap-[8px] ${getStatusColor()}`}>
                  {getStatusIcon()}
                  <span className="font-['Inter'] font-medium text-[14px]">
                    {getStatusText()}
                  </span>
                </div>
              </div>

              {/* Updated On */}
              <div>
                <p className="font-['Inter'] font-semibold text-[14px] text-gray-600 mb-[8px]">
                  Updated On
                </p>
                <div className="flex items-center gap-[8px] text-gray-700">
                  <Calendar className="w-[20px] h-[20px]" />
                  <span className="font-['Inter'] text-[14px]">
                    {exercise.updated}
                  </span>
                </div>
              </div>

              {/* Number of Questions */}
              <div>
                <p className="font-['Inter'] font-semibold text-[14px] text-gray-600 mb-[8px]">
                  Questions
                </p>
                <div className="flex items-center gap-[8px] text-gray-700">
                  <FileText className="w-[20px] h-[20px]" />
                  <span className="font-['Inter'] text-[14px]">
                    {exercise.questions} questions
                  </span>
                </div>
              </div>

              {/* Duration */}
              <div>
                <p className="font-['Inter'] font-semibold text-[14px] text-gray-600 mb-[8px]">
                  Duration
                </p>
                <div className="flex items-center gap-[8px] text-gray-700">
                  <Clock className="w-[20px] h-[20px]" />
                  <span className="font-['Inter'] text-[14px]">
                    {exercise.duration} minutes
                  </span>
                </div>
              </div>

              {/* Attempts */}
              <div>
                <p className="font-['Inter'] font-semibold text-[14px] text-gray-600 mb-[8px]">
                  Attempts
                </p>
                <div className="flex items-center gap-[8px] text-gray-700">
                  <span className="font-['Inter'] text-[14px]">
                    {exercise.attempts}
                  </span>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  onClose();
                  setCurrentPage('auth-prompt');
                } else {
                  onStart();
                }
              }}
              className="w-full h-[56px] bg-[#fcbf65] hover:bg-[#e5ab52] rounded-[12px] font-['Inter'] font-bold text-[18px] text-black transition-colors"
            >
              {exercise.status === 'completed' ? 'Practice Again' : exercise.status === 'in-progress' ? 'Continue' : 'Start Practice'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
