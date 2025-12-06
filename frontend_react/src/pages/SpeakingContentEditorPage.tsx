import { useState, useRef } from 'react';
import { Page } from '../App';
import { NavBarAdmin } from '../components/NavBarAdmin';
import { Footer } from '../components/Footer';
import {
  Plus,
  Trash2,
  Upload,
  X,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Edit2,
  Image
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';

interface SpeakingContentEditorPageProps {
  setCurrentPage: (page: Page) => void;
  onLogout?: () => void;
  isEditMode?: boolean; // Edit mode: pre-filled with existing data. Add mode: blank state.
}

interface SpeakingQuestion {
  id: string;
  number: number;
  questionText: string;
}

export function SpeakingContentEditorPage({ setCurrentPage, onLogout, isEditMode = false }: SpeakingContentEditorPageProps) {
  // Note: Used when clicking edit from Practice Content Management. Same layout as Add, but pre-filled with existing exercise data.
  const [status, setStatus] = useState<'Draft' | 'Published'>('Draft');
  const [thumbnailFile, setThumbnailFile] = useState<string | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('1');
  const [questions, setQuestions] = useState<SpeakingQuestion[]>([
    { id: '1', number: 1, questionText: 'Can you describe a memorable trip you took?' },
    { id: '2', number: 2, questionText: 'What did you enjoy most about it?' },
    { id: '3', number: 3, questionText: 'How has traveling changed your perspective?' },
  ]);

  // File upload ref
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // File upload handlers
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a .jpg or .png file');
        return;
      }
      // Validate file size (25 MB = 25 * 1024 * 1024 bytes)
      if (file.size > 25 * 1024 * 1024) {
        alert('File size must be less than 25 MB');
        return;
      }
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a .jpg or .png file');
        return;
      }
      // Validate file size (25 MB = 25 * 1024 * 1024 bytes)
      if (file.size > 25 * 1024 * 1024) {
        alert('File size must be less than 25 MB');
        return;
      }
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const addNewQuestion = () => {
    const newQuestion: SpeakingQuestion = {
      id: Date.now().toString(),
      number: questions.length + 1,
      questionText: ''
    };
    setQuestions([...questions, newQuestion]);
  };

  const deleteQuestion = (id: string) => {
    if (questions.length > 1) {
      const filteredQuestions = questions.filter(q => q.id !== id);
      // Renumber all questions sequentially from 1
      const renumberedQuestions = filteredQuestions.map((q, index) => ({
        ...q,
        number: index + 1
      }));
      setQuestions(renumberedQuestions);
      if (selectedQuestionId === id) {
        setSelectedQuestionId(renumberedQuestions[0].id);
      }
    }
  };

  const updateQuestionText = (id: string, text: string) => {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, questionText: text } : q
    ));
  };

  const handleSaveExit = () => {
    // Save logic here
    setCurrentPage('content-management');
  };

  const handleCancel = () => {
    // Discard unsaved changes and navigate back to Practice Content Management
    setCurrentPage('content-management');
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <NavBarAdmin setCurrentPage={setCurrentPage} onLogout={onLogout} currentPage="content-management" />

      {/* Header Section */}
      <div className="pt-[80px] pb-[20px] px-[60px] bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto">
          {/* Title and Actions */}
          <div className="flex items-center justify-between">
            <h1 className="font-['Inter'] text-[32px] text-gray-900">
              {isEditMode ? 'Edit Speaking Exercise' : 'Add Speaking Exercise'}
            </h1>

            <div className="flex items-center gap-[12px]">
              {/* Status Pills */}
              <div className="flex gap-[8px] bg-gray-100 rounded-[8px] p-[4px]">
                <button
                  onClick={() => setStatus('Draft')}
                  className={`px-[16px] py-[6px] rounded-[6px] font-['Inter'] font-medium text-[14px] transition-colors ${
                    status === 'Draft'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Draft
                </button>
                <button
                  onClick={() => setStatus('Published')}
                  className={`px-[16px] py-[6px] rounded-[6px] font-['Inter'] font-medium text-[14px] transition-colors ${
                    status === 'Published'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Published
                </button>
              </div>

              {/* Action Buttons */}
              <Button
                onClick={handleCancel}
                variant="outline"
                className="font-['Inter'] text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveExit}
                className="bg-[#1977f3] hover:bg-[#1567d3] font-['Inter']"
              >
                Save & Exit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pt-[40px] pb-[60px] px-[60px]">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-[1fr_400px] gap-[32px]">
            {/* Left Column - Instructions & Questions */}
            <div className="space-y-[24px]">
              {/* Instructions & Note Layout Block */}
              <div className="bg-white rounded-[12px] p-[32px] shadow-sm border border-gray-200">
                <Label className="font-['Inter'] font-semibold text-[16px] text-gray-900 mb-[16px] block">
                  Instructions & Note Layout
                </Label>

                {/* Rich Text Editor Toolbar */}
                <div className="border border-gray-300 rounded-t-[8px] bg-gray-50 p-[8px] flex items-center justify-between gap-[4px]">
                  <div className="flex items-center gap-[4px] flex-wrap">
                    <Select defaultValue="inter">
                      <SelectTrigger className="w-[140px] h-[32px] bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inter">Inter</SelectItem>
                        <SelectItem value="arial">Arial</SelectItem>
                        <SelectItem value="times">Times New Roman</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select defaultValue="14">
                      <SelectTrigger className="w-[80px] h-[32px] bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12</SelectItem>
                        <SelectItem value="14">14</SelectItem>
                        <SelectItem value="16">16</SelectItem>
                        <SelectItem value="18">18</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="w-[1px] h-[24px] bg-gray-300 mx-[4px]" />

                    <button className="p-[6px] hover:bg-gray-200 rounded-[4px] transition-colors">
                      <Bold className="w-[16px] h-[16px] text-gray-700" />
                    </button>
                    <button className="p-[6px] hover:bg-gray-200 rounded-[4px] transition-colors">
                      <Italic className="w-[16px] h-[16px] text-gray-700" />
                    </button>
                    <button className="p-[6px] hover:bg-gray-200 rounded-[4px] transition-colors">
                      <Underline className="w-[16px] h-[16px] text-gray-700" />
                    </button>

                    <div className="w-[1px] h-[24px] bg-gray-300 mx-[4px]" />

                    <button className="p-[6px] hover:bg-gray-200 rounded-[4px] transition-colors">
                      <AlignLeft className="w-[16px] h-[16px] text-gray-700" />
                    </button>
                    <button className="p-[6px] hover:bg-gray-200 rounded-[4px] transition-colors">
                      <AlignCenter className="w-[16px] h-[16px] text-gray-700" />
                    </button>
                    <button className="p-[6px] hover:bg-gray-200 rounded-[4px] transition-colors">
                      <AlignRight className="w-[16px] h-[16px] text-gray-700" />
                    </button>

                    <div className="w-[1px] h-[24px] bg-gray-300 mx-[4px]" />

                    <button className="p-[6px] hover:bg-gray-200 rounded-[4px] transition-colors">
                      <List className="w-[16px] h-[16px] text-gray-700" />
                    </button>
                    <button className="p-[6px] hover:bg-gray-200 rounded-[4px] transition-colors">
                      <ListOrdered className="w-[16px] h-[16px] text-gray-700" />
                    </button>
                  </div>

                  {/* Insert Image Button */}
                  <button className="p-[6px] hover:bg-gray-200 rounded-[4px] transition-colors">
                    <Image className="w-[16px] h-[16px] text-gray-700" />
                  </button>
                </div>

                {/* Editor Area */}
                <Textarea
                  placeholder="Type the speaking task description and notes here (e.g., Part 2 cue card, examiner script, timing notes…)."
                  className="min-h-[200px] border-gray-300 border-t-0 rounded-t-none rounded-b-[8px] resize-none font-['Inter']"
                />
              </div>

              {/* Questions List - Simplified for Speaking */}
              <div className="bg-white rounded-[12px] p-[32px] shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-[20px]">
                  <div className="flex items-center gap-[12px]">
                    <h3 className="font-['Inter'] font-semibold text-[18px] text-gray-900">
                      Questions
                    </h3>
                    <Badge variant="secondary" className="font-['Inter']">
                      {questions.length} {questions.length === 1 ? 'question' : 'questions'}
                    </Badge>
                  </div>
                  <Button
                    onClick={addNewQuestion}
                    className="bg-[#1977f3] hover:bg-[#1567d3]"
                    size="sm"
                  >
                    <Plus className="w-[16px] h-[16px] mr-[6px]" />
                    Add Question
                  </Button>
                </div>

                {/* Questions Table */}
                <div className="border border-gray-200 rounded-[8px] overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-[80px_1fr_100px] gap-[16px] bg-gray-50 px-[20px] py-[12px] border-b border-gray-200">
                    <span className="font-['Inter'] font-medium text-[12px] text-gray-600 uppercase">#</span>
                    <span className="font-['Inter'] font-medium text-[12px] text-gray-600 uppercase">Question Text</span>
                    <span className="font-['Inter'] font-medium text-[12px] text-gray-600 uppercase text-center">Actions</span>
                  </div>

                  {/* Table Body */}
                  <div>
                    {questions.map((question) => (
                      <div
                        key={question.id}
                        className={`grid grid-cols-[80px_1fr_100px] gap-[16px] px-[20px] py-[16px] border-b border-gray-200 last:border-b-0 transition-colors ${
                          selectedQuestionId === question.id
                            ? 'bg-blue-50'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="font-['Inter'] text-[14px] text-gray-900 pt-[8px]">
                          Q{question.number}
                        </span>
                        <Input
                          value={question.questionText}
                          onChange={(e) => updateQuestionText(question.id, e.target.value)}
                          placeholder={`Enter question ${question.number}...`}
                          className="font-['Inter'] text-[14px]"
                        />
                        <div className="flex items-center justify-center gap-[8px]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedQuestionId(question.id);
                            }}
                            className="p-[6px] hover:bg-white rounded-[4px] transition-colors"
                          >
                            <Edit2 className="w-[16px] h-[16px] text-[#1977f3]" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteQuestion(question.id);
                            }}
                            disabled={questions.length <= 1}
                            className="p-[6px] hover:bg-white rounded-[4px] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-[16px] h-[16px] text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Media & Metadata */}
            <div className="space-y-[24px]">
              {/* Upload Thumbnail */}
              <div className="bg-white rounded-[12px] p-[24px] shadow-sm border border-gray-200">
                <Label className="font-['Inter'] font-semibold text-[16px] text-gray-900 mb-[16px] block">
                  Upload Thumbnail
                </Label>

                {!thumbnailFile ? (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-[8px] p-[32px] text-center hover:border-[#1977f3] hover:bg-blue-50/30 transition-colors cursor-pointer"
                    onDrop={handleThumbnailDrop}
                    onDragOver={handleDragOver}
                  >
                    <Upload className="w-[48px] h-[48px] text-gray-400 mx-auto mb-[12px]" />
                    <p className="font-['Inter'] text-[14px] text-gray-700 mb-[4px]">
                      Drop file or browse
                    </p>
                    <p className="font-['Inter'] text-[12px] text-gray-500">
                      Formats: .jpg, .png<br />Max file size: 25 MB
                    </p>
                    <input
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      className="hidden"
                      ref={thumbnailInputRef}
                      onChange={handleThumbnailChange}
                    />
                    <Button
                      onClick={() => thumbnailInputRef.current?.click()}
                      className="mt-[16px] bg-[#1977f3] hover:bg-[#1567d3] font-['Inter']"
                    >
                      Browse
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={thumbnailFile}
                      alt="Thumbnail preview"
                      className="w-full h-[180px] object-cover rounded-[8px]"
                    />
                    <button
                      onClick={() => setThumbnailFile(null)}
                      className="absolute top-[8px] right-[8px] bg-white rounded-full p-[6px] shadow-md hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-[16px] h-[16px] text-gray-700" />
                    </button>
                  </div>
                )}
              </div>

              {/* Exercise Info */}
              <div className="bg-white rounded-[12px] p-[24px] shadow-sm border border-gray-200">
                <Label className="font-['Inter'] font-semibold text-[16px] text-gray-900 mb-[20px] block">
                  Exercise Info
                </Label>

                <div className="space-y-[16px]">
                  {/* Title */}
                  <div>
                    <Label className="font-['Inter'] text-[14px] text-gray-700 mb-[8px] block">
                      Title
                    </Label>
                    <Input
                      placeholder="Enter exercise title…"
                      className="px-[12px] py-[10px] bg-gray-100 border border-gray-200 rounded-[8px] font-['Inter'] text-[14px] text-gray-900 h-auto"
                    />
                  </div>

                  {/* Task */}
                  <div>
                    <Label className="font-['Inter'] text-[14px] text-gray-700 mb-[8px] block">
                      Task
                    </Label>
                    <Select defaultValue="1">
                      <SelectTrigger className="px-[12px] py-[10px] bg-gray-100 border border-gray-200 rounded-[8px] font-['Inter'] text-[14px] text-gray-900 h-auto">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Part 1</SelectItem>
                        <SelectItem value="2">Part 2</SelectItem>
                        <SelectItem value="3">Part 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Updated On */}
                  <div>
                    <Label className="font-['Inter'] text-[14px] text-gray-700 mb-[8px] block">
                      Updated On
                    </Label>
                    <Input
                      type="date"
                      value={new Date().toISOString().split('T')[0]}
                      readOnly
                      className="px-[12px] py-[10px] bg-gray-100 border border-gray-200 rounded-[8px] font-['Inter'] text-[14px] text-gray-900 h-auto"
                    />
                  </div>

                  {/* Questions - Auto-counted */}
                  <div>
                    <Label className="font-['Inter'] text-[14px] text-gray-700 mb-[8px] block">
                      Questions
                    </Label>
                    <div className="px-[12px] py-[10px] bg-gray-100 border border-gray-200 rounded-[8px] font-['Inter'] text-[14px] text-gray-900">
                      {questions.length}
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <Label className="font-['Inter'] text-[14px] text-gray-700 mb-[8px] block">
                      Duration (minutes)
                    </Label>
                    <Input
                      type="number"
                      defaultValue="4"
                      min="1"
                      className="px-[12px] py-[10px] bg-gray-100 border border-gray-200 rounded-[8px] font-['Inter'] text-[14px] text-gray-900 h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}