import { Search } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { SelectV2 } from "../../TutorDashboardPage/components";

interface Props {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filterSkill: string;
  setFilterSkill: (value: string) => void;
}

const skillOptions = [
  { value: "all", label: "All Skills" },
  { value: "Listening", label: "Listening" },
  { value: "Reading", label: "Reading" },
  { value: "Writing", label: "Writing" },
  { value: "Speaking", label: "Speaking" },
];

export function PracticeContentFilter({
  searchQuery,
  setSearchQuery,
  filterSkill,
  setFilterSkill,
}: Props) {
  return (
    <div className="flex gap-[20px] mb-[30px]">
      {/* Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Skill Filter */}
      <div className="w-[200px]">
        <SelectV2
          value={filterSkill}
          onChange={setFilterSkill}
          options={skillOptions}
          placeholder="Skill"
        />
      </div>
    </div>
  );
}
