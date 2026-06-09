import { createContext, useContext, useEffect, ReactNode } from "react";
import { API_BASE } from "../env";
import type { User, AuthContextType } from "./types";
import {
  useGetHome,
  useGetUserById,
  usePostLogin,
  usePostLogout,
  usePostRegister,
  useUser,
} from "./hooks";
import { mapRole } from "./utils";

export type { UserRole, User, UpdateProfilePayload } from "./types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // =========================
  // User State
  // =========================

  const { user, setUser } = useUser();

  // =========================
  // Post Login
  // =========================

  const postLogin = usePostLogin();

  // =========================
  // Post Register
  // =========================

  const postRegister = usePostRegister();

  // =========================
  // Post Register
  // =========================

  const postLogout = usePostLogout();

  // =========================
  // Get Home
  // =========================

  const home = useGetHome();

  // =========================
  // Get User By Id
  // =========================

  const getUserById = useGetUserById();

  // =========================
  // Restore Session
  // =========================

  useEffect(() => {
    void restoreSession();
  }, []);

  const restoreSession = async (): Promise<User | null> => {
    try {
      const homeInfo = await home.get();

      if (!homeInfo) {
        setUser(null);
        localStorage.removeItem("user");
        return null;
      }

      const role = mapRole(homeInfo.role);
      if (!role || !homeInfo.id) {
        setUser(null);
        localStorage.removeItem("user");
        return null;
      }

      const userId = homeInfo.id;

      const info = await getUserById.get({ userId });

      if (!info) {
        setUser(null);
        localStorage.removeItem("user");
        return null;
      }

      const restoredUser: User = {
        id: String(info?.userId ?? userId),
        firstname: String(info?.firstname ?? ""),
        lastname: String(info?.lastname ?? ""),
        name:
          `${info?.firstname ?? ""} ${info?.lastname ?? ""}`.trim() || "User",
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

  // =========================
  // Login
  // =========================

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const user = await postLogin.post({ email, password });

      if (!user) throw new Error("Login failed");

      setUser(user);

      await restoreSession();

      return user;
    } catch (error) {
      throw error;
    }
  };

  // =========================
  // Register
  // =========================

  const register = async (
    firstname: string,
    lastname: string,
    email: string,
    password: string,
  ): Promise<void> => {
    try {
      const registerResult = await postRegister.post({
        firstname,
        lastname,
        email,
        password,
      });

      if (!registerResult) throw new Error("Register failed");
    } catch (error) {
      throw error;
    }
  };

  // =========================
  // Logout
  // =========================

  const logout = async (): Promise<void> => {
    try {
      await postLogout.post({});
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
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
