import { useState } from "react";
import type { User } from "../types";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  return {
    user,
    setUser,
  };
}
