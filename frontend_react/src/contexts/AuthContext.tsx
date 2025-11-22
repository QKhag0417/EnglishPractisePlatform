import { createContext, useContext, useState, ReactNode } from 'react';

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

  // --------------------------
  // LOGIN
  // --------------------------
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

    const api = await res.json();             // ApiResponse<LoginResponseDto>
    const data = api.data;                    // the payload we created above

    const loggedInUser = {
      id: String(data.id || Date.now()),
      name: `${data.firstname || ""} ${data.lastname || ""}`.trim(),
      email: data.email,
      role: data.role,
    };

    setUser(loggedInUser);
    return loggedInUser;
  } catch (err) {
    console.error(err);
    throw err;
  }
};


  // --------------------------
  // REGISTER
  // --------------------------
  const register = async (
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    role: UserRole = "student"
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

      if (!res.ok) throw new Error("Registration failed");

      const data = await res.json();

      setUser({
        id: data.id,
        name: `${data.firstname} ${data.lastname}`,
        email: data.email,
        role: data.role,
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const logout = () => setUser(null);

  const updateUserRole = (role: UserRole) => {
    if (user) setUser({ ...user, role });
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
