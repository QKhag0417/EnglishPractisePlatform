import { Search } from "lucide-react";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

interface Props {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filterSkill: string;
  setFilterSkill: (value: string) => void;
}

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
      <Select value={filterSkill} onValueChange={setFilterSkill}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filter by skill" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Skills</SelectItem>
          <SelectItem value="Listening">Listening</SelectItem>
          <SelectItem value="Reading">Reading</SelectItem>
          <SelectItem value="Writing">Writing</SelectItem>
          <SelectItem value="Speaking">Speaking</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}