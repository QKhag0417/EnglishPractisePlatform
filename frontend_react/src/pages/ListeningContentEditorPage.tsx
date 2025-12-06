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
  isEditMode?: boolean;
  editId?: string;
}

interface Question {
  id: string;
  number: number;
  type: 'Short Text' | 'MCQ - Single' | 'MCQ - Multiple' | 'Written Response';
  points: number;
  correctAnswer: string;
  questionType: QuestionType;
  correctAnswers: string[];
  options: Option[];
  shuffleOptions: boolean;
  explanation: string;
  questionText?: string;
}

interface Option {
  id: string;
  text: string;
  feedback: string;
  isCorrect: boolean;
}

type QuestionType = 'mcq-single' | 'mcq-multiple' | 'short-text' | 'written-response';

export function ListeningContentEditorPage({
  setCurrentPage,
  onLogout,
  isEditMode = false,
  editId
}: ListeningContentEditorPageProps) {

  const [status, setStatus] = useState<'Draft' | 'Published'>('Draft');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('1');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveState, setSaveState] = useState<'saved' | 'unsaved' | 'editing'>('saved');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionType, setQuestionType] = useState<QuestionType>('short-text');
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [newAnswerInput, setNewAnswerInput] = useState('');
  const [currentScore, setCurrentScore] = useState('1');
  const [currentExplanation, setCurrentExplanation] = useState('');
  const [updatedOn, setUpdatedOn] = useState<string>('');
  const [currentQuestionText, setCurrentQuestionText] = useState('');

  const [options, setOptions] = useState<Option[]>([
    { id: '1', text: '', feedback: '', isCorrect: false },
    { id: '2', text: '', feedback: '', isCorrect: false },
    { id: '3', text: '', feedback: '', isCorrect: false },
    { id: '4', text: '', feedback: '', isCorrect: false },
  ]);
  const [shuffleOptions, setShuffleOptions] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [audioFile, setAudioFile] = useState<string | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const [questionTypeTags, setQuestionTypeTags] = useState<string[]>([]);
  const [topicTags, setTopicTags] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [task, setTask] = useState(''); // default
  const [durationMinutes, setDurationMinutes] = useState(15);


  const selectedQuestion = questions.find(q => q.id === selectedQuestionId);

  const mapQuestionsToApi = () => {
    return questions.map((q, index) => ({
      orderIndex: index + 1,
      type:
        q.questionType === 'mcq-single' ? 'MCQ_SINGLE' :
        q.questionType === 'mcq-multiple' ? 'MCQ_MULTIPLE' :
        q.questionType === 'short-text' ? 'SHORT_TEXT' :
        'WRITTEN_RESPONSE',

      explanation: q.explanation,
      shuffleOptions: q.shuffleOptions,
      questionText: q.questionText,
      answers:
        q.questionType === 'short-text'
          ? q.correctAnswers.map((ans, i) => ({
              orderIndex: i + 1,
              displayText: null,
              isCorrect: true,
              value: ans,
            }))
          : q.options.map((opt, i) => ({
              orderIndex: i + 1,
              displayText: opt.text,
              isCorrect: opt.isCorrect,
              value: opt.text,
            })),
    }));
  };

  const handleSaveExit = async () => {
    try {
      let thumbnailUrl = thumbnailFile;
      let audioUrl = audioFile;

      if (thumbnailFile instanceof File) {
        const formData = new FormData();
        formData.append("file", thumbnailFile);

        const uploadRes = await fetch("http://localhost:8080/api/files/thumbnail", {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        if (!uploadRes.ok) {
          const txt = await uploadRes.text();
          throw new Error("Thumbnail upload failed: " + txt);
        }

        const uploaded = await uploadRes.json();
        thumbnailUrl = uploaded.data;
      }

      if (audioFile instanceof File) {
        const formDataAudio = new FormData();
        formDataAudio.append("file", audioFile);

        const uploadAudioRes = await fetch("http://localhost:8080/api/files/audio", {
          method: "POST",
          credentials: "include",
          body: formDataAudio,
        });

        if (!uploadAudioRes.ok) {
          const txt = await uploadAudioRes.text();
          throw new Error("Audio upload failed: " + txt);
        }
        const audioJson = await uploadAudioRes.json();
        audioUrl = audioJson.data;
      }

      const payload = {
        skill: "LISTENING",
        title,
        instructions,
        task,
        questionTypeTags,
        topicTags,
        thumbnailUrl: thumbnailUrl,
        audioUrl: audioUrl,
        durationMinutes,
        questionCount: questions.length,
        status: status === "Draft" ? "DRAFT" : "PUBLISHED",
        questions: mapQuestionsToApi(),
      };

      const url = isEditMode
        ? `http://localhost:8080/api/practice-content/${editId}`
        : "http://localhost:8080/api/practice-content";

      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      alert(isEditMode ? "Updated successfully!" : "Created successfully!");
      setCurrentPage("content-management");

    } catch (err) {
      console.error("Save failed:", err);
      alert("Save content failed!");
    }
  };

  useEffect(() => {
    if (!selectedQuestion) return;

    setQuestionType(selectedQuestion.questionType);
    setCorrectAnswers(selectedQuestion.correctAnswers || []);
    setShuffleOptions(selectedQuestion.shuffleOptions);
    setOptions(
      selectedQuestion.options.length > 0
        ? selectedQuestion.options
        : [
            { id: '1', text: '', feedback: '', isCorrect: false },
            { id: '2', text: '', feedback: '', isCorrect: false },
            { id: '3', text: '', feedback: '', isCorrect: false },
            { id: '4', text: '', feedback: '', isCorrect: false },
          ]
    );

    setCurrentExplanation(selectedQuestion.explanation || '');
    setCurrentScore(String(selectedQuestion.points || 1));
    setCurrentQuestionText(selectedQuestion.questionText || '');
    setSaveState('saved');
    setHasUnsavedChanges(false);
  }, [selectedQuestionId]);

  useEffect(() => {
    if (!isEditMode || !editId) return;

    const fetchDetail = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/practice-content/${editId}`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error("Failed to load detail");

        const result = await res.json();
        const data = result.data;

        setTitle(data.title);
        setInstructions(data.instructions);
        setTask(data.task);
        setQuestionTypeTags(data.questionTypeTags);
        setTopicTags(data.topicTags);
        setDurationMinutes(data.durationMinutes);

        setStatus(data.status === "DRAFT" ? "Draft" : "Published");

        if (data.updatedOn) {
          setUpdatedOn(data.updatedOn.split("T")[0]);
        }

        if (data.thumbnailUrl) {
            setThumbnailPreview(`http://localhost:8080${data.thumbnailUrl}`);
            setThumbnailFile(data.thumbnailUrl);
        }

        if (data.audioUrl) {
            setAudioPreview(`http://localhost:8080${data.audioUrl}`);
            setAudioFile(data.audioUrl);
        }
        const mappedQuestions = data.questions.map((q: any, index: number) => ({
          id: String(index + 1),
          number: index + 1,

          type:
            q.type === "MCQ_SINGLE" ? "MCQ - Single" :
            q.type === "MCQ_MULTIPLE" ? "MCQ - Multiple" :
            q.type === "SHORT_TEXT" ? "Short Text" :
            "Written Response",

          points: 1,

          correctAnswer:
            q.type === "SHORT_TEXT"
              ? q.answers.map((a: any) => a.value).join(", ")
              : q.answers.find((a: any) => a.isCorrect)?.displayText || "",

          questionType:
            q.type === "MCQ_SINGLE" ? "mcq-single" :
            q.type === "MCQ_MULTIPLE" ? "mcq-multiple" :
            q.type === "SHORT_TEXT" ? "short-text" :
            "written-response",

          correctAnswers: q.answers.map((a: any) => a.value),

          options: q.answers.map((a: any, i: number) => ({
            id: String(i + 1),
            text: a.displayText || "",
            feedback: "",
            isCorrect: a.isCorrect
          })),

          shuffleOptions: q.shuffleOptions,
          explanation: q.explanation
        }));

        setQuestions(mappedQuestions);
        setSelectedQuestionId(mappedQuestions[0]?.id || "1");

      } catch (err) {
        console.error("Load edit failed:", err);
        alert("Load content failed!");
      }
    };

    fetchDetail();
  }, [isEditMode, editId]);

  useEffect(() => {
    if (isEditMode) return;

    const initialQuestion: Question = {
      id: Date.now().toString(),
      number: 1,
      type: 'Short Text',
      points: 1,
      correctAnswer: '',
      questionType: 'short-text',
      correctAnswers: [],

      options: [],
      shuffleOptions: false,
      explanation: ''
    };

    setQuestions([initialQuestion]);
    setSelectedQuestionId(initialQuestion.id);
  }, []);

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

            options: options,
            shuffleOptions: shuffleOptions,
            explanation: currentExplanation,
            questionText: currentQuestionText
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

        // Validate file size (25 MB)
        if (file.size > 25 * 1024 * 1024) {
          alert('File size must be less than 25 MB');
          return;
        }

        setThumbnailFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
          setThumbnailPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };


    const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/wave'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a .mp3 or .wav file');
        return;
      }

      // Validate file size (25 MB)
      if (file.size > 25 * 1024 * 1024) {
        alert('File size must be less than 25 MB');
        return;
      }

      // Create audio preview
      setAudioPreview(URL.createObjectURL(file));
      setAudioFile(file);
    };

    const handleThumbnailDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file) return;

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a .jpg or .png file');
        return;
      }

      // Validate file size (25 MB)
      if (file.size > 25 * 1024 * 1024) {
        alert('File size must be less than 25 MB');
        return;
      }

      // Create preview URL
      setThumbnailPreview(URL.createObjectURL(file));
      setThumbnailFile(file); // file thật để gửi backend
    };

    const handleAudioDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file) return;

      const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/wave'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a .mp3 or .wav file');
        return;
      }

      if (file.size > 25 * 1024 * 1024) {
        alert('File size must be less than 25 MB');
        return;
      }

      setAudioPreview(URL.createObjectURL(file));
      setAudioFile(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
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
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
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

                  {/* Question Text Field */}
                  <div className="mb-[24px]">
                    <Label className="font-['Inter'] font-medium text-[14px] text-gray-700 mb-[8px] block">
                      Question text
                    </Label>
                    <Textarea
                      placeholder="Type the question learners will see…"
                      value={currentQuestionText}
                      onChange={(e) => { setCurrentQuestionText(e.target.value); markAsUnsaved(); }}
                      className="min-h-[80px] resize-none"
                    />
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

                {!thumbnailPreview  ? (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-[8px] p-[32px] text-center hover:border-[#1977f3] hover:bg-blue-50/30 transition-colors cursor-pointer"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleThumbnailDrop}
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
                      ref={thumbnailInputRef}
                      onChange={handleThumbnailChange}
                      className="hidden"
                      accept=".jpg, .png"
                    />
                    <Button
                      onClick={() => thumbnailInputRef.current?.click()}
                      className="mt-[12px] bg-[#1977f3] hover:bg-[#1567d3] font-['Inter']"
                    >
                      Browse
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full h-[180px] object-cover rounded-[8px]"
                    />
                    <button
                      onClick={() => {
                          setThumbnailFile(null);
                          setThumbnailPreview(null);
                      }}
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

                {!audioPreview  ? (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-[8px] p-[32px] text-center hover:border-[#1977f3] hover:bg-blue-50/30 transition-colors cursor-pointer"
                    onDrop={handleAudioDrop}
                    onDragOver={handleDragOver}
                  >
                    <Upload className="w-[48px] h-[48px] text-gray-400 mx-auto mb-[12px]" />
                    <p className="font-['Inter'] text-[14px] text-gray-700 mb-[4px]">
                      Drop file or browse
                    </p>
                    <p className="font-['Inter'] text-[12px] text-gray-500">
                      Formats: .mp3, .wav<br />Max file size: 25 MB
                    </p>

                    <input
                      type="file"
                      ref={audioInputRef}
                      onChange={handleAudioChange}
                      className="hidden"
                      accept=".mp3, .wav"
                    />

                    <Button
                      onClick={() => audioInputRef.current?.click()}
                      className="mt-[12px] bg-[#1977f3] hover:bg-[#1567d3] font-['Inter']"
                    >
                      Browse
                    </Button>
                  </div>
                ) : (
                  <div>
                    {/* Audio Preview */}
                    <div className="bg-gray-100 rounded-[8px] p-[16px] mb-[12px]">
                      <audio
                        src={audioPreview}
                        controls
                        className="w-full"
                      />
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => {
                        setAudioFile(null);
                        setAudioPreview(null);
                      }}
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
                  {/* Title */}
                  <div>
                    <Label className="font-['Inter'] text-[14px] text-gray-700 mb-[8px] block">
                      Title
                    </Label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter exercise title…"
                      className="px-[12px] py-[10px] bg-gray-100 border border-gray-200 rounded-[8px] font-['Inter'] text-[14px] text-gray-900 h-auto"
                    />
                  </div>
                  {/* Task */}
                  <div>
                    <Label className="font-['Inter'] text-[14px] text-gray-700 mb-[8px] block">
                      Task
                    </Label>
                    <Select value={task} onValueChange={setTask}>
                        <SelectTrigger className="px-[12px] py-[10px] bg-gray-100 border border-gray-200 rounded-[8px] font-['Inter'] text-[14px] text-gray-900 h-auto">
                          <SelectValue placeholder="Select a task" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TASK_1">Task 1</SelectItem>
                          <SelectItem value="TASK_2">Task 2</SelectItem>
                          <SelectItem value="TASK_3">Task 3</SelectItem>
                          <SelectItem value="TASK_4">Task 4</SelectItem>
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
                        className="px-[12px] py-[10px] bg-gray-100 border border-gray-200 rounded-[8px] font-['Inter'] text-[14px] text-gray-900"
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
                      <Input
                        type="date"
                        value={new Date().toISOString().split('T')[0]}
                        readOnly
                        className="px-[12px] py-[10px] bg-gray-100 border border-gray-200 rounded-[8px] font-['Inter'] text-[14px] text-gray-900 h-auto"
                      />
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
                    <Input
                      type="number"
                      defaultValue="5"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      min="1"
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