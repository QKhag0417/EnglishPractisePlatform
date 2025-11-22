import { useState } from 'react';
import { Bookmark } from 'lucide-react';

interface Exercise {
  id: number;
  title: string;
  attempts: string;
  image: string;
  task?: number[];
  questionTypes?: string[];
  topics?: string[];
  status?: 'not-started' | 'in-progress' | 'completed';
  updated?: string;
  questions?: number;
  duration?: number;
}

interface ExerciseCardProps {
  exercise: Exercise;
  onSelect: () => void;
  isLoggedIn?: boolean;
}

export function ExerciseCard({ exercise, onSelect, isLoggedIn = false }: ExerciseCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div
      className="cursor-pointer group"
      onClick={onSelect}
    >
      <div className="relative w-full aspect-[4/3] rounded-[8px] overflow-hidden mb-[10px]">
        <img
          src={exercise.image}
          alt={exercise.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {/* Bookmark Icon - Only show for logged in users */}
        {isLoggedIn && (
          <button
            onClick={handleBookmarkClick}
            className="absolute top-[12px] right-[12px] z-10 bg-white/90 hover:bg-white rounded-full p-[8px] transition-colors"
          >
            <Bookmark
              className={`w-[20px] h-[20px] transition-colors ${
                isBookmarked ? 'fill-[#fcbf65] stroke-[#fcbf65]' : 'stroke-gray-700'
              }`}
            />
          </button>
        )}
      </div>
      <h3 className="font-['Inter'] font-semibold text-[14px] mb-[4px]">{exercise.title}</h3>
      <p className="font-['Inter'] text-[12px] text-[rgba(0,0,0,0.47)]">{exercise.attempts}</p>
    </div>
  );
}