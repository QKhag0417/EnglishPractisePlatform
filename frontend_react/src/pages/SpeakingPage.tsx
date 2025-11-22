import { useState } from 'react';
import { NavBarLearner, NavBarGuest } from '../components/NavBar';
import { Footer } from '../components/Footer';
import { Page } from '../App';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ExerciseCard } from '../components/ExerciseCard';
import { ExerciseModal } from '../components/ExerciseModal';

interface SpeakingPageProps {
  setCurrentPage: (page: Page) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

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

const exercises: Exercise[] = [
  {
    id: 1,
    title: 'Hometown and Family',
    attempts: '12k attempts',
    image: 'https://images.unsplash.com/photo-1758687126048-4790d3d7e4ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBob21lJTIwY29udmVyc2F0aW9ufGVufDF8fHx8MTc2MzYyNDA2OXww&ixlib=rb-4.1.0&q=80&w=1080',
    task: [1],
    questionTypes: ['Introduction', 'Personal Questions'],
    topics: ['Home', 'Family'],
    status: 'not-started',
    updated: '2024-03-15',
    questions: 12,
    duration: 5
  },
  {
    id: 2,
    title: 'Describe a Memorable Journey',
    attempts: '9k attempts',
    image: 'https://images.unsplash.com/photo-1515623959088-7617915baa1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBqb3VybmV5JTIwYWR2ZW50dXJlfGVufDF8fHx8MTc2MzYyNDA2OXww&ixlib=rb-4.1.0&q=80&w=1080',
    task: [2],
    questionTypes: ['Long Turn', 'Cue Card'],
    topics: ['Travel/Tourism'],
    status: 'not-started',
    updated: '2024-03-14',
    questions: 1,
    duration: 4
  },
  {
    id: 3,
    title: 'Childhood Memories',
    attempts: '7k attempts',
    image: 'https://images.unsplash.com/photo-1759409972630-22a1b27840ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZGhvb2QlMjBtZW1vcmllcyUyMHBob3Rvc3xlbnwxfHx8fDE3NjM2MjQwNjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    task: [2],
    questionTypes: ['Long Turn', 'Cue Card'],
    topics: ['Personal Experience', 'Social'],
    status: 'not-started',
    updated: '2024-03-13',
    questions: 1,
    duration: 4
  },
  {
    id: 4,
    title: 'Technology in Society',
    attempts: '10k attempts',
    image: 'https://images.unsplash.com/photo-1573757056004-065ad36e2cf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwZnV0dXJlJTIwaW5ub3ZhdGlvbnxlbnwxfHx8fDE3NjM1NTgyMzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    task: [3],
    questionTypes: ['Discussion', 'Abstract Ideas'],
    topics: ['Science & Technology', 'Social'],
    status: 'not-started',
    updated: '2024-03-12',
    questions: 6,
    duration: 5
  },
  {
    id: 5,
    title: 'Work and Studies',
    attempts: '11k attempts',
    image: 'https://images.unsplash.com/photo-1759922378123-a1f4f1e39bae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBsZWFybmluZyUyMHN0dWRlbnRzfGVufDF8fHx8MTc2MzYyNDA3MHww&ixlib=rb-4.1.0&q=80&w=1080',
    task: [1],
    questionTypes: ['Introduction', 'Personal Questions'],
    topics: ['Work/Careers', 'Education'],
    status: 'in-progress',
    updated: '2024-03-11',
    questions: 12,
    duration: 5
  },
  {
    id: 6,
    title: 'Special Celebration',
    attempts: '8k attempts',
    image: 'https://images.unsplash.com/photo-1761300725208-e8f92da35f5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZWxlYnJhdGlvbiUyMHBhcnR5JTIwZXZlbnR8ZW58MXx8fHwxNzYzNTY1MzA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    task: [2],
    questionTypes: ['Long Turn', 'Cue Card'],
    topics: ['Culture & Arts', 'Social'],
    status: 'not-started',
    updated: '2024-03-10',
    questions: 1,
    duration: 4
  },
  {
    id: 7,
    title: 'Education Systems',
    attempts: '6k attempts',
    image: 'https://images.unsplash.com/photo-1759922378123-a1f4f1e39bae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBsZWFybmluZyUyMHN0dWRlbnRzfGVufDF8fHx8MTc2MzYyNDA3MHww&ixlib=rb-4.1.0&q=80&w=1080',
    task: [3],
    questionTypes: ['Discussion', 'Abstract Ideas'],
    topics: ['Education'],
    status: 'not-started',
    updated: '2024-03-09',
    questions: 6,
    duration: 5
  },
  {
    id: 8,
    title: 'Books and Reading',
    attempts: '7k attempts',
    image: 'https://images.unsplash.com/photo-1608593329139-3f617b4f50d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwcmVhZGluZyUyMGxpdGVyYXR1cmV8ZW58MXx8fHwxNzYzNTk2ODY1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    task: [1],
    questionTypes: ['Introduction', 'Personal Questions'],
    topics: ['Culture & Arts', 'Education'],
    status: 'completed',
    updated: '2024-03-08',
    questions: 12,
    duration: 5
  },
  {
    id: 9,
    title: 'Environmental Issues',
    attempts: '9k attempts',
    image: 'https://images.unsplash.com/photo-1753833965818-46c1ce417b84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBlbnZpcm9ubWVudCUyMG91dGRvb3J8ZW58MXx8fHwxNzYzNjI0MDcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    task: [3],
    questionTypes: ['Discussion', 'Abstract Ideas'],
    topics: ['Environment'],
    status: 'not-started',
    updated: '2024-03-07',
    questions: 6,
    duration: 5
  },
  {
    id: 10,
    title: 'Describe a Favorite Dish',
    attempts: '8k attempts',
    image: 'https://images.unsplash.com/photo-1626100306508-4f47da07b66b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwZm9vZCUyMGN1aXNpbmV8ZW58MXx8fHwxNzYzNjI0MDcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    task: [2],
    questionTypes: ['Long Turn', 'Cue Card'],
    topics: ['Food', 'Culture & Arts'],
    status: 'not-started',
    updated: '2024-03-06',
    questions: 1,
    duration: 4
  },
  {
    id: 11,
    title: 'Music and Entertainment',
    attempts: '10k attempts',
    image: 'https://images.unsplash.com/photo-1763391089727-833d30d52127?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGluc3RydW1lbnRzJTIwcGVyZm9ybWFuY2V8ZW58MXx8fHwxNzYzNjI0MDcyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    task: [1],
    questionTypes: ['Introduction', 'Personal Questions'],
    topics: ['Culture & Arts', 'Entertainment'],
    status: 'not-started',
    updated: '2024-03-05',
    questions: 12,
    duration: 5
  },
  {
    id: 12,
    title: 'Sports and Health',
    attempts: '9k attempts',
    image: 'https://images.unsplash.com/photo-1522898467493-49726bf28798?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBmaXRuZXNzJTIwZXhlcmNpc2V8ZW58MXx8fHwxNzYzNjI0MDcyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    task: [3],
    questionTypes: ['Discussion', 'Abstract Ideas'],
    topics: ['Health & Medicine', 'Sports / Leisure'],
    status: 'not-started',
    updated: '2024-03-04',
    questions: 6,
    duration: 5
  }
];

export function SpeakingPage({ setCurrentPage, isLoggedIn, onLogout }: SpeakingPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<'all' | string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'attempts' | 'a-z' | 'z-a'>('newest');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopic === 'all' || exercise.topics.includes(selectedTopic);
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(exercise.status);
    return matchesSearch && matchesTopic && matchesStatus;
  });

  const toggleStatus = (status: string) => {
    setSelectedStatus(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const topics = ['Home', 'Family', 'Work/Careers', 'Education', 'Travel/Tourism', 'Health & Medicine', 'Environment', 'Culture & Arts', 'Science & Technology', 'Social', 'Personal Experience', 'Food', 'Sports / Leisure', 'Entertainment', 'Other'];

  return (
    <div className="bg-white min-h-screen">
      {isLoggedIn ? <NavBarLearner setCurrentPage={setCurrentPage} onLogout={onLogout} /> : <NavBarGuest setCurrentPage={setCurrentPage} />}

      <div className="pt-[90px] px-[30px] pb-[30px]">
        {/* Search Feature */}
        <div className="flex gap-[10px] mb-[20px]">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or topic"
              className="w-full h-[38px] px-[40px] border border-[rgba(0,0,0,0.3)] rounded-[8px] focus:outline-none focus:border-[#fcbf65]"
            />
            <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-black" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-[12px] top-1/2 -translate-y-1/2"
              >
                <X className="w-[18px] h-[18px] text-black" />
              </button>
            )}
          </div>
          <button className="h-[38px] px-[20px] bg-white border-2 border-[#fcbf65] rounded-[12px] text-[#fcbf65] hover:bg-[#fcbf65] hover:text-white transition-colors">
            Search
          </button>
        </div>

        {/* Topic Filter */}
        <div className="bg-[rgba(119,203,242,0.12)] border border-[rgba(0,0,0,0.11)] rounded-[10px] p-[18px] mb-[20px]">
          <div className="flex items-center gap-[10px] flex-wrap">
            <span className="font-['Inter'] font-bold text-[13px]">Topic</span>
            <button
              onClick={() => setSelectedTopic('all')}
              className={`px-[12px] py-[2px] rounded-[4px] border border-black text-[11px] ${selectedTopic === 'all' ? 'bg-[#fcbf65]' : 'bg-white'}`}
            >
              All
            </button>
            {topics.map(topic => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`px-[12px] py-[2px] rounded-[4px] border border-black text-[11px] whitespace-nowrap ${selectedTopic === topic ? 'bg-[#fcbf65]' : 'bg-white'}`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-[30px]">
          {/* Sidebar */}
          <div className="w-[158px] bg-[rgba(119,203,242,0.12)] border border-[rgba(0,0,0,0.11)] rounded-[10px] p-[18px] self-start">
            {/* Status */}
            <div className="mb-[20px]">
              <h3 className="font-['Inter'] font-bold text-[13px] mb-[12px]">Status</h3>
              <label className="flex items-center gap-[8px] mb-[8px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedStatus.includes('not-started')}
                  onChange={() => toggleStatus('not-started')}
                  className="w-[16px] h-[16px] rounded-[3px] border-[#b3b3b3]"
                />
                <span className="font-['Inter'] text-[12px] text-[rgba(0,0,0,0.47)]">Not started</span>
              </label>
              <label className="flex items-center gap-[8px] mb-[8px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedStatus.includes('in-progress')}
                  onChange={() => toggleStatus('in-progress')}
                  className="w-[16px] h-[16px] rounded-[3px] border-[#b3b3b3]"
                />
                <span className="font-['Inter'] text-[12px] text-[rgba(0,0,0,0.47)]">In progress</span>
              </label>
              <label className="flex items-center gap-[8px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedStatus.includes('completed')}
                  onChange={() => toggleStatus('completed')}
                  className="w-[16px] h-[16px] rounded-[3px] border-[#b3b3b3]"
                />
                <span className="font-['Inter'] text-[12px] text-[rgba(0,0,0,0.47)]">Completed</span>
              </label>
            </div>

            <div className="border-t border-black mb-[20px]" />

            {/* Sort By */}
            <div>
              <h3 className="font-['Inter'] font-bold text-[13px] mb-[12px]">Sort By</h3>
              <label className="flex items-center gap-[8px] mb-[8px] cursor-pointer">
                <input
                  type="radio"
                  checked={sortBy === 'newest'}
                  onChange={() => setSortBy('newest')}
                  name="sort"
                  className="w-[16px] h-[16px]"
                />
                <span className="font-['Inter'] text-[12px] text-[rgba(0,0,0,0.47)]">Newest</span>
              </label>
              <label className="flex items-center gap-[8px] mb-[8px] cursor-pointer">
                <input
                  type="radio"
                  checked={sortBy === 'oldest'}
                  onChange={() => setSortBy('oldest')}
                  name="sort"
                  className="w-[16px] h-[16px]"
                />
                <span className="font-['Inter'] text-[12px] text-[rgba(0,0,0,0.47)]">Oldest</span>
              </label>
              <label className="flex items-center gap-[8px] mb-[8px] cursor-pointer">
                <input
                  type="radio"
                  checked={sortBy === 'attempts'}
                  onChange={() => setSortBy('attempts')}
                  name="sort"
                  className="w-[16px] h-[16px]"
                />
                <span className="font-['Inter'] text-[12px] text-[rgba(0,0,0,0.47)]">Most attempts</span>
              </label>
              <label className="flex items-center gap-[8px] mb-[8px] cursor-pointer">
                <input
                  type="radio"
                  checked={sortBy === 'a-z'}
                  onChange={() => setSortBy('a-z')}
                  name="sort"
                  className="w-[16px] h-[16px]"
                />
                <span className="font-['Inter'] text-[12px] text-[rgba(0,0,0,0.47)]">A → Z</span>
              </label>
              <label className="flex items-center gap-[8px] cursor-pointer">
                <input
                  type="radio"
                  checked={sortBy === 'z-a'}
                  onChange={() => setSortBy('z-a')}
                  name="sort"
                  className="w-[16px] h-[16px]"
                />
                <span className="font-['Inter'] text-[12px] text-[rgba(0,0,0,0.47)]">Z → A</span>
              </label>
            </div>
          </div>

          {/* Exercise Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-4 gap-x-[20px] gap-y-[30px]">
              {filteredExercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onSelect={() => setSelectedExercise(exercise)}
                  isLoggedIn={isLoggedIn}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-[30px]">
              <span className="text-[#202224] text-[14px] opacity-60 font-['Nunito_Sans']">
                Showing 1-{Math.min(filteredExercises.length, 12)} of {filteredExercises.length}
              </span>
              <div className="flex items-center gap-[10px] bg-[#FAFBFD] border border-[#D5D5D5] rounded-[8px] px-[10px] py-[5px]">
                <button className="opacity-60 hover:opacity-100 transition-opacity">
                  <ChevronLeft className="w-[20px] h-[20px]" />
                </button>
                <div className="w-[1px] h-[20px] bg-[#979797]" />
                <button className="opacity-90 hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-[20px] h-[20px]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Exercise Modal */}
      {selectedExercise && (
        <ExerciseModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onStart={() => {
            // Handle start exercise - in real app would navigate to exercise page
            console.log('Starting exercise:', selectedExercise.title);
            setSelectedExercise(null);
          }}
          isLoggedIn={isLoggedIn}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}