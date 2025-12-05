import { useEffect, useState } from "react";
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
import { ListeningContentEditorPage } from "./pages/ListeningContentEditorPage";
import { ReadingContentEditorPage } from "./pages/ReadingContentEditorPage";
import { WritingContentEditorPage } from "./pages/WritingContentEditorPage";
import { SpeakingContentEditorPage } from "./pages/SpeakingContentEditorPage";
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
  | "evaluation-test"
  | "add-listening-content"
  | "add-reading-content"
  | "add-writing-content"
  | "add-speaking-content"
  | "edit-listening-content"
  | "edit-reading-content"
  | "edit-writing-content"
  | "edit-speaking-content";

function AppContent() {
  const { user, isLoggedIn, logout } = useAuth();
  // Set default page to home for everyone
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [editId, setEditId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (user?.role === "Administrator") {
      setCurrentPage("content-management");
    } else {
      setCurrentPage("home");
    }
  }, [user]);

  const handleSetCurrentPage = (page: Page, id?: string) => {
    setCurrentPage(page);
    setEditId(id);
  };

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
          allowedRoles={["Administrator"]}
          setCurrentPage={handleSetCurrentPage}
        >
          <PracticeContentManagementPage
            setCurrentPage={handleSetCurrentPage}
            onLogout={handleLogout}
          />
        </ProtectedRoute>
      )}
      {currentPage === "add-listening-content" && (
        <ProtectedRoute
          allowedRoles={["Administrator"]}
          setCurrentPage={handleSetCurrentPage}
        >
          <ListeningContentEditorPage
            setCurrentPage={handleSetCurrentPage}
            isEditMode={false}
            onLogout={handleLogout}
          />
        </ProtectedRoute>
      )}
      {currentPage === "add-reading-content" && (
        <ProtectedRoute
          allowedRoles={["Administrator"]}
          setCurrentPage={handleSetCurrentPage}
        >
          <ReadingContentEditorPage
            setCurrentPage={handleSetCurrentPage}
            isEditMode={false}
            onLogout={handleLogout}
          />
        </ProtectedRoute>
      )}
      {currentPage === "add-writing-content" && (
        <ProtectedRoute
          allowedRoles={["Administrator"]}
          setCurrentPage={handleSetCurrentPage}
        >
          <WritingContentEditorPage
            setCurrentPage={handleSetCurrentPage}
            isEditMode={false}
            onLogout={handleLogout}
          />
        </ProtectedRoute>
      )}
      {currentPage === "add-speaking-content" && (
        <ProtectedRoute
          allowedRoles={["Administrator"]}
          setCurrentPage={handleSetCurrentPage}
        >
          <SpeakingContentEditorPage
            setCurrentPage={handleSetCurrentPage}
            isEditMode={false}
            onLogout={handleLogout}
          />
        </ProtectedRoute>
      )}
      
      {/* Edit Exercise Pages */}
      {currentPage === "edit-listening-content" && (
        <ProtectedRoute
          allowedRoles={["Administrator"]}
          setCurrentPage={handleSetCurrentPage}
        >
          <ListeningContentEditorPage
            setCurrentPage={handleSetCurrentPage}
            editId={editId}
            onLogout={handleLogout}
            isEditMode={true}
          />
        </ProtectedRoute>
      )}
      {currentPage === "edit-reading-content" && (
        <ProtectedRoute
          allowedRoles={["Administrator"]}
          setCurrentPage={handleSetCurrentPage}
        >
          <ReadingContentEditorPage
            setCurrentPage={handleSetCurrentPage}
            editId={editId}
            onLogout={handleLogout}
            isEditMode={true}
          />
        </ProtectedRoute>
      )}
      {currentPage === "edit-writing-content" && (
        <ProtectedRoute
          allowedRoles={["Administrator"]}
          setCurrentPage={handleSetCurrentPage}
        >
          <WritingContentEditorPage
            setCurrentPage={handleSetCurrentPage}
            editId={editId}
            onLogout={handleLogout}
            isEditMode={true}
          />
        </ProtectedRoute>
      )}
      {currentPage === "edit-speaking-content" && (
        <ProtectedRoute
          allowedRoles={["Administrator"]}
          setCurrentPage={handleSetCurrentPage}
        >
          <SpeakingContentEditorPage
            setCurrentPage={handleSetCurrentPage}
            editId={editId}
            onLogout={handleLogout}
            isEditMode={true}
          />
        </ProtectedRoute>
      )}
      
      {currentPage === "user-management" && (
        <ProtectedRoute
          allowedRoles={["Administrator"]}
          setCurrentPage={handleSetCurrentPage}
        >
          <UserManagementPage
            setCurrentPage={handleSetCurrentPage}
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