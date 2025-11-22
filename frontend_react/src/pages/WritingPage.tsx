import { useState } from 'react';
import { NavBarLearner, NavBarGuest } from '../components/NavBar';
import { Footer } from '../components/Footer';
import { Page } from '../App';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ExerciseModal } from '../components/ExerciseModal';
import { ExerciseCard } from '../components/ExerciseCard';

interface WritingPageProps {
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
  updated?: string;
  questions?: number;
  duration?: number;
}

const exercises: Exercise[] = [
  {
    id: 1,
    title: 'Bar Chart: Global Coffee Consumption',
    attempts: '10k attempts',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    task: [1],
    questionTypes: ['Bar Chart'],
    topics: ['Business', 'Food & Drink'],
    status: 'not-started'
  },
  {
    id: 2,
    title: 'Essay: Education System Reform',
    attempts: '14k attempts',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400',
    task: [2],
    questionTypes: ['Opinion Essay'],
    topics: ['Education'],
    status: 'not-started'
  },
  {
    id: 3,
    title: 'Line Graph: Internet Usage Trends',
    attempts: '8k attempts',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
    task: [1],
    questionTypes: ['Line Graph'],
    topics: ['Science & Technology'],
    status: 'in-progress'
  },
  {
    id: 4,
    title: 'Essay: Environmental Protection',
    attempts: '12k attempts',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400',
    task: [2],
    questionTypes: ['Discussion Essay'],
    topics: ['Environment'],
    status: 'not-started'
  },
  {
    id: 5,
    title: 'Pie Chart: Energy Sources Distribution',
    attempts: '7k attempts',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400',
    task: [1],
    questionTypes: ['Pie Chart'],
    topics: ['Environment', 'Science & Technology'],
    status: 'not-started'
  },
  {
    id: 6,
    title: 'Essay: Work-Life Balance',
    attempts: '11k attempts',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
    task: [2],
    questionTypes: ['Problem-Solution Essay'],
    topics: ['Work/Careers', 'Social'],
    status: 'completed'
  },
  {
    id: 7,
    title: 'Table: Population Statistics',
    attempts: '6k attempts',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400',
    task: [1],
    questionTypes: ['Table'],
    topics: ['Social'],
    status: 'not-started'
  },
  {
    id: 8,
    title: 'Essay: Technology and Society',
    attempts: '13k attempts',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
    task: [2],
    questionTypes: ['Advantages-Disadvantages Essay'],
    topics: ['Science & Technology', 'Social'],
    status: 'not-started'
  },
  {
    id: 9,
    title: 'Process Diagram: Water Cycle',
    attempts: '5k attempts',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
    task: [1],
    questionTypes: ['Process Diagram'],
    topics: ['Environment', 'Science & Technology'],
    status: 'not-started'
  },
  {
    id: 10,
    title: 'Essay: Healthcare Challenges',
    attempts: '9k attempts',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400',
    task: [2],
    questionTypes: ['Discussion Essay'],
    topics: ['Health & Medicine'],
    status: 'not-started'
  },
  {
    id: 11,
    title: 'Map: Urban Development Plan',
    attempts: '7k attempts',
    image: 'https://images.unsplash.com/photo-1712697235739-c041c70c75df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwbWFwJTIwdXJiYW4lMjBwbGFubmluZ3xlbnwxfHx8fDE3NjM2MjQ4NDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    task: [1],
    questionTypes: ['Map'],
    topics: ['Social', 'Environment'],
    status: 'in-progress'
  },
  {
    id: 12,
    title: 'Essay: Cultural Diversity',
    attempts: '10k attempts',
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400',
    task: [2],
    questionTypes: ['Opinion Essay'],
    topics: ['Culture & Arts', 'Social'],
    status: 'not-started'
  }
];

export function WritingPage({ setCurrentPage, isLoggedIn, onLogout }: WritingPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<'all' | number>('all');
  const [selectedQuestionType, setSelectedQuestionType] = useState<'all' | string>('all');
  const [selectedTopic, setSelectedTopic] = useState<'all' | string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'attempts' | 'a-z' | 'z-a'>('newest');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  // All possible options
  const task1Types = ['Bar Chart', 'Line Graph', 'Pie Chart', 'Table', 'Process Diagram', 'Map', 'Mixed Charts'];
  const task2Types = ['Opinion Essay', 'Discussion Essay', 'Problem-Solution Essay', 'Advantages-Disadvantages Essay', 'Two-Part Question'];
  const allQuestionTypes = [...task1Types, ...task2Types];
  const allTopics = ['Environment', 'Science & Technology', 'Education', 'Health & Medicine', 'Work/Careers', 'Social', 'Culture & Arts', 'Business', 'Travel/Tourism', 'Food & Drink', 'Other'];

  // Filter exercises based on current selections
  const getFilteredExercises = (taskFilter: 'all' | number, questionTypeFilter: 'all' | string, topicFilter: 'all' | string) => {
    return exercises.filter(exercise => {
      const matchesTask = taskFilter === 'all' || exercise.task.includes(taskFilter);
      const matchesQuestionType = questionTypeFilter === 'all' || exercise.questionTypes.includes(questionTypeFilter);
      const matchesTopic = topicFilter === 'all' || exercise.topics.includes(topicFilter);
      return matchesTask && matchesQuestionType && matchesTopic;
    });
  };

  // Get available tasks based on current question type and topic selections
  const availableTasks = [1, 2].filter(task => {
    const exercises = getFilteredExercises(task, selectedQuestionType, selectedTopic);
    return exercises.length > 0;
  });

  // Get available question types based on current task and topic selections
  const availableQuestionTypes = allQuestionTypes.filter(type => {
    const exercises = getFilteredExercises(selectedTask, type, selectedTopic);
    return exercises.length > 0;
  });

  // Get available topics based on current task and question type selections
  const availableTopics = allTopics.filter(topic => {
    const exercises = getFilteredExercises(selectedTask, selectedQuestionType, topic);
    return exercises.length > 0;
  });

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTask = selectedTask === 'all' || exercise.task.includes(selectedTask);
    const matchesQuestionType = selectedQuestionType === 'all' || exercise.questionTypes.includes(selectedQuestionType);
    const matchesTopic = selectedTopic === 'all' || exercise.topics.includes(selectedTopic);
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(exercise.status);
    return matchesSearch && matchesTask && matchesQuestionType && matchesTopic && matchesStatus;
  });

  const toggleStatus = (status: string) => {
    setSelectedStatus(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };
  
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

        {/* Task Filter */}
        <div className="bg-[rgba(119,203,242,0.12)] border border-[rgba(0,0,0,0.11)] rounded-[10px] p-[18px] mb-[12px]">
          <div className="flex items-center gap-[10px] flex-wrap">
            <span className="font-['Inter'] font-bold text-[13px]">Task</span>
            <button
              onClick={() => setSelectedTask('all')}
              className={`px-[12px] py-[2px] rounded-[4px] border border-black text-[11px] ${selectedTask === 'all' ? 'bg-[#fcbf65]' : 'bg-white'}`}
            >
              All
            </button>
            {availableTasks.map(task => (
              <button
                key={task}
                onClick={() => setSelectedTask(task)}
                className={`px-[12px] py-[2px] rounded-[4px] border border-black text-[11px] ${selectedTask === task ? 'bg-[#fcbf65]' : 'bg-white'}`}
              >
                Task {task}
              </button>
            ))}
          </div>
        </div>

        {/* Question Type Filter */}
        <div className="bg-[rgba(119,203,242,0.12)] border border-[rgba(0,0,0,0.11)] rounded-[10px] p-[18px] mb-[12px]">
          <div className="flex items-center gap-[10px] flex-wrap">
            <span className="font-['Inter'] font-bold text-[13px]">Question type</span>
            <button
              onClick={() => setSelectedQuestionType('all')}
              className={`px-[12px] py-[2px] rounded-[4px] border border-black text-[11px] ${selectedQuestionType === 'all' ? 'bg-[#fcbf65]' : 'bg-white'}`}
            >
              All
            </button>
            {availableQuestionTypes.map(type => (
              <button
                key={type}
                onClick={() => setSelectedQuestionType(type)}
                className={`px-[12px] py-[2px] rounded-[4px] border border-black text-[11px] whitespace-nowrap ${selectedQuestionType === type ? 'bg-[#fcbf65]' : 'bg-white'}`}
              >
                {type}
              </button>
            ))}
          </div>
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
            {availableTopics.map(topic => (
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