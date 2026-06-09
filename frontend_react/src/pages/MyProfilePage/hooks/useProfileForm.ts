import { useState } from "react";

type Gender = "male" | "female" | undefined;

type UseProfileFormParams = {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: Gender;
  phoneNumber?: string;
  avatarUrl?: string;
  email?: string;
};

export function useProfileForm(initialValues?: UseProfileFormParams) {
  const [firstName, setFirstName] = useState(initialValues?.firstName || "");
  const [lastName, setLastName] = useState(initialValues?.lastName || "");
  const [dateOfBirth, setDateOfBirth] = useState(
    initialValues?.dateOfBirth || "",
  );
  const [gender, setGender] = useState<Gender>(initialValues?.gender);
  const [phoneNumber, setPhoneNumber] = useState(
    initialValues?.phoneNumber || "",
  );
  const [avatarUrl, setAvatarUrl] = useState(initialValues?.avatarUrl || "");
  const [email, setEmail] = useState(initialValues?.email || "");

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    dateOfBirth,
    setDateOfBirth,
    gender,
    setGender,
    phoneNumber,
    setPhoneNumber,
    avatarUrl,
    setAvatarUrl,
    email,
    setEmail,
  };
}
