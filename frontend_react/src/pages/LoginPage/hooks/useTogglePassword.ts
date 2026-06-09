import { useState } from "react";

export function useTogglePassword(initialValue = false) {
  const [showPassword, setShowPassword] = useState(initialValue);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return {
    showPassword,
    setShowPassword,
    togglePassword,
  };
}
