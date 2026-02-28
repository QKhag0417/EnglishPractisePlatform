import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { NavBarLearner } from '../components/NavBar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { CustomSelect } from '../components/ui/custom-select';
import { useAuth } from '../contexts/AuthContext';
import { User, ClipboardList, Calendar as CalendarIcon } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { format } from 'date-fns@4.1.0';
import { DatePicker } from '../components/DatePicker';
import { API_BASE } from '../env';

export function MyProfilePage() {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'history'>('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Profile form state
  const [firstName, setFirstName] = useState(user?.firstname ||'');
  const [lastName, setLastName] = useState(user?.lastname || '');
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female" | undefined>(undefined);
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [avatarUrl, setAvatar] = useState(user?.avatarUrl || '');
  const [email, setEmail] = useState(user?.email || '');

  // Update form when user changes
  useEffect(() => {
    if (!user) return;

    setFirstName(user.firstname ?? '');
    setLastName(user.lastname ?? '');
    setEmail(user.email ?? '');
    setGender(user.gender ?? undefined);
    setPhoneNumber(user.phoneNumber ?? '');
    setDateOfBirth(user.dateOfBirth ?? '');
    setAvatar(user.avatarUrl ?? '');
  }, [user]);

  const formatToDisplay = (isoDate: string) => {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
  };

  const formatToISO = (displayDate: string) => {
    if (!displayDate) return "";
    const [day, month, year] = displayDate.split("/");
    return `${year}-${month}-${day}`;
  };

const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    // Validate size (25MB)
    if (file.size > 25 * 1024 * 1024) {
      toast.error("File must be smaller than 25MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE}/api/files/avatar`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Upload failed");
    }

    const returnedValue = result.data;
    let fullAvatarUrl = "";

    if (returnedValue.startsWith("http")) {
      fullAvatarUrl = returnedValue;
    } else if (returnedValue.startsWith("/files")) {
      fullAvatarUrl = `${API_BASE}${returnedValue}`;
    } else {
      fullAvatarUrl = `${API_BASE}/files/avatars/${returnedValue}`;
    }

    // 🔥 Delete old avatar (extract filename only)
    if (avatarUrl && avatarUrl !== fullAvatarUrl) {
      const oldFileName = avatarUrl.split("/").pop();

      await fetch(`${API_BASE}/api/files/avatars/${oldFileName}`, {
        method: "DELETE",
        credentials: "include",
      });
    }

    setAvatar(fullAvatarUrl);

    toast.success("Avatar uploaded successfully");

  } catch (error: any) {
    toast.error(error?.message || "Avatar upload failed");
  }
};

  const handleSaveChanges = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);

      await updateProfile({
        firstName,
        lastName,
        email,
        gender,
        phoneNumber,
        dateOfBirth,
        avatarUrl,
      });

      toast.success("Profile updated successfully", {
        description: "Your changes have been saved.",
        duration: 3000,
      });

    } catch (error: any) {
      toast.error("Update failed", {
        description: error?.message || "Something went wrong. Please try again.",
        duration: 4000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = () => {
    if (user?.firstname) return user.firstname[0].toUpperCase();
    else if (user?.name) {
      return user.name[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <NavBarLearner onLogout={handleLogout} />

      <div className="flex-1 pt-[80px]">
        <div className="max-w-[1400px] mx-auto px-[60px] py-[40px]">
          <div className="grid grid-cols-[280px_1fr] gap-[32px]">
            {/* Left Sidebar */}
            <div className="bg-white rounded-[12px] border border-gray-200 p-[20px] h-fit">
              <nav className="space-y-[8px]">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-blue-50 text-[#1977f3]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User className="w-[20px] h-[20px]" />
                  <span className="font-['Inter'] text-[14px] font-medium">My Profile</span>
                </button>

                <button
                  onClick={() => setActiveTab('history')}
                  className={`w-full flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] transition-colors ${
                    activeTab === 'history'
                      ? 'bg-blue-50 text-[#1977f3]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ClipboardList className="w-[20px] h-[20px]" />
                  <span className="font-['Inter'] text-[14px] font-medium">Practice Test History</span>
                </button>
              </nav>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-[12px] border border-gray-200 p-[40px]">
              {activeTab === 'profile' ? (
                <>
                  <h1 className="font-['Inter'] text-[28px] font-semibold text-gray-900 mb-[32px]">
                    My Profile
                  </h1>

                  <div className="grid grid-cols-[160px_1fr] gap-[40px]">
                    {/* Profile Picture */}
                    <div className="flex flex-col items-center gap-[16px]">
                      <div className="w-[120px] h-[120px] rounded-full overflow-hidden bg-[#c8511b] flex items-center justify-center">
                        {avatarUrl ? (
                          <ImageWithFallback 
                            src={avatarUrl} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-['Inter'] text-[48px] font-semibold text-white">
                            {getInitials()}
                          </span>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        className="font-['Inter'] text-[14px] gap-[8px]"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M11.3333 5.33333L8 2L4.66667 5.33333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 2V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Edit Photo
                      </Button>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-[24px]">
                      {/* First Name & Last Name */}
                      <div className="grid grid-cols-2 gap-[20px]">
                        <div>
                          <Label className="font-['Inter'] text-[14px] font-medium text-gray-700 mb-[8px] block">
                            First name 
                          </Label>
                          <Input
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="h-[44px]"
                            placeholder=""
                          />
                        </div>
                        <div>
                          <Label className="font-['Inter'] text-[14px] font-medium text-gray-700 mb-[8px] block">
                            Last name 
                          </Label>
                          <Input
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="h-[44px]"
                            placeholder=""
                          />
                        </div>
                      </div>

                      {/* Date of Birth & Gender */}
                      <div className="grid grid-cols-2 gap-[20px]">
                        <div>
                          <Label className="font-['Inter'] text-[14px] font-medium text-gray-700 mb-[8px] block">
                            Date of birth 
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <div className="relative cursor-pointer">
                                <Input
                                  type="text"
                                  value={formatToDisplay(dateOfBirth)}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setDateOfBirth(formatToISO(value));
                                  }}
                                  placeholder="DD/MM/YYYY"
                                  className="h-[44px] pr-[40px] cursor-pointer"
                                  readOnly
                                />
                                <CalendarIcon className="absolute right-[12px] top-[12px] h-[20px] w-[20px] text-gray-400 pointer-events-none" />
                              </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <DatePicker
                                value={formatToDisplay(dateOfBirth)}
                                onChange={(date) => {
                                  setDateOfBirth(formatToISO(date));
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <Label className="font-['Inter'] text-[14px] font-medium text-gray-700 mb-[8px] block">
                            Gender
                          </Label>
                          <div className="flex gap-[24px] h-[44px] items-center">
                            <label className="flex items-center gap-[8px] cursor-pointer">
                              <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={gender === 'male'}
                                onChange={() => setGender('male')}
                                className="w-[18px] h-[18px]"
                              />
                              <span className="font-['Inter'] text-[14px] text-gray-700">Male</span>
                            </label>
                            <label className="flex items-center gap-[8px] cursor-pointer">
                              <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={gender === 'female'}
                                onChange={() => setGender('female')}
                                className="w-[18px] h-[18px]"
                              />
                              <span className="font-['Inter'] text-[14px] text-gray-700">Female</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Email & Phone Number */}
                      <div className="grid grid-cols-2 gap-[20px]">
                        <div>
                          <Label className="font-['Inter'] text-[14px] font-medium text-gray-700 mb-[8px] block">
                            Email
                          </Label>
                          <Input
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                            }}
                            className="h-[44px] flex-1"
                          />
                        </div>
                        <div>
                          <Label className="font-['Inter'] text-[14px] font-medium text-gray-700 mb-[8px] block">
                            Your phone number
                          </Label>
                          <Input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => {
                              setPhoneNumber(e.target.value);
                            }}
                            placeholder="Enter your phone number"
                            className="h-[44px] flex-1"
                          />
                        </div>
                      </div>

                      {/* Save Button - Moved to right corner */}
                      <div className="pt-[16px] flex justify-end">
                        <Button
                          onClick={handleSaveChanges}
                          disabled={isSaving}
                          className={`font-['Inter'] h-[44px] px-[32px] gap-[8px] transition-all duration-200
                            ${isSaving 
                              ? "bg-gray-400 cursor-not-allowed" 
                              : "bg-[#1977f3] hover:bg-[#1567d3] active:scale-[0.98]"
                            }`}
                        >
                          {isSaving ? (
                            <>
                              <svg
                                className="animate-spin h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                />
                              </svg>
                              Saving...
                            </>
                          ) : (
                            <>
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                                <path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Save changes
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <PracticeTestHistoryContent />
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function PracticeTestHistoryContent() {
  const [skillFilter, setSkillFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const allTestHistory = [
    {
      date: '31/10/2025',
      testName: 'IELTS Mock Test 2025 January_Writing Practice Test 1',
      skill: 'writing',
      type: 'practice',
      status: 'in-progress',
      scoreByExaminer: 'By Examiner: -',
      scoreByAI: 'By AI: -',
      timeSpent: '5:50',
    },
  ];

  const [testHistory, setTestHistory] = useState(allTestHistory);

  const handleApplyFilters = () => {
    let filtered = [...allTestHistory];

    // Filter by skill
    if (skillFilter !== 'all') {
      filtered = filtered.filter(test => test.skill === skillFilter);
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(test => test.type === typeFilter);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(test => test.status === statusFilter);
    }

    setTestHistory(filtered);
  };

  const handleDeleteTest = (index: number) => {
    const newHistory = testHistory.filter((_, i) => i !== index);
    setTestHistory(newHistory);
    toast.success('Test deleted successfully');
  };

  const handleOpenDeleteDialog = (index: number) => {
    setDeleteIndex(index);
    setShowDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteIndex(null);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <h1 className="font-['Inter'] text-[28px] font-semibold text-gray-900 mb-[32px]">
        Practice Test History
      </h1>

      {/* Filters */}
      <div className="grid grid-cols-4 gap-[12px] mb-[24px]">
        <CustomSelect
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
          options={[
            { value: 'all', label: '- All skill -' },
            { value: 'listening', label: 'Listening' },
            { value: 'reading', label: 'Reading' },
            { value: 'writing', label: 'Writing' },
            { value: 'speaking', label: 'Speaking' },
          ]}
        />

        <CustomSelect
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          options={[
            { value: 'all', label: '- All types -' },
            { value: 'practice', label: 'Practice Test' },
            { value: 'mock', label: 'Mock Test' },
          ]}
        />

        <CustomSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: 'all', label: '- All status -' },
            { value: 'completed', label: 'Completed' },
            { value: 'in-progress', label: 'In Progress' },
          ]}
        />

        <Button 
          onClick={handleApplyFilters}
          className="bg-[#1e3a5f] hover:bg-[#152b47] font-['Inter']"
        >
          Apply
        </Button>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-[12px] overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-[20px] py-[14px] text-left font-['Inter'] text-[13px] font-semibold text-gray-700 uppercase w-[120px]">
                Date
              </th>
              <th className="px-[20px] py-[14px] text-left font-['Inter'] text-[13px] font-semibold text-gray-700 uppercase">
                Test name
              </th>
              <th className="px-[20px] py-[14px] text-left font-['Inter'] text-[13px] font-semibold text-gray-700 uppercase w-[100px]">
                Score
              </th>
              <th className="px-[20px] py-[14px] text-left font-['Inter'] text-[13px] font-semibold text-gray-700 uppercase w-[120px]">
                Time spent
              </th>
              <th className="px-[20px] py-[14px] text-left font-['Inter'] text-[13px] font-semibold text-gray-700 uppercase w-[160px]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {testHistory.map((test, index) => (
              <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-[20px] py-[16px] font-['Inter'] text-[14px] text-gray-900">
                  {test.date}
                </td>
                <td className="px-[20px] py-[16px]">
                  <div className="font-['Inter'] text-[14px] text-[#1977f3]">
                    {test.testName}
                  </div>
                </td>
                <td className="px-[20px] py-[16px] font-['Inter'] text-[14px] text-gray-900">
                  {test.scoreByAI || '-'}
                </td>
                <td className="px-[20px] py-[16px] font-['Inter'] text-[14px] text-gray-900 whitespace-nowrap">
                  {test.timeSpent || '-'}
                </td>
                <td className="px-[20px] py-[16px]">
                  <div className="flex items-center gap-[8px]">
                    <Button
                      variant="default"
                      className="bg-[#1e3a5f] hover:bg-[#152b47] font-['Inter'] text-[13px] h-[36px]"
                    >
                      Review
                    </Button>
                    <button 
                      onClick={() => handleOpenDeleteDialog(index)}
                      className="p-[8px] hover:bg-red-50 rounded-[6px] transition-colors group"
                      title="Delete test"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 4H3.33333H14" stroke="currentColor" className="stroke-red-600 group-hover:stroke-red-700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5.33331 4.00016V2.66683C5.33331 2.31321 5.47379 1.97407 5.72384 1.72402C5.97389 1.47397 6.31302 1.3335 6.66665 1.3335H9.33331C9.68694 1.3335 10.0261 1.47397 10.2761 1.72402C10.5262 1.97407 10.6666 2.31321 10.6666 2.66683V4.00016M12.6666 4.00016V13.3335C12.6666 13.6871 12.5262 14.0263 12.2761 14.2763C12.0261 14.5264 11.6869 14.6668 11.3333 14.6668H4.66665C4.31302 14.6668 3.97389 14.5264 3.72384 14.2763C3.47379 14.0263 3.33331 13.6871 3.33331 13.3335V4.00016H12.6666Z" stroke="currentColor" className="stroke-red-600 group-hover:stroke-red-700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6.66669 7.3335V11.3335" stroke="currentColor" className="stroke-red-600 group-hover:stroke-red-700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9.33331 7.3335V11.3335" stroke="currentColor" className="stroke-red-600 group-hover:stroke-red-700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={() => {
          if (deleteIndex !== null) {
            handleDeleteTest(deleteIndex);
          }
          handleCloseDeleteDialog();
        }}
        title="Delete Test"
        message="Are you sure you want to delete this test?"
      />
    </>
  );
}