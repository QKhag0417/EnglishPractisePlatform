import { useState } from "react";

export function useRegisterForm(
  initialFirstName = "",
  initialLastName = "",
  initialEmail = "",
  initialPassword = "",
  initialConfirmPassword = "",
) {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(initialPassword);
  const [confirmPassword, setConfirmPassword] = useState(
    initialConfirmPassword,
  );

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
  };
}
