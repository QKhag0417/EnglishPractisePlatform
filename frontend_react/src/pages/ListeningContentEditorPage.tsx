import { useState, useEffect, useRef } from 'react';
import { Page } from '../App';
import { NavBarAdmin } from '../components/NavBarAdmin';
import { Footer } from '../components/Footer';
import { 
  ChevronRight, 
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
  Play,
  Pause,
  Edit2,
  Check,
  AlertCircle,
  Image
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { ChipInput } from '../components/ChipInput';

interface ListeningContentEditorPageProps {
  setCurrentPage: (page: Page) => void;
  onLogout?: () => void;
  isEditMode?: boolean; // Edit mode: pre-filled with existing data. Add mode: blank state.
}

interface Question {
  id: string;
  number: number;
  type: 'Short Text' | 'MCQ - Single' | 'MCQ - Multiple' | 'Written Response';
  points: number;
  correctAnswer: string;
  questionType: QuestionType;
  correctAnswers: string[];
  ignoreCase: boolean;
  ignorePunctuation: boolean;
  options: Option[];
  shuffleOptions: boolean;
  explanation: string;
}

interface Option {
  id: string;
  text: string;
  feedback: string;
  isCorrect: boolean;
}

type QuestionType = 'mcq-single' | 'mcq-multiple' | 'short-text' | 'written-response';

export function ListeningContentEditorPage({ setCurrentPage, onLogout, isEditMode = false }: ListeningContentEditorPageProps) {
  // Note: Used when clicking edit from Practice Content Management. Same layout as Add, but pre-filled with existing exercise data.
  const [status, setStatus] = useState<'Draft' | 'Published'>('Draft');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('1');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveState, setSaveState] = useState<'saved' | 'unsaved' | 'editing'>('saved');
  const [questions, setQuestions] = useState<Question[]>([
    { 
      id: '1', 
      number: 1, 
      type: 'MCQ - Single', 
      points: 1, 
      correctAnswer: 'Amen', 
      questionType: 'mcq-single', 
      correctAnswers: [], 
      ignoreCase: true, 
      ignorePunctuation: true, 
      options: [
        { id: '1', text: 'Amen', feedback: '', isCorrect: true },
        { id: '2', text: 'Option B', feedback: '', isCorrect: false },
        { id: '3', text: 'Option C', feedback: '', isCorrect: false },
        { id: '4', text: 'Option D', feedback: '', isCorrect: false },
      ], 
      shuffleOptions: false, 
      explanation: '' 
    },
    { 
      id: '2', 
      number: 2, 
      type: 'MCQ - Multiple', 
      points: 1, 
      correctAnswer: 'Amen, Big', 
      questionType: 'mcq-multiple', 
      correctAnswers: [], 
      ignoreCase: true, 
      ignorePunctuation: true, 
      options: [
        { id: '1', text: 'Amen', feedback: '', isCorrect: true },
        { id: '2', text: 'Big', feedback: '', isCorrect: true },
        { id: '3', text: 'Option C', feedback: '', isCorrect: false },
        { id: '4', text: 'Option D', feedback: '', isCorrect: false },
      ], 
      shuffleOptions: false, 
      explanation: '' 
    },
    { id: '3', number: 3, type: 'Short Text', points: 1, correctAnswer: 'Docklands', questionType: 'short-text', correctAnswers: ['Docklands', 'Eastside Docklands'], ignoreCase: true, ignorePunctuation: true, options: [], shuffleOptions: false, explanation: '' },
    { id: '4', number: 4, type: 'Short Text', points: 1, correctAnswer: 'warehouse', questionType: 'short-text', correctAnswers: ['warehouse'], ignoreCase: true, ignorePunctuation: true, options: [], shuffleOptions: false, explanation: '' },
    { id: '5', number: 5, type: 'Short Text', points: 1, correctAnswer: 'transport', questionType: 'short-text', correctAnswers: ['transport'], ignoreCase: true, ignorePunctuation: true, options: [], shuffleOptions: false, explanation: '' },
    { id: '6', number: 6, type: 'Short Text', points: 1, correctAnswer: 'museum', questionType: 'short-text', correctAnswers: ['museum'], ignoreCase: true, ignorePunctuation: true, options: [], shuffleOptions: false, explanation: '' },
    { id: '7', number: 7, type: 'MCQ - Single', points: 1, correctAnswer: 'Option C', questionType: 'mcq-single', correctAnswers: [], ignoreCase: true, ignorePunctuation: true, options: [
      { id: '1', text: '', feedback: '', isCorrect: false },
      { id: '2', text: '', feedback: '', isCorrect: false },
      { id: '3', text: '', feedback: '', isCorrect: false },
      { id: '4', text: '', feedback: '', isCorrect: false },
    ], shuffleOptions: false, explanation: '' },
    { id: '8', number: 8, type: 'Short Text', points: 1, correctAnswer: 'community', questionType: 'short-text', correctAnswers: ['community'], ignoreCase: true, ignorePunctuation: true, options: [], shuffleOptions: false, explanation: '' },
    { id: '9', number: 9, type: 'Short Text', points: 1, correctAnswer: 'Friday', questionType: 'short-text', correctAnswers: ['Friday'], ignoreCase: true, ignorePunctuation: true, options: [], shuffleOptions: false, explanation: '' },
    { id: '10', number: 10, type: 'Short Text', points: 1, correctAnswer: 'website', questionType: 'short-text', correctAnswers: ['website'], ignoreCase: true, ignorePunctuation: true, options: [], shuffleOptions: false, explanation: '' },
  ]);
  
  const [questionType, setQuestionType] = useState<QuestionType>('short-text');
  const [correctAnswers, setCorrectAnswers] = useState<string[]>(['Docklands', 'Eastside Docklands']);
  const [ignoreCase, setIgnoreCase] = useState(true);
  const [ignorePunctuation, setIgnorePunctuation] = useState(true);
  const [newAnswerInput, setNewAnswerInput] = useState('');
  const [currentScore, setCurrentScore] = useState('1');
  const [currentExplanation, setCurrentExplanation] = useState('');
  
  const [options, setOptions] = useState<Option[]>([
    { id: '1', text: '', feedback: '', isCorrect: false },
    { id: '2', text: '', feedback: '', isCorrect: false },
    { id: '3', text: '', feedback: '', isCorrect: false },
    { id: '4', text: '', feedback: '', isCorrect: false },
  ]);
  const [shuffleOptions, setShuffleOptions] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [questionTypeTags, setQuestionTypeTags] = useState<string[]>([]);
  const [topicTags, setTopicTags] = useState<string[]>([]);
  


  const selectedQuestion = questions.find(q => q.id === selectedQuestionId);

  // Load selected question's data into the form
  useEffect(() => {
    if (selectedQuestion) {
      setQuestionType(selectedQuestion.questionType);
      setCorrectAnswers(selectedQuestion.correctAnswers);
      setIgnoreCase(selectedQuestion.ignoreCase);
      setIgnorePunctuation(selectedQuestion.ignorePunctuation);
      setOptions(selectedQuestion.options.length > 0 ? selectedQuestion.options : [
        { id: '1', text: '', feedback: '', isCorrect: false },
        { id: '2', text: '', feedback: '', isCorrect: false },
        { id: '3', text: '', feedback: '', isCorrect: false },
        { id: '4', text: '', feedback: '', isCorrect: false },
      ]);
      setShuffleOptions(selectedQuestion.shuffleOptions);
      setCurrentExplanation(selectedQuestion.explanation);
      setCurrentScore(selectedQuestion.points.toString());
      setSaveState('saved');
      setHasUnsavedChanges(false);
    }
  }, [selectedQuestionId, selectedQuestion]);

  const addOption = () => {
    const newOption: Option = {
      id: Date.now().toString(),
      text: '',
      feedback: '',
      isCorrect: false
    };
    setOptions([...options, newOption]);
  };

  const deleteOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter(opt => opt.id !== id));
    }
  };

  const updateOption = (id: string, field: keyof Option, value: string | boolean) => {
    setOptions(options.map(opt => 
      opt.id === id ? { ...opt, [field]: value } : opt
    ));
    markAsUnsaved();
  };

  const setCorrectOption = (id: string) => {
    setOptions(options.map(opt => ({
      ...opt,
      isCorrect: opt.id === id
    })));
    markAsUnsaved();
  };

  const addNewQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      number: questions.length + 1,
      type: 'Short Text',
      points: 1,
      correctAnswer: '',
      questionType: 'short-text',
      correctAnswers: [],
      ignoreCase: true,
      ignorePunctuation: true,
      options: [],
      shuffleOptions: false,
      explanation: ''
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

  const addCorrectAnswer = () => {
    if (newAnswerInput.trim()) {
      setCorrectAnswers([...correctAnswers, newAnswerInput.trim()]);
      setNewAnswerInput('');
      markAsUnsaved();
    }
  };

  const removeCorrectAnswer = (index: number) => {
    setCorrectAnswers(correctAnswers.filter((_, i) => i !== index));
    markAsUnsaved();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCorrectAnswer();
    }
  };

  const handleSaveQuestion = () => {
    // Update the selected question with current form values
    setQuestions(questions.map(q => 
      q.id === selectedQuestionId 
        ? {
            ...q,
            type: questionType === 'short-text' ? 'Short Text' :
                  questionType === 'mcq-single' ? 'MCQ - Single' :
                  questionType === 'mcq-multiple' ? 'MCQ - Multiple' :
                  'Written Response',
            points: parseInt(currentScore) || 1,
            correctAnswer: questionType === 'short-text' 
              ? correctAnswers.join(', ') 
              : questionType === 'mcq-single'
              ? options.find(o => o.isCorrect)?.text || ''
              : questionType === 'mcq-multiple'
              ? options.filter(o => o.isCorrect).map(o => o.text).join(', ')
              : 'Manual marking required',
            questionType: questionType,
            correctAnswers: correctAnswers,
            ignoreCase: ignoreCase,
            ignorePunctuation: ignorePunctuation,
            options: options,
            shuffleOptions: shuffleOptions,
            explanation: currentExplanation
          }
        : q
    ));
    setSaveState('saved');
    setHasUnsavedChanges(false);
  };

  const handleCancelQuestion = () => {
    // Reset form to saved values
    if (selectedQuestion) {
      // Reset question type
      if (selectedQuestion.type === 'Short Text') {
        setQuestionType('short-text');
        setCorrectAnswers(selectedQuestion.correctAnswer.split(', '));
      } else if (selectedQuestion.type === 'MCQ - Single') {
        setQuestionType('mcq-single');
      } else if (selectedQuestion.type === 'MCQ - Multiple') {
        setQuestionType('mcq-multiple');
      } else {
        setQuestionType('written-response');
      }
      setCurrentScore(selectedQuestion.points.toString());
    }
    setSaveState('saved');
    setHasUnsavedChanges(false);
  };

  const markAsUnsaved = () => {
    if (saveState === 'saved') {
      setSaveState('unsaved');
      setHasUnsavedChanges(true);
    }
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
    <div className="bg-gray-50 min-h-screen">
      <NavBarAdmin setCurrentPage={setCurrentPage} onLogout={onLogout} currentPage="content-management" />

      {/* Header Section */}
      <div className="pt-[80px] pb-[20px] px-[60px] bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto">
          {/* Title and Actions */}
          <div className="flex items-center justify-between">
            <h1 className="font-['Inter'] text-[32px] text-gray-900">
              {isEditMode ? 'Edit Listening Exercise' : 'Add Listening Exercise'}
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
      <div className="pt-[40px] pb-[60px] px-[60px]">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-[1fr_400px] gap-[32px]">
            {/* Left Column - Question & Answers */}
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
                  placeholder="Type the shared instructions and notes layout here (e.g., Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer. Use (1), (2)… to mark blanks)."
                  className="min-h-[200px] border-gray-300 border-t-0 rounded-t-none rounded-b-[8px] resize-none font-['Inter']"
                />
              </div>

              {/* Questions List */}
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
                  <div className="grid grid-cols-[80px_140px_1fr_100px] gap-[16px] bg-gray-50 px-[20px] py-[12px] border-b border-gray-200">
                    <span className="font-['Inter'] font-medium text-[12px] text-gray-600 uppercase">#</span>
                    <span className="font-['Inter'] font-medium text-[12px] text-gray-600 uppercase">Type</span>
                    <span className="font-['Inter'] font-medium text-[12px] text-gray-600 uppercase">Correct Answer</span>
                    <span className="font-['Inter'] font-medium text-[12px] text-gray-600 uppercase text-center">Actions</span>
                  </div>

                  {/* Table Body */}
                  <div>
                    {questions.map((question) => (
                      <div
                        key={question.id}
                        onClick={() => setSelectedQuestionId(question.id)}
                        className={`grid grid-cols-[80px_140px_1fr_100px] gap-[16px] px-[20px] py-[16px] border-b border-gray-200 last:border-b-0 cursor-pointer transition-colors ${
                          selectedQuestionId === question.id
                            ? 'bg-blue-50 border-l-4 border-l-[#1977f3]'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="font-['Inter'] text-[14px] text-gray-900">
                          Q{question.number}
                        </span>
                        <span className="font-['Inter'] text-[14px] text-gray-700">
                          {question.type}
                        </span>
                        <span className="font-['Inter'] text-[14px] text-gray-700 truncate">
                          {question.correctAnswer || '(not set)'}
                        </span>
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

              {/* Answer & Scoring Block */}
              <div className="bg-white rounded-[12px] p-[32px] shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-[20px]">
                  <h3 className="font-['Inter'] font-semibold text-[18px] text-gray-900">
                    Answer & Scoring
                  </h3>
                  {selectedQuestion && (
                    <div className="flex items-center gap-[8px]">
                      <span className="font-['Inter'] text-[14px] text-gray-600">
                        Editing: <span className="text-[#1977f3] font-medium">Question {selectedQuestion.number}</span>
                      </span>
                      <span className="text-gray-400">·</span>
                      {saveState === 'saved' ? (
                        <span className="flex items-center gap-[6px] font-['Inter'] text-[14px] text-green-600">
                          <Check className="w-[14px] h-[14px]" />
                          Saved
                        </span>
                      ) : (
                        <span className="flex items-center gap-[6px] font-['Inter'] text-[14px] text-orange-600">
                          <AlertCircle className="w-[14px] h-[14px]" />
                          Unsaved changes
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Question Type Dropdown */}
                <div className="mb-[24px]">
                  <Label className="font-['Inter'] font-medium text-[14px] text-gray-700 mb-[8px] block">
                    Question type
                  </Label>
                  <Select value={questionType} onValueChange={(value: QuestionType) => { setQuestionType(value); markAsUnsaved(); }}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mcq-single">Multiple Choice – Single Correct</SelectItem>
                      <SelectItem value="mcq-multiple">Multiple Choice – Multiple Correct</SelectItem>
                      <SelectItem value="short-text">Short Text (auto-checked)</SelectItem>
                      <SelectItem value="written-response">Written Response (manual marking)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* MCQ Options */}
                {(questionType === 'mcq-single' || questionType === 'mcq-multiple') && (
                  <div className="space-y-[16px]">
                    {/* Options Header */}
                    <div className="grid grid-cols-[60px_1fr_40px] gap-[12px] pb-[8px] border-b border-gray-200">
                      <span className="font-['Inter'] font-medium text-[12px] text-gray-500 uppercase">
                        Correct
                      </span>
                      <span className="font-['Inter'] font-medium text-[12px] text-gray-500 uppercase">
                        Option Text
                      </span>
                      <span></span>
                    </div>

                    {/* Options List */}
                    {options.map((option, index) => (
                      <div key={option.id} className="grid grid-cols-[60px_1fr_40px] gap-[12px] items-start">
                        {/* Radio/Checkbox */}
                        <div className="flex items-center justify-center pt-[10px]">
                          {questionType === 'mcq-single' ? (
                            <input
                              type="radio"
                              name="correct-option"
                              checked={option.isCorrect}
                              onChange={() => setCorrectOption(option.id)}
                              className="w-[18px] h-[18px] cursor-pointer"
                            />
                          ) : (
                            <input
                              type="checkbox"
                              checked={option.isCorrect}
                              onChange={(e) => updateOption(option.id, 'isCorrect', e.target.checked)}
                              className="w-[18px] h-[18px] cursor-pointer"
                            />
                          )}
                        </div>

                        {/* Option Text */}
                        <Input
                          placeholder={`Option ${index + 1}`}
                          value={option.text}
                          onChange={(e) => updateOption(option.id, 'text', e.target.value)}
                        />

                        {/* Delete Button */}
                        <button
                          onClick={() => deleteOption(option.id)}
                          disabled={options.length <= 2}
                          className="p-[8px] hover:bg-gray-100 rounded-[6px] transition-colors disabled:opacity-30 disabled:cursor-not-allowed mt-[2px]"
                        >
                          <Trash2 className="w-[16px] h-[16px] text-red-500" />
                        </button>
                      </div>
                    ))}

                    {/* Add Option Button */}
                    <Button
                      variant="outline"
                      onClick={addOption}
                      className="w-full mt-[8px]"
                    >
                      <Plus className="w-[16px] h-[16px] mr-[8px]" />
                      Add option
                    </Button>

                    {/* Shuffle Options Toggle */}
                    <div className="flex items-center gap-[12px] pt-[8px]">
                      <input
                        type="checkbox"
                        id="shuffle"
                        checked={shuffleOptions}
                        onChange={(e) => { setShuffleOptions(e.target.checked); markAsUnsaved(); }}
                        className="w-[18px] h-[18px] cursor-pointer"
                      />
                      <label
                        htmlFor="shuffle"
                        className="font-['Inter'] text-[14px] text-gray-700 cursor-pointer"
                      >
                        Shuffle options
                      </label>
                    </div>
                  </div>
                )}

                {/* Short Text Type */}
                {questionType === 'short-text' && (
                  <div className="space-y-[16px]">
                    <div>
                      <Label className="font-['Inter'] font-medium text-[14px] text-gray-700 mb-[8px] block">
                        Correct answers
                      </Label>
                      
                      {/* Tags Display */}
                      <div className="flex flex-wrap gap-[8px] mb-[12px]">
                        {correctAnswers.map((answer, index) => (
                          <div
                            key={index}
                            className="inline-flex items-center gap-[6px] bg-blue-100 text-blue-800 px-[12px] py-[6px] rounded-[6px] font-['Inter'] text-[14px]"
                          >
                            <span>{answer}</span>
                            <button
                              onClick={() => removeCorrectAnswer(index)}
                              className="hover:bg-blue-200 rounded-full p-[2px] transition-colors"
                            >
                              <X className="w-[14px] h-[14px]" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Input for new answer */}
                      <div className="flex gap-[8px]">
                        <Input
                          placeholder="Type an answer and press Enter"
                          value={newAnswerInput}
                          onChange={(e) => setNewAnswerInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                        />
                        <Button
                          onClick={addCorrectAnswer}
                          disabled={!newAnswerInput.trim()}
                          className="bg-[#1977f3] hover:bg-[#1567d3]"
                        >
                          Add
                        </Button>
                      </div>
                      <p className="font-['Inter'] text-[12px] text-gray-500 mt-[8px]">
                        Add multiple accepted variations (e.g., "Docklands", "Eastside Docklands")
                      </p>
                    </div>

                    {/* Validation Options */}
                    <div className="space-y-[12px] pt-[16px] border-t border-gray-200">
                      <div className="flex items-center gap-[12px]">
                        <input
                          type="checkbox"
                          id="ignore-case"
                          checked={ignoreCase}
                          onChange={(e) => { setIgnoreCase(e.target.checked); markAsUnsaved(); }}
                          className="w-[18px] h-[18px] cursor-pointer"
                        />
                        <label
                          htmlFor="ignore-case"
                          className="font-['Inter'] text-[14px] text-gray-700 cursor-pointer"
                        >
                          Ignore case
                        </label>
                      </div>
                      <div className="flex items-center gap-[12px]">
                        <input
                          type="checkbox"
                          id="ignore-punctuation"
                          checked={ignorePunctuation}
                          onChange={(e) => { setIgnorePunctuation(e.target.checked); markAsUnsaved(); }}
                          className="w-[18px] h-[18px] cursor-pointer"
                        />
                        <label
                          htmlFor="ignore-punctuation"
                          className="font-['Inter'] text-[14px] text-gray-700 cursor-pointer"
                        >
                          Ignore punctuation
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Written Response Type */}
                {questionType === 'written-response' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-[8px] p-[16px]">
                    <p className="font-['Inter'] text-[14px] text-blue-900">
                      This question will require manual marking by an instructor. Learners will see a text area to type their response.
                    </p>
                  </div>
                )}

                {/* Explanation Field */}
                <div className="mt-[24px] pt-[24px] border-t border-gray-200">
                  <Label className="font-['Inter'] font-medium text-[14px] text-gray-700 mb-[8px] block">
                    Explanation / Model answer (optional)
                  </Label>
                  <Textarea
                    placeholder="Provide an explanation or model answer that learners will see after submitting..."
                    value={currentExplanation}
                    onChange={(e) => { setCurrentExplanation(e.target.value); markAsUnsaved(); }}
                    className="min-h-[120px] resize-none"
                  />
                </div>

                {/* Save & Cancel Buttons */}
                <div className="mt-[24px] flex items-center gap-[12px]">
                  <Button
                    onClick={handleSaveQuestion}
                    className="bg-[#1977f3] hover:bg-[#1567d3] font-['Inter']"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={handleCancelQuestion}
                    className="bg-gray-200 hover:bg-gray-300 font-['Inter']"
                  >
                    Cancel
                  </Button>
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
                  <div className="border-2 border-dashed border-gray-300 rounded-[8px] p-[32px] text-center hover:border-[#1977f3] hover:bg-blue-50/30 transition-colors cursor-pointer">
                    <Upload className="w-[48px] h-[48px] text-gray-400 mx-auto mb-[12px]" />
                    <p className="font-['Inter'] text-[14px] text-gray-700 mb-[4px]">
                      Drop file or browse
                    </p>
                    <p className="font-['Inter'] text-[12px] text-gray-500">
                      Formats: .jpg, .png<br />Max file size: 25 MB
                    </p>
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

              {/* Upload Audio */}
              <div className="bg-white rounded-[12px] p-[24px] shadow-sm border border-gray-200">
                <Label className="font-['Inter'] font-semibold text-[16px] text-gray-900 mb-[16px] block">
                  Upload Audio
                </Label>

                {!audioFile ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-[8px] p-[32px] text-center hover:border-[#1977f3] hover:bg-blue-50/30 transition-colors cursor-pointer">
                    <Upload className="w-[48px] h-[48px] text-gray-400 mx-auto mb-[12px]" />
                    <p className="font-['Inter'] text-[14px] text-gray-700 mb-[4px]">
                      Drop file or browse
                    </p>
                    <p className="font-['Inter'] text-[12px] text-gray-500">
                      Formats: .mp3, .wav<br />Max file size: 25 MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="bg-gray-100 rounded-[8px] p-[16px] mb-[12px]">
                      <div className="flex items-center gap-[12px]">
                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="w-[40px] h-[40px] bg-[#1977f3] hover:bg-[#1567d3] rounded-full flex items-center justify-center transition-colors"
                        >
                          {isPlaying ? (
                            <Pause className="w-[18px] h-[18px] text-white" />
                          ) : (
                            <Play className="w-[18px] h-[18px] text-white ml-[2px]" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="h-[4px] bg-gray-300 rounded-full overflow-hidden">
                            <div className="h-full bg-[#1977f3] w-[30%]"></div>
                          </div>
                          <div className="flex justify-between mt-[8px]">
                            <span className="font-['Inter'] text-[12px] text-gray-600">0:32</span>
                            <span className="font-['Inter'] text-[12px] text-gray-600">1:45</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setAudioFile(null)}
                      className="w-full font-['Inter'] text-[14px] text-red-600 hover:text-red-700 transition-colors"
                    >
                      Remove audio
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
                  {/* Task */}
                  <div>
                    <Label className="font-['Inter'] text-[14px] text-gray-700 mb-[8px] block">
                      Task
                    </Label>
                    <Select defaultValue="1">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Task 1</SelectItem>
                        <SelectItem value="2">Task 2</SelectItem>
                        <SelectItem value="3">Task 3</SelectItem>
                        <SelectItem value="4">Task 4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Question Type */}
                  <div>
                    <Label className="font-['Inter'] text-[14px] text-gray-700 mb-[8px] block">
                      Question Type
                    </Label>
                    <ChipInput
                      value={questionTypeTags}
                      onChange={setQuestionTypeTags}
                      placeholder="Add tag..."
                      maxTags={4}
                    />
                  </div>

                  {/* Topic */}
                  <div>
                    <Label className="font-['Inter'] text-[14px] text-gray-700 mb-[8px] block">
                      Topic
                    </Label>
                    <ChipInput
                      value={topicTags}
                      onChange={setTopicTags}
                      placeholder="Add tag..."
                      maxTags={4}
                    />
                  </div>

                  {/* Updated On */}
                  <div>
                    <Label className="font-['Inter'] text-[14px] text-gray-700 mb-[8px] block">
                      Updated On
                    </Label>
                    <Input type="date" defaultValue="2024-03-15" />
                  </div>

                  {/* Questions */}
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
                    <Input type="number" defaultValue="5" min="1" />
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