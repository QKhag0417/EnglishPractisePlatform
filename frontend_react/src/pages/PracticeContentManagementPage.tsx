import { useEffect, useState } from 'react';
import { Page } from '../App';
import { Footer } from '../components/Footer';
import { NavBarAdmin } from '../components/NavBarAdmin';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { SkillSelectionModal } from '../components/SkillSelectionModal';

interface PracticeContent {
  id: string;
  title: string;
  skill: "LISTENING" | "READING" | "WRITING" | "SPEAKING";
  task: string;
  topicTags: string[];
  difficulty?: "Easy" | "Medium" | "Hard";
  questionCount: number;
  durationMinutes: number;
  status: "PUBLISHED" | "DRAFT";
  updatedOn: string;
  attempts?: number;
}

interface PracticeContentManagementPageProps {
  setCurrentPage: (page: Page, editId?: string) => void;
  onLogout?: () => void;
}
export function PracticeContentManagementPage({ setCurrentPage, onLogout }: PracticeContentManagementPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSkill, setFilterSkill] = useState<string>('all');
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  

const [practiceContents, setPracticeContents] = useState<PracticeContent[]>([]);

useEffect(() => {
  fetchPracticeContents();
}, []);

const fetchPracticeContents = async () => {
  try {
    const res = await fetch("http://localhost:8080/api/practice-content", {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }
    const data = await res.json();
    setPracticeContents(data.data);

  } catch (error) {
    console.error("Failed to fetch practice contents:", error);
    setPracticeContents([]); // chống crash
  }
};

  const filteredContents = practiceContents.filter(content => {
    const keyword = searchQuery.toLowerCase();

    const matchesSearch =
      content.title.toLowerCase().includes(keyword) ||
      content.topicTags.join(", ").toLowerCase().includes(keyword) ||
      content.id.toLowerCase().includes(keyword);

    const matchesSkill =
      filterSkill === "all" || content.skill === filterSkill.toUpperCase();

    return matchesSearch && matchesSkill;
  });

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8080/api/practice-content/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }
      setPracticeContents(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Delete failed!");
    }
  };

  const handleEdit = (content: PracticeContent) => {
    if (content.skill === "LISTENING") {
      setCurrentPage("edit-listening-content", content.id);
    } else if (content.skill === "READING") {
      setCurrentPage("edit-reading-content", content.id);
    } else if (content.skill === "WRITING") {
      setCurrentPage("edit-writing-content", content.id);
    } else if (content.skill === "SPEAKING") {
      setCurrentPage("edit-speaking-content", content.id);
    }
  };

  const handleAddNew = () => {
    setIsSkillModalOpen(true);
  };

  const handleSkillSelect = (skill: 'Listening' | 'Reading' | 'Writing' | 'Speaking') => {
    setIsSkillModalOpen(false);

    if (skill === 'Listening') {
      setCurrentPage('add-listening-content');
    } else if (skill === 'Reading') {
      setCurrentPage('add-reading-content');
    } else if (skill === 'Writing') {
      setCurrentPage('add-writing-content');
    } else if (skill === 'Speaking') {
      setCurrentPage('add-speaking-content');
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <NavBarAdmin setCurrentPage={setCurrentPage} onLogout={onLogout} currentPage="content-management" />

      <div className="flex-1 pt-[100px] pb-[60px] px-[60px]">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between mb-[40px]">
            <h1 className="font-['Inter'] text-[#1977f3] text-[36px]">
              Practice Content Management
            </h1>
            <Button onClick={handleAddNew} className="bg-[#1977f3] hover:bg-[#1567d3]">
              <Plus className="w-5 h-5 mr-2" />
              Add New Content
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-[20px] mb-[30px]">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by ID, title or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
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

          {/* Content Table */}
          <div className="bg-white border rounded-[12px] overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="text-center">Skill</TableHead>
                  <TableHead className="text-center">Updated On</TableHead>
                  <TableHead className="text-center">Questions</TableHead>
                  <TableHead className="text-center">Duration</TableHead>
                  <TableHead className="text-center">Attempts</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContents.map((content) => (
                  <TableRow key={content.id}>
                    <TableCell className="font-medium">{content.title}</TableCell>
                    <TableCell className="text-center">{content.skill}</TableCell>

                    <TableCell className="text-center">
                      {new Date(content.updatedOn).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="text-center">{content.questionCount}</TableCell>

                    <TableCell className="text-center">{content.durationMinutes} min</TableCell>

                    <TableCell className="text-center">{content.attempts ?? 0}</TableCell>

                    <TableCell className="text-center">
                      <Badge variant={content.status === "PUBLISHED" ? "default" : "outline"}>
                        {content.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {/* Edit icon: navigates to Edit [Skill] Exercise screen */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(content)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(content.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Skill Selection Modal */}
      <SkillSelectionModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        onSkillSelect={handleSkillSelect}
      />

      <Footer />
    </div>
  );
}
