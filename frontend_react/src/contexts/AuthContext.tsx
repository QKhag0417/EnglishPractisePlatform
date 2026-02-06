import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type UserRole = "learner" | "administrator";

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

  // match OLD AuthContext API
  login: (email: string, password: string) => Promise<User>;
  register: (
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    role?: UserRole,
  ) => Promise<void>;
  logout: () => Promise<void>;

  updateUserRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---- Helpers ----
function mapRole(raw: unknown): UserRole | null {
  if (!raw) return null;
  const r = String(raw).toLowerCase();

  if (r === "guest") return null;
  if (r === "administrator" || r === "admin") return "administrator";
  if (r === "learner" || r === "user" || r === "student") return "learner";

  // if backend sends "Administrator"/"Learner" (old style), handled above by toLowerCase
  return null;
}

function buildName(info: any) {
  if (info?.fullName) return String(info.fullName);
  const first = info?.firstname ? String(info.firstname) : "";
  const last = info?.lastname ? String(info.lastname) : "";
  const combined = `${first} ${last}`.trim();
  return combined || (info?.name ? String(info.name) : "");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/home", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        setUser(null);
        localStorage.removeItem("user");
        return;
      }

      const api = await res.json();
      const info = api?.data;

      const role = mapRole(info?.role);
      if (!role) {
        setUser(null);
        localStorage.removeItem("user");
        return;
      }

      const restoredUser: User = {
        id: String(info?.id ?? ""),
        name: buildName(info) || "User",
        email: String(info?.email ?? ""),
        role,
        avatar: info?.avatar ? String(info.avatar) : undefined,
      };

      setUser(restoredUser);
      localStorage.setItem("user", JSON.stringify(restoredUser));
    } catch (err) {
      console.log("Session restore failed:", err);
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(errText || "Login failed");
    }

    const api = await res.json();
    const data = api?.data ?? api;

    const role = mapRole(data?.role);
    if (!role) {
      throw new Error("Login succeeded but user role is invalid/missing");
    }

    const loggedInUser: User = {
      id: String(data?.id ?? Date.now()),
      name:
        `${data?.firstname ?? ""} ${data?.lastname ?? ""}`.trim() ||
        String(data?.fullName ?? data?.name ?? email.split("@")[0]),
      email: String(data?.email ?? email),
      role,
      avatar: data?.avatar ? String(data.avatar) : undefined,
    };

    setUser(loggedInUser);
    localStorage.setItem("user", JSON.stringify(loggedInUser));

    return loggedInUser;
  };

  const register = async (
    firstname: string,
    lastname: string,
    email: string,
    password: string,
  ): Promise<void> => {
    const res = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstname,
        lastname,
        email,
        password,
      }),
      credentials: "include",
    });

    // robust parsing (handles JSON or plain-text error bodies)
    const raw = await res.text();
    let api: any = {};
    try {
      api = raw ? JSON.parse(raw) : {};
    } catch {
      api = { message: raw };
    }

    if (!res.ok) {
      if (api?.errors) throw api.errors;
      throw api;
    }

    const data = api?.data ?? api;

    const mappedRole: UserRole = mapRole(data?.role) ?? "learner"; // backend may not return role

    const newUser: User = {
      id: String(data?.id ?? Date.now()),
      name:
        `${data?.firstname ?? firstname} ${data?.lastname ?? lastname}`.trim() ||
        "User",
      email: String(data?.email ?? email),
      role: mappedRole,
      avatar: data?.avatar ? String(data.avatar) : undefined,
    };

    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  const updateUserRole = (role: UserRole) => {
    if (!user) return;
    const updatedUser = { ...user, role };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
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
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
