import { useState } from 'react';
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
  skill: 'Listening' | 'Reading' | 'Writing' | 'Speaking';
  type: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions: number;
  duration: number;
  status: 'Published' | 'Draft';
  updatedOn: string;
  attempts: number;
}

interface PracticeContentManagementPageProps {
  setCurrentPage: (page: Page) => void;
  onLogout?: () => void;
}

export function PracticeContentManagementPage({ setCurrentPage, onLogout }: PracticeContentManagementPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSkill, setFilterSkill] = useState<string>('all');
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  
  // Mock data
  const [contents, setContents] = useState<PracticeContent[]>([
    {
      id: '1',
      title: 'Academic Vocabulary in Context',
      skill: 'Reading',
      type: 'Multiple Choice',
      topic: 'Education',
      difficulty: 'Medium',
      questions: 10,
      duration: 15,
      status: 'Published',
      updatedOn: '15 Mar 2025',
      attempts: 24,
    },
    {
      id: '2',
      title: 'Sentence Completion Practice',
      skill: 'Listening',
      type: 'Fill in the Blank',
      topic: 'Daily Life',
      difficulty: 'Easy',
      questions: 8,
      duration: 10,
      status: 'Published',
      updatedOn: '12 Mar 2025',
      attempts: 10,
    },
    {
      id: '3',
      title: 'Essay Writing Task 2',
      skill: 'Writing',
      type: 'Essay',
      topic: 'Environment',
      difficulty: 'Hard',
      questions: 1,
      duration: 40,
      status: 'Draft',
      updatedOn: '10 Mar 2025',
      attempts: 0,
    },
    {
      id: '4',
      title: 'Part 2: Describe a Place',
      skill: 'Speaking',
      type: 'Monologue',
      topic: 'Travel',
      difficulty: 'Medium',
      questions: 1,
      duration: 3,
      status: 'Published',
      updatedOn: '08 Mar 2025',
      attempts: 3,
    },
  ]);

  const filteredContents = contents.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSkill = filterSkill === 'all' || content.skill === filterSkill;
    return matchesSearch && matchesSkill;
  });

  const handleDelete = (id: string) => {
    setContents(contents.filter(c => c.id !== id));
  };

  // Navigate to Edit Exercise screen based on the content's skill
  // On click: navigate to corresponding Edit [Skill] Exercise screen (no popup)
  const handleEdit = (content: PracticeContent) => {
    if (content.skill === 'Listening') {
      setCurrentPage('edit-listening-content');
    } else if (content.skill === 'Reading') {
      setCurrentPage('edit-reading-content');
    } else if (content.skill === 'Writing') {
      setCurrentPage('edit-writing-content');
    } else if (content.skill === 'Speaking') {
      setCurrentPage('edit-speaking-content');
    }
  };

  const handleAddNew = () => {
    setIsSkillModalOpen(true);
  };

  const handleSkillSelect = (skill: 'Listening' | 'Reading' | 'Writing' | 'Speaking') => {
    // Close the modal
    setIsSkillModalOpen(false);
    
    // Navigate to skill-specific content creation page
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
                placeholder="Search by title or topic..."
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
                  <TableHead>Skill</TableHead>
                  <TableHead>Updated On</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Attempts</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContents.map((content) => (
                  <TableRow key={content.id}>
                    <TableCell className="font-medium">{content.title}</TableCell>
                    <TableCell>{content.skill}</TableCell>
                    <TableCell>{content.updatedOn}</TableCell>
                    <TableCell>{content.questions}</TableCell>
                    <TableCell>{content.duration} min</TableCell>
                    <TableCell>{content.attempts}</TableCell>
                    <TableCell>
                      <Badge variant={content.status === 'Published' ? 'default' : 'outline'}>
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
