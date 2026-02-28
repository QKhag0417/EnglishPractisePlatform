import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { API_BASE } from "../env";

export type UserRole = "learner" | "administrator";

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  name: string;
  email: string;
  role: UserRole;
  gender?: "male" | "female";
  phoneNumber?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
}

export type UpdateProfilePayload = {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: "male" | "female";
  phoneNumber?: string;
  avatarUrl?: string;
  email?: string;
};

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;

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
  updateProfile: (profileData: UpdateProfilePayload) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---- Helpers ----
function mapRole(raw: unknown): UserRole | null {
  if (!raw) return null;
  const r = String(raw).toLowerCase();

  if (r === "guest") return null;
  if (r === "administrator" || r === "admin") return "administrator";
  if (r === "learner" || r === "user" || r === "student") return "learner";

  return null;
}

function buildName(info: any) {
  if (info?.fullName) return String(info.fullName);
  const first = info?.firstname ? String(info.firstname) : "";
  const last = info?.lastname ? String(info.lastname) : "";
  const combined = `${first} ${last}`.trim();
  return combined || (info?.name ? String(info.name) : "");
}

async function readApiBody(res: Response): Promise<any> {
  const raw = await res.text().catch(() => "");
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return { message: raw };
  }
}

function normalizeError(api: any, fallbackMsg: string) {
  // keep your original behavior: throw api.errors if present, otherwise throw api
  if (api?.errors) return api.errors;
  if (api?.message) return new Error(String(api.message));
  return new Error(fallbackMsg);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    restoreSession();
  }, []);

const restoreSession = async (): Promise<User | null> => {
  try {
    // 1️⃣ First get basic session info
    const homeRes = await fetch(`${API_BASE}/api/home`, {
      method: "GET",
      credentials: "include",
    });

    if (!homeRes.ok) {
      setUser(null);
      localStorage.removeItem("user");
      return null;
    }

    const homeApi = await readApiBody(homeRes);
    const homeInfo = homeApi?.data ?? homeApi;

    const role = mapRole(homeInfo?.role);
    if (!role || !homeInfo?.id) {
      setUser(null);
      localStorage.removeItem("user");
      return null;
    }

    const userId = homeInfo.id;

    const userRes = await fetch(
      `${API_BASE}/api/user/${userId}?include=email,firstname,lastname,role,avatarurl,gender,phonenumber,dateOfbirth`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!userRes.ok) {
      setUser(null);
      localStorage.removeItem("user");
      return null;
    }

    const userApi = await readApiBody(userRes);
    const info = userApi?.data ?? userApi;

    const restoredUser: User = {
      id: String(info?.userId ?? userId),
      firstname: String(info?.firstname ?? ""),
      lastname: String(info?.lastname ?? ""),
      name: `${info?.firstname ?? ""} ${info?.lastname ?? ""}`.trim() || "User",
      email: String(info?.email ?? ""),
      role,
      gender:
        info?.gender === "male" || info?.gender === "female"
          ? info.gender
          : undefined,
      phoneNumber: info?.phoneNumber ?? undefined,
      dateOfBirth: info?.dateOfBirth ?? undefined,
      avatarUrl: info?.avatarUrl ?? undefined,
    };

    setUser(restoredUser);
    localStorage.setItem("user", JSON.stringify(restoredUser));

    return restoredUser;
  } catch (err) {
    console.log("Session restore failed:", err);
    setUser(null);
    localStorage.removeItem("user");
    return null;
  }
};

const login = async (email: string, password: string): Promise<User> => {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(errText || "Login failed");
  }

  const restoredUser = await restoreSession();

  if (!restoredUser) {
    throw new Error("Failed to restore session after login");
  }

  return restoredUser;
};

  const register = async (
    firstname: string,
    lastname: string,
    email: string,
    password: string,
  ): Promise<void> => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
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

    const api = await readApiBody(res);

    if (!res.ok) {
      throw normalizeError(api, "Register failed");
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
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
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, role };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

const updateProfile = async (
  profileData: UpdateProfilePayload
): Promise<void> => {
  if (!user) return;

  const res = await fetch(`${API_BASE}/api/user/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      firstname: profileData.firstName,
      lastname: profileData.lastName,
      email: profileData.email,
      gender: profileData.gender,
      phoneNumber: profileData.phoneNumber,
      dateOfBirth: profileData.dateOfBirth,
      avatarUrl: profileData.avatarUrl,
    }),
  });

  const api = await readApiBody(res);

  if (!res.ok) {
    throw normalizeError(api, "Profile update failed");
  }

  const data = api?.data ?? api;

  const updatedUser: User = {
    ...user,
    firstname: data?.firstname ?? user.firstname,
    lastname: data?.lastname ?? user.lastname,
    name: `${data?.firstname ?? user.firstname} ${
      data?.lastname ?? user.lastname
    }`.trim(),
    gender:
      data?.gender === "male" || data?.gender === "female"
        ? data.gender
        : undefined,
    phoneNumber: data?.phoneNumber ?? user.phoneNumber,
    dateOfBirth: data?.dateOfBirth ?? user.dateOfBirth,
    avatarUrl: data?.avatarUrl ?? user.avatarUrl,
    email: data?.email ?? user.email,
  };

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
        updateProfile,
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
