import { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { HomePage } from "./pages/HomePage";
import { MockTestPage } from "./pages/MockTestPage";
import { ListeningPage } from "./pages/ListeningPage";
import { ListeningOverviewPage } from "./pages/ListeningOverviewPage";
import { ReadingPage } from "./pages/ReadingPage";
import { ReadingOverviewPage } from "./pages/ReadingOverviewPage";
import { WritingPage } from "./pages/WritingPage";
import { WritingOverviewPage } from "./pages/WritingOverviewPage";
import { SpeakingPage } from "./pages/SpeakingPage";
import { SpeakingOverviewPage } from "./pages/SpeakingOverviewPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AuthPromptPage } from "./pages/AuthPromptPage";
import { PracticeContentManagementPage } from "./pages/PracticeContentManagementPage";
import { UserManagementPage } from "./pages/UserManagementPage";
import { EvaluationTestPage } from "./pages/EvaluationTestPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

export type Page =
  | "home"
  | "mocktest"
  | "listening"
  | "listening-overview"
  | "reading"
  | "reading-overview"
  | "writing"
  | "writing-overview"
  | "speaking"
  | "speaking-overview"
  | "login"
  | "register"
  | "auth-prompt"
  | "content-management"
  | "user-management"
  | "evaluation-test";

function AppContent() {
  const { user, isLoggedIn, logout } = useAuth();
  // Set default page to home for everyone
  const [currentPage, setCurrentPage] = useState<Page>("home");

  const handleLogout = () => {
    logout();
    setCurrentPage("home"); // Redirect to home after logout
  };

  return (
    <div className="bg-white min-h-screen">
      {currentPage === "login" && (
        <LoginPage setCurrentPage={setCurrentPage} />
      )}
      {currentPage === "register" && (
        <RegisterPage setCurrentPage={setCurrentPage} />
      )}
      {currentPage === "auth-prompt" && (
        <AuthPromptPage setCurrentPage={setCurrentPage} />
      )}

      {/* Home Page - Accessible to everyone */}
      {currentPage === "home" && (
        <HomePage
          setCurrentPage={setCurrentPage}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          userRole={user?.role}
        />
      )}

      {/* Learner Routes - Accessible to everyone, but actions require login */}
      {currentPage === "mocktest" && (
        <MockTestPage
          setCurrentPage={setCurrentPage}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />
      )}
      {currentPage === "listening" && (
        <ListeningPage
          setCurrentPage={setCurrentPage}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />
      )}
      {currentPage === "listening-overview" && (
        <ListeningOverviewPage
          setCurrentPage={setCurrentPage}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />
      )}
      {currentPage === "reading" && (
        <ReadingPage
          setCurrentPage={setCurrentPage}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />
      )}
      {currentPage === "reading-overview" && (
        <ReadingOverviewPage
          setCurrentPage={setCurrentPage}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />
      )}
      {currentPage === "writing" && (
        <WritingPage
          setCurrentPage={setCurrentPage}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />
      )}
      {currentPage === "writing-overview" && (
        <WritingOverviewPage
          setCurrentPage={setCurrentPage}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />
      )}
      {currentPage === "speaking" && (
        <SpeakingPage
          setCurrentPage={setCurrentPage}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />
      )}
      {currentPage === "speaking-overview" && (
        <SpeakingOverviewPage
          setCurrentPage={setCurrentPage}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />
      )}
      {currentPage === "evaluation-test" && (
        <EvaluationTestPage
          setCurrentPage={setCurrentPage}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />
      )}

      {/* Administrator Routes */}
      {currentPage === "content-management" && (
        <ProtectedRoute
          allowedRoles={["administrator"]}
          setCurrentPage={setCurrentPage}
        >
          <PracticeContentManagementPage
            setCurrentPage={setCurrentPage}
            onLogout={handleLogout}
          />
        </ProtectedRoute>
      )}
      {currentPage === "user-management" && (
        <ProtectedRoute
          allowedRoles={["administrator"]}
          setCurrentPage={setCurrentPage}
        >
          <UserManagementPage
            setCurrentPage={setCurrentPage}
            onLogout={handleLogout}
          />
        </ProtectedRoute>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}