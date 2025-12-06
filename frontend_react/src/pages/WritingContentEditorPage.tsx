import { useState, useEffect, useRef } from 'react';
import { Page } from '../App';
import { NavBarAdmin } from '../components/NavBarAdmin';
import { Footer } from '../components/Footer';
import { 
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
  Image
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { ChipInput } from '../components/ChipInput';

interface WritingContentEditorPageProps {
  setCurrentPage: (page: Page) => void;
  onLogout?: () => void;
  isEditMode?: boolean;
  editId?: string;
}

export function WritingContentEditorPage({
  setCurrentPage,
  onLogout,
  isEditMode = false,
  editId
}: WritingContentEditorPageProps) {

   const [status, setStatus] = useState<'Draft' | 'Published'>('Draft');
   const [questionTypeTags, setQuestionTypeTags] = useState<string[]>([]);
   const [topicTags, setTopicTags] = useState<string[]>([]);
   const [title, setTitle] = useState('');
   const [instructions, setInstructions] = useState('');
   const [task, setTask] = useState<'TASK_1' | 'TASK_2'>('');
   const [durationMinutes, setDurationMinutes] = useState(30);
   const [updatedOn, setUpdatedOn] = useState<string>('');
   const [thumbnailFile, setThumbnailFile] = useState<string | null>(null);
   const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
   const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleSaveExit = async () => {
    try {
      let thumbnailUrl = thumbnailFile;

      // Upload thumbnail nếu là File
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

      const payload = {
        skill: "WRITING",
        title,
        instructions,
        task,
        questionTypeTags,
        topicTags,
        thumbnailUrl: thumbnailUrl,
        audioUrl: null,
        durationMinutes,
        questionCount: 1,
        status: status === "Draft" ? "DRAFT" : "PUBLISHED",
        questions: [],
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


        } catch (err) {
          console.error("Load edit failed:", err);
          alert("Load content failed!");
        }
      };

      fetchDetail();
    }, [isEditMode, editId]);

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
              {isEditMode ? 'Edit Writing Exercise' : 'Add Writing Exercise'}
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
            {/* Left Column - Instructions */}
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
                  placeholder="Type the writing prompt and task instructions here (e.g., Write at least 250 words about the advantages and disadvantages of remote work...)."
                  className="min-h-[400px] border-gray-300 border-t-0 rounded-t-none rounded-b-[8px] resize-none font-['Inter']"
                />
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
                      onClick={() => thumbnailInputRef.current?.click()}
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
                        className="hidden"
                        accept=".jpg,.png"
                        onChange={handleThumbnailChange}
                      />
                      <Button
                        type="button"
                        className="mt-[12px] bg-[#1977f3] hover:bg-[#1567d3] font-['Inter']"
                      >
                        Browse
                      </Button>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={thumbnailPreview || ''}
                        alt="Thumbnail preview"
                        className="w-full h-[180px] object-cover rounded-[8px]"
                      />
                      <button
                        type="button"
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

                  {/* Questions - Fixed to 1 */}
                  <div>
                    <Label className="font-['Inter'] text-[14px] text-gray-700 mb-[8px] block">
                      Questions
                    </Label>
                    <div className="px-[12px] py-[10px] bg-gray-100 border border-gray-200 rounded-[8px] font-['Inter'] text-[14px] text-gray-900">
                      1
                    </div>
                    <p className="font-['Inter'] text-[12px] text-gray-500 mt-[6px]">
                      Writing exercises always contain a single question.
                    </p>
                  </div>

                  {/* Duration */}
                    <div>
                      <Label className="font-['Inter'] text-[14px] text-gray-700 mb-[8px] block">
                        Duration (minutes)
                      </Label>
                      <Input
                        type="number"
                        defaultValue="20"
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
