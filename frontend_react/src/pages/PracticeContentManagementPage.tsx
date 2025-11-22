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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';

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
}

interface PracticeContentManagementPageProps {
  setCurrentPage: (page: Page) => void;
  onLogout?: () => void;
}

export function PracticeContentManagementPage({ setCurrentPage, onLogout }: PracticeContentManagementPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSkill, setFilterSkill] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<PracticeContent | null>(null);
  
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

  const handleEdit = (content: PracticeContent) => {
    setEditingContent(content);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingContent(null);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    // In a real app, this would save to the backend
    setIsDialogOpen(false);
    setEditingContent(null);
  };

  return (
    <div className="bg-white min-h-screen">
      <NavBarAdmin setCurrentPage={setCurrentPage} onLogout={onLogout} currentPage="content-management" />

      <div className="pt-[100px] pb-[60px] px-[60px]">
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
                  <TableHead>Type</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContents.map((content) => (
                  <TableRow key={content.id}>
                    <TableCell className="font-medium">{content.title}</TableCell>
                    <TableCell>{content.skill}</TableCell>
                    <TableCell>{content.type}</TableCell>
                    <TableCell>{content.topic}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          content.difficulty === 'Easy'
                            ? 'default'
                            : content.difficulty === 'Medium'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {content.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>{content.questions}</TableCell>
                    <TableCell>{content.duration} min</TableCell>
                    <TableCell>
                      <Badge variant={content.status === 'Published' ? 'default' : 'outline'}>
                        {content.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
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

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingContent ? 'Edit Content' : 'Add New Content'}</DialogTitle>
            <DialogDescription>
              {editingContent ? 'Update the practice content details.' : 'Create a new practice content.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" defaultValue={editingContent?.title} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="skill">Skill</Label>
                <Select defaultValue={editingContent?.skill}>
                  <SelectTrigger id="skill">
                    <SelectValue placeholder="Select skill" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Listening">Listening</SelectItem>
                    <SelectItem value="Reading">Reading</SelectItem>
                    <SelectItem value="Writing">Writing</SelectItem>
                    <SelectItem value="Speaking">Speaking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Input id="type" defaultValue={editingContent?.type} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="topic">Topic</Label>
                <Input id="topic" defaultValue={editingContent?.topic} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select defaultValue={editingContent?.difficulty}>
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="questions">Number of Questions</Label>
                <Input id="questions" type="number" defaultValue={editingContent?.questions} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input id="duration" type="number" defaultValue={editingContent?.duration} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select defaultValue={editingContent?.status || 'Draft'}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-[#1977f3] hover:bg-[#1567d3]">
              {editingContent ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}