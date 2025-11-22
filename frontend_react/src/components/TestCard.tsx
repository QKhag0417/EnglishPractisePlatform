import { useState } from 'react';
import { Bookmark } from 'lucide-react';

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

interface TestCardProps {
  test: Test;
  setSelectedTest: (test: Test) => void;
  isLoggedIn?: boolean;
}

export function TestCard({ test, setSelectedTest, isLoggedIn = false }: TestCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div 
      className="cursor-pointer group"
      onClick={() => setSelectedTest(test)}
    >
      <div className="relative w-full aspect-[4/3] rounded-[8px] overflow-hidden mb-[10px]">
        <img 
          src={test.image} 
          alt={test.title} 
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
      <h3 className="font-['Inter'] font-semibold text-[14px] mb-[4px]">{test.title}</h3>
      <p className="font-['Inter'] text-[12px] text-[rgba(0,0,0,0.47)]">{test.attempts}</p>
    </div>
  );
}