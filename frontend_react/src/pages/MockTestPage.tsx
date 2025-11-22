import { useState } from 'react';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { NavBarLearner, NavBarGuest } from '../components/NavBar';
import { TestCard } from '../components/TestCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { TestModal } from '../components/TestModal';
import { Footer } from '../components/Footer';
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

const mockTests: Test[] = [
  { 
    id: 1, 
    title: 'Academic Cambridge 16 Test 1', 
    attempts: '8.2k attempts', 
    status: 'completed', 
    image: 'https://images.unsplash.com/photo-1595315343110-9b445a960442?w=400',
    testFormat: 'Academic',
    updated: '06 June 2025',
    taken: 8259
  },
  { 
    id: 2, 
    title: 'General Training Cambridge 15 Test 2', 
    attempts: '6.5k attempts', 
    status: 'not-started', 
    image: 'https://images.unsplash.com/photo-1524591282491-edb48a0fca8f?w=400',
    testFormat: 'General Training',
    updated: '15 May 2025',
    taken: 6543
  },
  { 
    id: 3, 
    title: 'Academic Cambridge 17 Test 3', 
    attempts: '9.1k attempts', 
    status: 'not-started', 
    image: 'https://images.unsplash.com/photo-1700451761308-ec56f93c82be?w=400',
    testFormat: 'Academic',
    updated: '22 April 2025',
    taken: 9123
  },
  { 
    id: 4, 
    title: 'Academic Cambridge 18 Test 4', 
    attempts: '5.3k attempts', 
    status: 'not-started', 
    image: 'https://images.unsplash.com/photo-1759922378123-a1f4f1e39bae?w=400',
    testFormat: 'Academic',
    updated: '10 March 2025',
    taken: 5287
  },
  { 
    id: 5, 
    title: 'General Training Cambridge 14 Test 1', 
    attempts: '7.8k attempts', 
    status: 'in-progress', 
    image: 'https://images.unsplash.com/photo-1758685848208-e108b6af94cc?w=400',
    testFormat: 'General Training',
    updated: '28 February 2025',
    taken: 7834
  },
  { 
    id: 6, 
    title: 'Academic Cambridge 18 Test 2', 
    attempts: '4.9k attempts', 
    status: 'not-started', 
    image: 'https://images.unsplash.com/photo-1565022536102-f7645c84354a?w=400',
    testFormat: 'Academic',
    updated: '18 January 2025',
    taken: 4876
  },
  { 
    id: 7, 
    title: 'Academic Cambridge 15 Test 1', 
    attempts: '11.2k attempts', 
    status: 'completed', 
    image: 'https://images.unsplash.com/photo-1595315343110-9b445a960442?w=400',
    testFormat: 'Academic',
    updated: '05 December 2024',
    taken: 11234
  },
  { 
    id: 8, 
    title: 'General Training Cambridge 16 Test 4', 
    attempts: '3.6k attempts', 
    status: 'not-started', 
    image: 'https://images.unsplash.com/photo-1524591282491-edb48a0fca8f?w=400',
    testFormat: 'General Training',
    updated: '20 November 2024',
    taken: 3621
  },
  { 
    id: 9, 
    title: 'Academic Cambridge 15 Test 3', 
    attempts: '8.7k attempts', 
    status: 'in-progress', 
    image: 'https://images.unsplash.com/photo-1700451761308-ec56f93c82be?w=400',
    testFormat: 'Academic',
    updated: '08 October 2024',
    taken: 8745
  },
  { 
    id: 10, 
    title: 'Academic Cambridge 19 Test 2', 
    attempts: '6.1k attempts', 
    status: 'not-started', 
    image: 'https://images.unsplash.com/photo-1759922378123-a1f4f1e39bae?w=400',
    testFormat: 'Academic',
    updated: '15 September 2024',
    taken: 6089
  },
  { 
    id: 11, 
    title: 'General Training Cambridge 17 Test 1', 
    attempts: '5.5k attempts', 
    status: 'completed', 
    image: 'https://images.unsplash.com/photo-1758685848208-e108b6af94cc?w=400',
    testFormat: 'General Training',
    updated: '30 August 2024',
    taken: 5534
  },
  { 
    id: 12, 
    title: 'Academic Cambridge 19 Test 4', 
    attempts: '2.8k attempts', 
    status: 'not-started', 
    image: 'https://images.unsplash.com/photo-1565022536102-f7645c84354a?w=400',
    testFormat: 'Academic',
    updated: '12 July 2024',
    taken: 2791
  },
];

interface MockTestPageProps {
  setCurrentPage: (page: Page) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export function MockTestPage({ setCurrentPage, isLoggedIn, onLogout }: MockTestPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'general' | 'academic'>('all');
  const [selectedStatus, setSelectedStatus] = useState<TestStatus[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'attempts' | 'a-z' | 'z-a'>('newest');
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);

  const filteredTests = mockTests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(test.status);
    const matchesFormat = selectedFormat === 'all' || 
      (selectedFormat === 'academic' && test.testFormat === 'Academic') ||
      (selectedFormat === 'general' && test.testFormat === 'General Training');
    return matchesSearch && matchesStatus && matchesFormat;
  });

  // Sort tests
  const sortedTests = [...filteredTests].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.updated).getTime() - new Date(a.updated).getTime();
      case 'oldest':
        return new Date(a.updated).getTime() - new Date(b.updated).getTime();
      case 'attempts':
        return b.taken - a.taken;
      case 'a-z':
        return a.title.localeCompare(b.title);
      case 'z-a':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="bg-white min-h-screen">
      {isLoggedIn ? (
        <NavBarLearner setCurrentPage={setCurrentPage} onLogout={onLogout} />
      ) : (
        <NavBarGuest setCurrentPage={setCurrentPage} />
      )}
      
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
                onClick={handleClearSearch}
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

        {/* Filter Feature */}
        <div className="bg-[rgba(119,203,242,0.12)] border border-[rgba(0,0,0,0.11)] rounded-[10px] p-[18px] mb-[20px]">
          <div className="flex items-center gap-[20px]">
            <div className="flex items-center gap-[10px]">
              <span className="font-['Inter'] font-semibold text-[13px]">Test Format</span>
              <button
                onClick={() => setSelectedFormat('all')}
                className={`px-[12px] py-[2px] rounded-[4px] border border-black text-[11px] ${
                  selectedFormat === 'all' ? 'bg-[#fcbf65]' : 'bg-white'
                }`}
              >
                All
              </button>
            </div>
            <button
              onClick={() => setSelectedFormat('general')}
              className={`px-[12px] py-[2px] rounded-[4px] border border-black text-[11px] ${
                selectedFormat === 'general' ? 'bg-[#fcbf65]' : 'bg-white'
              }`}
            >
              General Training Test
            </button>
            <button
              onClick={() => setSelectedFormat('academic')}
              className={`px-[12px] py-[2px] rounded-[4px] border border-black text-[11px] ${
                selectedFormat === 'academic' ? 'bg-[#fcbf65]' : 'bg-white'
              }`}
            >
              Academic Test
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-[30px]">
          {/* Sidebar */}
          <FilterSidebar
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          {/* Test Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-4 gap-x-[20px] gap-y-[30px]">
              {sortedTests.map((test) => (
                <TestCard key={test.id} test={test} setSelectedTest={setSelectedTest} isLoggedIn={isLoggedIn} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-[30px]">
              <span className="text-[#202224] text-[14px] opacity-60 font-['Nunito_Sans']">
                Showing 1-{Math.min(sortedTests.length, 12)} of {sortedTests.length}
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

      {/* Test Modal */}
      {selectedTest && (
        <TestModal test={selectedTest} onClose={() => setSelectedTest(null)} isLoggedIn={isLoggedIn} setCurrentPage={setCurrentPage} />
      )}

      <Footer />
    </div>
  );
}