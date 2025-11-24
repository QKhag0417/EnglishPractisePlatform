import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type UserRole = 'Learner' | 'Administrator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    role?: UserRole
  ) => Promise<void>;
  logout: () => void;
  updateUserRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => { restoreSession(); }, []);

  // ---------------------------------------------------------
  // RESTORE SESSION FROM BACKEND (ONLY IF NO LOCAL USER)
  // ---------------------------------------------------------
  const restoreSession = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/home", {
        method: "GET",
        credentials: "include",
      });

      const api = await res.json();
      const info = api.data;

      if (info.role !== "guest") {
        const restoredUser = {
          id: String(info.id),
          name: info.fullName || `${info.firstname} ${info.lastname}`,
          email: info.email,
          role: info.role,
        };

        setUser(restoredUser);
        localStorage.setItem("user", JSON.stringify(restoredUser));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    } catch (err) {
      console.log("Session restore failed:", err);
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  // ---------------------------------------------------------
  // LOGIN
  // ---------------------------------------------------------
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Login failed");
      }

      const api = await res.json();
      const data = api.data;

      const loggedInUser = {
        id: String(data.id || Date.now()),
        name: `${data.firstname || ""} ${data.lastname || ""}`.trim(),
        email: data.email,
        role: data.role,
      };

      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser)); // ⭐ SAVE ON LOGIN
      restoreSession();
      return loggedInUser;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // ---------------------------------------------------------
  // REGISTER
  // ---------------------------------------------------------
  const register = async (
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    role: UserRole = "Learner"
  ) => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          firstname,
          lastname,
          role,
        }),
      });

      const api = await res.json();

      if (!res.ok) {
        if (api.errors) {
          throw api.errors;
        }
        throw { error: api.message || "Registration failed" };
      }

      const data = api.data;

      const newUser = {
        id: String(data.id),
        name: `${data.firstname} ${data.lastname}`,
        email: data.email,
        role: data.role,
      };

      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser)); // ⭐ SAVE AFTER REGISTER

    } catch (err) {
      console.error("REGISTER ERROR:", err);
      throw err;
    }
  };

  // ---------------------------------------------------------
  // LOGOUT
  // ---------------------------------------------------------
  const logout = async () => {
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }

    setUser(null);
    localStorage.removeItem("user"); // ⭐ REMOVE LOCAL STORAGE
  };

  const updateUserRole = (role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        register,
        logout,
        updateUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
