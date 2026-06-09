import { useState } from "react";

export function useAuthForm(initialEmail = "", initialPassword = "") {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(initialPassword);

  return {
    email,
    setEmail,
    password,
    setPassword,
  };
}
