import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { DatePicker } from "../../../components/DatePicker";
import { formatToDisplay, formatToISO, getAvatarMeta } from "../utils";
import { useAuth } from "../../../contexts/AuthContext";
import {
  useDeleteAvatar,
  usePostAvatar,
  useProfileForm,
  usePutUserById,
} from "../hooks";
import { useEffect, useRef } from "react";

export function MyProfile() {
  // =========================
  // Auth
  // =========================

  const { user } = useAuth();

  // =========================
  // Profile form
  // =========================

  const profileForm = useProfileForm();

  // =========================
  // Keep profile form in sync
  // =========================

  useEffect(() => {
    if (!user) return;

    profileForm.setFirstName(user.firstname ?? "");
    profileForm.setLastName(user.lastname ?? "");
    profileForm.setEmail(user.email ?? "");
    profileForm.setGender(user.gender ?? undefined);
    profileForm.setPhoneNumber(user.phoneNumber ?? "");
    profileForm.setDateOfBirth(user.dateOfBirth ?? "");
    profileForm.setAvatarUrl(user.avatarUrl ?? "");
  }, [user]);

  // =========================
  // Post avatar
  // =========================

  const postAvatar = usePostAvatar();

  // =========================
  // Delete avatar
  // =========================

  const deleteAvatar = useDeleteAvatar();

  // =========================
  // Handle photo upload
  // =========================

  const fileInputRef = useRef<HTMLInputElement>(null);

  const pendingAvatarUrlRef = useRef<string | null>(null);
  const isAvatarSavedRef = useRef(true);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";

    if (pendingAvatarUrlRef.current && !isAvatarSavedRef.current) {
      await deleteAvatar.remove(undefined, {
        fileUrl: pendingAvatarUrlRef.current,
      });
    }

    const uploadedUrl = await postAvatar.post(file);
    if (!uploadedUrl) return;

    profileForm.setAvatarUrl(uploadedUrl);

    pendingAvatarUrlRef.current = uploadedUrl;
    isAvatarSavedRef.current = false;
  };

  // =========================
  // Clean up
  // =========================

  useEffect(() => {
    const hasCleanedUpRef = { current: false };

    const cleanupPendingAvatar = () => {
      const fileUrl = pendingAvatarUrlRef.current;

      if (!fileUrl || isAvatarSavedRef.current || hasCleanedUpRef.current) {
        return;
      }

      hasCleanedUpRef.current = true;

      deleteAvatar.remove(undefined, {
        fileUrl,
      });
    };

    const handlePageHide = () => {
      cleanupPendingAvatar();
    };

    const handleBeforeUnload = () => {
      cleanupPendingAvatar();
    };

    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("beforeunload", handleBeforeUnload);

      cleanupPendingAvatar();
    };
  }, []);

  // =========================
  // Put user by id
  // =========================

  const putUserById = usePutUserById();

  const isSaving = putUserById.loading;

  // =========================
  // Saved avatar url
  // =========================

  const savedAvatarUrlRef = useRef<string | null>(user?.avatarUrl ?? null);

  useEffect(() => {
    if (isAvatarSavedRef.current) {
      savedAvatarUrlRef.current = user?.avatarUrl ?? null;
    }
  }, [user?.avatarUrl]);

  // =========================
  // Handle save changes
  // =========================

  const handleSaveChanges = async () => {
    if (!user?.id) return;

    const previousSavedAvatarUrl = savedAvatarUrlRef.current;
    const nextAvatarUrl = profileForm.avatarUrl;

    await putUserById.put(
      { userId: user.id },
      {
        firstname: profileForm.firstName,
        lastname: profileForm.lastName,
        email: profileForm.email,
        gender: profileForm.gender,
        phoneNumber: profileForm.phoneNumber,
        dateOfBirth: profileForm.dateOfBirth,
        avatarUrl: nextAvatarUrl,
      },
    );

    isAvatarSavedRef.current = true;
    pendingAvatarUrlRef.current = null;
    savedAvatarUrlRef.current = nextAvatarUrl;

    if (
      previousSavedAvatarUrl &&
      nextAvatarUrl &&
      previousSavedAvatarUrl !== nextAvatarUrl
    ) {
      await deleteAvatar.remove(undefined, {
        fileUrl: previousSavedAvatarUrl,
      });
    }
  };

  // =========================
  // Get avatar meta
  // =========================

  const avatarMeta = getAvatarMeta(
    profileForm.firstName,
    profileForm.lastName,
    profileForm.avatarUrl,
  );

  return (
    <>
      <h1 className="font-['Inter'] text-[28px] font-semibold text-gray-900 mb-[32px]">
        My Profile
      </h1>

      <div className="grid grid-cols-[160px_1fr] gap-[40px]">
        {/* Profile Picture */}
        <div className="flex flex-col items-center gap-[16px]">
          <Avatar className="w-[120px] h-[120px] flex-shrink-0">
            <AvatarImage
              src={avatarMeta.avatarUrl || undefined}
              alt="Profile"
            />
            <AvatarFallback
              className={`${avatarMeta.colorClass} text-white font-['Inter'] font-semibold text-[48px]`}
            >
              {avatarMeta.initials}
            </AvatarFallback>
          </Avatar>
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
              <path
                d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.3333 5.33333L8 2L4.66667 5.33333"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 2V10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
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
                value={profileForm.firstName}
                onChange={(e) => profileForm.setFirstName(e.target.value)}
                className="h-[44px]"
                placeholder=""
              />
            </div>
            <div>
              <Label className="font-['Inter'] text-[14px] font-medium text-gray-700 mb-[8px] block">
                Last name
              </Label>
              <Input
                value={profileForm.lastName}
                onChange={(e) => profileForm.setLastName(e.target.value)}
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
                      value={formatToDisplay(profileForm.dateOfBirth)}
                      onChange={(e) => {
                        const value = e.target.value;
                        profileForm.setDateOfBirth(formatToISO(value));
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
                    value={formatToDisplay(profileForm.dateOfBirth)}
                    onChange={(date) => {
                      profileForm.setDateOfBirth(formatToISO(date));
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
                    checked={profileForm.gender === "male"}
                    onChange={() => profileForm.setGender("male")}
                    className="w-[18px] h-[18px]"
                  />
                  <span className="font-['Inter'] text-[14px] text-gray-700">
                    Male
                  </span>
                </label>
                <label className="flex items-center gap-[8px] cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={profileForm.gender === "female"}
                    onChange={() => profileForm.setGender("female")}
                    className="w-[18px] h-[18px]"
                  />
                  <span className="font-['Inter'] text-[14px] text-gray-700">
                    Female
                  </span>
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
                value={profileForm.email}
                onChange={(e) => {
                  profileForm.setEmail(e.target.value);
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
                value={profileForm.phoneNumber}
                onChange={(e) => {
                  profileForm.setPhoneNumber(e.target.value);
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
                            ${
                              isSaving
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
                    <circle
                      cx="8"
                      cy="8"
                      r="7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M5 8L7 10L11 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Save changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
