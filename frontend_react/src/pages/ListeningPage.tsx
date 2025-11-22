import { useState } from 'react';
import { NavBarLearner, NavBarGuest } from '../components/NavBar';
import { Footer } from '../components/Footer';
import { Page } from '../App';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ExerciseCard } from '../components/ExerciseCard';
import { ExerciseModal } from '../components/ExerciseModal';

interface ListeningPageProps {
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
    title: 'Transport survey',
    attempts: '8k attempts',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400',
    task: [1],
    questionTypes: ['Multiple Choice', 'Gap Filling'],
    topics: ['Transport'],
    status: 'not-started',
    updated: '2024-03-15',
    questions: 10,
    duration: 15
  },
  {
    id: 2,
    title: 'Advice on Holidays',
    attempts: '4k attempts',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
    task: [2],
    questionTypes: ['Matching'],
    topics: ['Travel/Tourism'],
    status: 'not-started',
    updated: '2024-03-14',
    questions: 10,
    duration: 15
  },
  {
    id: 3,
    title: 'Housing development',
    attempts: '5k attempts',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400',
    task: [3],
    questionTypes: ['Map and Plan Labeling'],
    topics: ['Social', 'Accommodation'],
    status: 'not-started',
    updated: '2024-03-13',
    questions: 10,
    duration: 15
  },
  {
    id: 4,
    title: 'Traffic Issues',
    attempts: '5k attempts',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400',
    task: [4],
    questionTypes: ['Multiple Choice', 'Pick from a list'],
    topics: ['Transport'],
    status: 'not-started',
    updated: '2024-03-12',
    questions: 10,
    duration: 15
  },
  {
    id: 5,
    title: 'Working as an volunteer',
    attempts: '3k attempts',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400',
    task: [1],
    questionTypes: ['Gap Filling'],
    topics: ['Work/Careers', 'Social'],
    status: 'in-progress',
    updated: '2024-03-11',
    questions: 10,
    duration: 15
  },
  {
    id: 6,
    title: 'Power of Media',
    attempts: '4k attempts',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400',
    task: [2],
    questionTypes: ['Multiple Choice', 'Matching'],
    topics: ['Culture & Arts'],
    status: 'not-started',
    updated: '2024-03-10',
    questions: 10,
    duration: 15
  },
  {
    id: 7,
    title: 'Research on AI',
    attempts: '4k attempts',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
    task: [3],
    questionTypes: ['Pick from a list'],
    topics: ['Science & Technology'],
    status: 'not-started',
    updated: '2024-03-09',
    questions: 10,
    duration: 15
  },
  {
    id: 8,
    title: 'The Art of Conversation',
    attempts: '5k attempts',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400',
    task: [4],
    questionTypes: ['Multiple Choice'],
    topics: ['Social', 'Education'],
    status: 'completed',
    updated: '2024-03-08',
    questions: 10,
    duration: 15
  },
  {
    id: 9,
    title: 'History of Piano',
    attempts: '4k attempts',
    image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400',
    task: [1, 2],
    questionTypes: ['Gap Filling', 'Matching'],
    topics: ['History', 'Culture & Arts'],
    status: 'not-started',
    updated: '2024-03-07',
    questions: 10,
    duration: 15
  },
  {
    id: 10,
    title: 'Hair',
    attempts: '6k attempts',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400',
    task: [3],
    questionTypes: ['Multiple Choice', 'Gap Filling'],
    topics: ['Health & Medicine'],
    status: 'not-started',
    updated: '2024-03-06',
    questions: 10,
    duration: 15
  },
  {
    id: 11,
    title: 'Restaurant Recommendation',
    attempts: '4k attempts',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    task: [1],
    questionTypes: ['Matching'],
    topics: ['Business', 'Shopping'],
    status: 'not-started',
    updated: '2024-03-05',
    questions: 10,
    duration: 15
  },
  {
    id: 12,
    title: 'Challenge for developers',
    attempts: '5k attempts',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400',
    task: [4],
    questionTypes: ['Pick from a list'],
    topics: ['Science & Technology', 'Work/Careers'],
    status: 'not-started',
    updated: '2024-03-04',
    questions: 10,
    duration: 15
  },
  {
    id: 13,
    title: 'Library Tour',
    attempts: '7k attempts',
    image: 'https://images.unsplash.com/photo-1544822688-c5f41d2c1972?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWJyYXJ5JTIwYm9va3MlMjBzdHVkeXxlbnwxfHx8fDE3NjM1OTA0Njl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    task: [1],
    questionTypes: ['Gap Filling', 'Multiple Choice'],
    topics: ['Education'],
    status: 'not-started',
    updated: '2024-03-03',
    questions: 10,
    duration: 15
  },
  {
    id: 14,
    title: 'Job Interview Tips',
    attempts: '6k attempts',
    image: 'https://images.unsplash.com/photo-1698047681469-8e0c19e80a66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb2IlMjBpbnRlcnZpZXclMjBvZmZpY2V8ZW58MXx8fHwxNzYzNTg0MjkyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    task: [2],
    questionTypes: ['Matching', 'Multiple Choice'],
    topics: ['Work/Careers', 'Business'],
    status: 'not-started',
    updated: '2024-03-02',
    questions: 10,
    duration: 15
  },
  {
    id: 15,
    title: 'Climate Change Discussion',
    attempts: '8k attempts',
    image: 'https://images.unsplash.com/photo-1583326112807-a37789739efa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGltYXRlJTIwd2VhdGhlciUyMGVudmlyb25tZW50fGVufDF8fHx8MTc2MzYyNDQ5N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    task: [3],
    questionTypes: ['Pick from a list', 'Multiple Choice'],
    topics: ['Environment'],
    status: 'not-started',
    updated: '2024-03-01',
    questions: 10,
    duration: 15
  },
  {
    id: 16,
    title: 'Restaurant Review',
    attempts: '5k attempts',
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZGluaW5nJTIwZm9vZHxlbnwxfHx8fDE3NjM1MjgwODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    task: [4],
    questionTypes: ['Gap Filling'],
    topics: ['Business', 'Shopping'],
    status: 'in-progress',
    updated: '2024-02-28',
    questions: 10,
    duration: 15
  },
  {
    id: 17,
    title: 'Museum Exhibition',
    attempts: '7k attempts',
    image: 'https://images.unsplash.com/photo-1643820509303-79e98ac7e006?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNldW0lMjBhcnQlMjBnYWxsZXJ5fGVufDF8fHx8MTc2MzUzOTI1N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    task: [1],
    questionTypes: ['Gap Filling', 'Matching'],
    topics: ['Culture & Arts', 'History'],
    status: 'not-started',
    updated: '2024-02-27',
    questions: 10,
    duration: 15
  },
  {
    id: 18,
    title: 'University Campus Tour',
    attempts: '9k attempts',
    image: 'https://images.unsplash.com/photo-1632834380561-d1e05839a33a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwc3R1ZGVudHN8ZW58MXx8fHwxNzYzNTMxMjcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    task: [2],
    questionTypes: ['Map and Plan Labeling'],
    topics: ['Education', 'Accommodation'],
    status: 'not-started',
    updated: '2024-02-26',
    questions: 10,
    duration: 15
  },
  {
    id: 19,
    title: 'Shopping Center Guide',
    attempts: '6k attempts',
    image: 'https://images.unsplash.com/photo-1595879171931-4ca27febc4bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9wcGluZyUyMG1hbGwlMjByZXRhaWx8ZW58MXx8fHwxNzYzNjIyNjQ3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    task: [3],
    questionTypes: ['Map and Plan Labeling', 'Matching'],
    topics: ['Shopping', 'Community'],
    status: 'not-started',
    updated: '2024-02-25',
    questions: 10,
    duration: 15
  },
  {
    id: 20,
    title: 'Wildlife Conservation',
    attempts: '8k attempts',
    image: 'https://images.unsplash.com/photo-1651707265633-6043d4606339?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aWxkbGlmZSUyMGFuaW1hbHMlMjBuYXR1cmV8ZW58MXx8fHwxNzYzNTQ0OTcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    task: [4],
    questionTypes: ['Multiple Choice', 'Pick from a list'],
    topics: ['Environment', 'Science & Technology'],
    status: 'not-started',
    updated: '2024-02-24',
    questions: 10,
    duration: 15
  },
  {
    id: 21,
    title: 'Business Presentation',
    attempts: '7k attempts',
    image: 'https://images.unsplash.com/photo-1709715357520-5e1047a2b691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmclMjB0ZWFtfGVufDF8fHx8MTc2MzUzMjUyOHww&ixlib=rb-4.1.0&q=80&w=1080',
    task: [1],
    questionTypes: ['Gap Filling', 'Multiple Choice'],
    topics: ['Business', 'Work/Careers'],
    status: 'completed',
    updated: '2024-02-23',
    questions: 10,
    duration: 15
  },
  {
    id: 22,
    title: 'Fitness Center Information',
    attempts: '5k attempts',
    image: 'https://images.unsplash.com/photo-1584827386916-b5351d3ba34b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZ3ltJTIwd29ya291dHxlbnwxfHx8fDE3NjM1Mzc5ODF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    task: [2],
    questionTypes: ['Matching', 'Gap Filling'],
    topics: ['Health & Medicine', 'Sports / Leisure'],
    status: 'not-started',
    updated: '2024-02-22',
    questions: 10,
    duration: 15
  },
  {
    id: 23,
    title: 'Architecture History',
    attempts: '6k attempts',
    image: 'https://images.unsplash.com/photo-1624525692139-cb0a7234c234?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmUlMjBidWlsZGluZyUyMGRlc2lnbnxlbnwxfHx8fDE3NjM2MjIwNzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    task: [3],
    questionTypes: ['Pick from a list', 'Multiple Choice'],
    topics: ['History', 'Culture & Arts'],
    status: 'not-started',
    updated: '2024-02-21',
    questions: 10,
    duration: 15
  },
  {
    id: 24,
    title: 'Healthcare Services',
    attempts: '8k attempts',
    image: 'https://images.unsplash.com/photo-1564732005956-20420ebdab60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3NwaXRhbCUyMG1lZGljYWwlMjBoZWFsdGhjYXJlfGVufDF8fHx8MTc2MzYyNDUwMHww&ixlib=rb-4.1.0&q=80&w=1080',
    task: [4],
    questionTypes: ['Multiple Choice', 'Gap Filling'],
    topics: ['Health & Medicine', 'Social'],
    status: 'not-started',
    updated: '2024-02-20',
    questions: 10,
    duration: 15
  }
];

export function ListeningPage({ setCurrentPage, isLoggedIn, onLogout }: ListeningPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<'all' | number>('all');
  const [selectedQuestionType, setSelectedQuestionType] = useState<'all' | string>('all');
  const [selectedTopic, setSelectedTopic] = useState<'all' | string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'attempts' | 'a-z' | 'z-a'>('newest');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [paginationPage, setPaginationPage] = useState(1);
  const itemsPerPage = 12;

  // All possible options
  const allQuestionTypes = ['Multiple Choice', 'Gap Filling', 'Matching', 'Map and Plan Labeling', 'Pick from a list'];
  const allTopics = ['Work/Careers', 'Travel/Tourism', 'Health & Medicine', 'Environment', 'Culture & Arts', 'Science & Technology', 'History', 'Business', 'Shopping', 'Transport', 'Sports / Leisure', 'Community', 'Social', 'Accommodation', 'Education', 'Other'];

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
  const availableTasks = [1, 2, 3, 4].filter(task => {
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

  // Calculate pagination
  const totalPages = Math.ceil(filteredExercises.length / itemsPerPage);
  const startIndex = (paginationPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExercises = filteredExercises.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setPaginationPage(1);
  };

  const toggleStatus = (status: string) => {
    setSelectedStatus(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
    handleFilterChange();
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
              {currentExercises.map((exercise) => (
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
                Showing {startIndex + 1}-{Math.min(endIndex, filteredExercises.length)} of {filteredExercises.length}
              </span>
              <div className="flex items-center gap-[10px]">
                <span className="text-[#202224] text-[14px] opacity-60 font-['Nunito_Sans'] mr-[10px]">
                  Page {paginationPage} of {totalPages}
                </span>
                <div className="flex items-center gap-[10px] bg-[#FAFBFD] border border-[#D5D5D5] rounded-[8px] px-[10px] py-[5px]">
                  <button 
                    onClick={() => setPaginationPage(prev => Math.max(1, prev - 1))}
                    disabled={paginationPage === 1}
                    className={`${paginationPage === 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-60 hover:opacity-100'} transition-opacity`}
                  >
                    <ChevronLeft className="w-[20px] h-[20px]" />
                  </button>
                  <div className="w-[1px] h-[20px] bg-[#979797]" />
                  <button 
                    onClick={() => setPaginationPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={paginationPage === totalPages}
                    className={`${paginationPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'opacity-90 hover:opacity-100'} transition-opacity`}
                  >
                    <ChevronRight className="w-[20px] h-[20px]" />
                  </button>
                </div>
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