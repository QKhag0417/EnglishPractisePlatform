import { Checkbox } from './ui/checkbox';

type TestStatus = 'not-started' | 'in-progress' | 'completed';

interface FilterSidebarProps {
  selectedStatus: TestStatus[];
  setSelectedStatus: (status: TestStatus[]) => void;
  sortBy: 'newest' | 'oldest' | 'attempts' | 'a-z' | 'z-a';
  setSortBy: (sort: 'newest' | 'oldest' | 'attempts' | 'a-z' | 'z-a') => void;
}

export function FilterSidebar({ selectedStatus, setSelectedStatus, sortBy, setSortBy }: FilterSidebarProps) {
  const handleStatusChange = (status: TestStatus) => {
    if (selectedStatus.includes(status)) {
      setSelectedStatus(selectedStatus.filter(s => s !== status));
    } else {
      setSelectedStatus([...selectedStatus, status]);
    }
  };

  return (
    <div className="w-[158px] bg-[rgba(119,203,242,0.12)] border border-[rgba(0,0,0,0.11)] rounded-[10px] p-[12px] h-fit">
      {/* Status Section */}
      <div className="mb-[20px]">
        <h3 className="font-['Inter'] font-semibold text-[13px] text-black mb-[12px]">Status</h3>
        
        <div className="space-y-[10px]">
          <label className="flex items-center gap-[8px] cursor-pointer hover:opacity-80 transition-opacity">
            <Checkbox
              checked={selectedStatus.includes('not-started')}
              onCheckedChange={() => handleStatusChange('not-started')}
              className="border-[#b3b3b3]"
            />
            <span className="font-['Inter'] font-medium text-[12px] text-[rgba(0,0,0,0.47)]">
              Not started
            </span>
          </label>

          <label className="flex items-center gap-[8px] cursor-pointer hover:opacity-80 transition-opacity">
            <Checkbox
              checked={selectedStatus.includes('in-progress')}
              onCheckedChange={() => handleStatusChange('in-progress')}
              className="border-[#b3b3b3]"
            />
            <span className="font-['Inter'] font-medium text-[12px] text-[rgba(0,0,0,0.47)]">
              In progress
            </span>
          </label>

          <label className="flex items-center gap-[8px] cursor-pointer hover:opacity-80 transition-opacity">
            <Checkbox
              checked={selectedStatus.includes('completed')}
              onCheckedChange={() => handleStatusChange('completed')}
              className="border-[#b3b3b3]"
            />
            <span className="font-['Inter'] font-medium text-[12px] text-[rgba(0,0,0,0.47)]">
              Completed
            </span>
          </label>
        </div>
      </div>

      {/* Divider */}
      <div className="h-[1px] bg-black opacity-20 my-[16px]" />

      {/* Sort By Section */}
      <div>
        <h3 className="font-['Inter'] font-semibold text-[13px] text-black mb-[12px]">Sort By</h3>
        
        <div className="space-y-[10px]">
          <label className="flex items-center gap-[8px] cursor-pointer hover:opacity-80 transition-opacity">
            <Checkbox
              checked={sortBy === 'newest'}
              onCheckedChange={() => setSortBy('newest')}
              className="border-[#b3b3b3]"
            />
            <span className="font-['Inter'] font-medium text-[12px] text-[rgba(0,0,0,0.47)]">
              Newest
            </span>
          </label>

          <label className="flex items-center gap-[8px] cursor-pointer hover:opacity-80 transition-opacity">
            <Checkbox
              checked={sortBy === 'oldest'}
              onCheckedChange={() => setSortBy('oldest')}
              className="border-[#b3b3b3]"
            />
            <span className="font-['Inter'] font-medium text-[12px] text-[rgba(0,0,0,0.47)]">
              Oldest
            </span>
          </label>

          <label className="flex items-center gap-[8px] cursor-pointer hover:opacity-80 transition-opacity">
            <Checkbox
              checked={sortBy === 'attempts'}
              onCheckedChange={() => setSortBy('attempts')}
              className="border-[#b3b3b3]"
            />
            <span className="font-['Inter'] font-medium text-[12px] text-[rgba(0,0,0,0.47)]">
              Most attempts
            </span>
          </label>

          <label className="flex items-center gap-[8px] cursor-pointer hover:opacity-80 transition-opacity">
            <Checkbox
              checked={sortBy === 'a-z'}
              onCheckedChange={() => setSortBy('a-z')}
              className="border-[#b3b3b3]"
            />
            <span className="font-['Inter'] font-medium text-[12px] text-[rgba(0,0,0,0.47)]">
              A → Z
            </span>
          </label>

          <label className="flex items-center gap-[8px] cursor-pointer hover:opacity-80 transition-opacity">
            <Checkbox
              checked={sortBy === 'z-a'}
              onCheckedChange={() => setSortBy('z-a')}
              className="border-[#b3b3b3]"
            />
            <span className="font-['Inter'] font-medium text-[12px] text-[rgba(0,0,0,0.47)]">
              Z → A
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
