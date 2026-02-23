import { createBrowserRouter, Navigate } from "react-router";
import { HomePage } from "./pages/HomePage";
import { MockTestPage } from "./pages/MockTestPage";
import { BrowsePage } from "./pages/BrowsePage/BrowsePage";
import { ListeningOverviewPage } from "./pages/ListeningOverviewPage";
import { TestPage } from "./pages/TestPage/TestPage";
import { ReadingOverviewPage } from "./pages/ReadingOverviewPage";
import { WritingOverviewPage } from "./pages/WritingOverviewPage";
import { SpeakingOverviewPage } from "./pages/SpeakingOverviewPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { AuthPromptPage } from "./pages/AuthPromptPage";
import { PracticeContentManagementPage } from "./pages/PracticeContentManagementPage";
import { UserManagementPage } from "./pages/UserManagementPage";
import { EvaluationTestPage } from "./pages/EvaluationTestPage";
import { ListeningContentEditorPage } from "./pages/ListeningContentEditorPage";
import { ReadingContentEditorPage } from "./pages/ReadingContentEditorPage";
import { WritingContentEditorPage } from "./pages/WritingContentEditorPage";
import { SpeakingContentEditorPage } from "./pages/SpeakingContentEditorPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  // Authentication routes
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    path: "/forgot-password",
    Component: ForgotPasswordPage,
  },
  {
    path: "/auth-prompt",
    Component: AuthPromptPage,
  },
  // Listening routes
  {
    path: "/:skill/browse",
    Component: BrowsePage,
  },
  {
    path: "/listening/overview",
    Component: ListeningOverviewPage,
  },
  {
    path: "/test/:exerciseId",
    Component: TestPage,
  },
  //   // Reading routes
  //   {
  //     path: "/reading",
  //     Component: ReadingPage,
  //   },
  {
    path: "/reading/overview",
    Component: ReadingOverviewPage,
  },
  //   {
  //     path: "/reading/test/:exerciseId",
  //     Component: ReadingTestPage,
  //   },
  //   Writing routes
  //   {
  //     path: "/writing",
  //     Component: WritingPage,
  //   },
  {
    path: "/writing/overview",
    Component: WritingOverviewPage,
  },
  //   // Speaking routes
  //   {
  //     path: "/speaking",
  //     Component: SpeakingPage,
  //   },
  {
    path: "/speaking/overview",
    Component: SpeakingOverviewPage,
  },
  //   // Mock test route
  //   {
  //     path: "/mocktest",
  //     Component: MockTestPage,
  //   },
  //   // Evaluation test route
  //   {
  //     path: "/evaluation-test",
  //     Component: EvaluationTestPage,
  //   },
  // Admin routes
  {
    path: "/admin/content-management",
    element: (
      <ProtectedRoute allowedRoles={["administrator"]}>
        <PracticeContentManagementPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/content/listening/add",
    element: (
      <ProtectedRoute allowedRoles={["administrator"]}>
        <ListeningContentEditorPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/content/listening/edit/:exerciseId",
    element: (
      <ProtectedRoute allowedRoles={["administrator"]}>
        <ListeningContentEditorPage />
      </ProtectedRoute>
    ),
  },
  //   {
  //     path: "/admin/content/reading/add",
  //     element: (
  //       <ProtectedRoute allowedRoles={["administrator"]}>
  //         <ReadingContentEditorPage />
  //       </ProtectedRoute>
  //     ),
  //   },
  //   {
  //     path: "/admin/content/reading/edit/:exerciseId",
  //     element: (
  //       <ProtectedRoute allowedRoles={["administrator"]}>
  //         <ReadingContentEditorPage />
  //       </ProtectedRoute>
  //     ),
  //   },
  //   {
  //     path: "/admin/content/writing/add",
  //     element: (
  //       <ProtectedRoute allowedRoles={["administrator"]}>
  //         <WritingContentEditorPage />
  //       </ProtectedRoute>
  //     ),
  //   },
  //   {
  //     path: "/admin/content/writing/edit/:exerciseId",
  //     element: (
  //       <ProtectedRoute allowedRoles={["administrator"]}>
  //         <WritingContentEditorPage />
  //       </ProtectedRoute>
  //     ),
  //   },
  //   {
  //     path: "/admin/content/speaking/add",
  //     element: (
  //       <ProtectedRoute allowedRoles={["administrator"]}>
  //         <SpeakingContentEditorPage />
  //       </ProtectedRoute>
  //     ),
  //   },
  //   {
  //     path: "/admin/content/speaking/edit/:exerciseId",
  //     element: (
  //       <ProtectedRoute allowedRoles={["administrator"]}>
  //         <SpeakingContentEditorPage />
  //       </ProtectedRoute>
  //     ),
  //   },
  {
    path: "/admin/users",
    element: (
      <ProtectedRoute allowedRoles={["administrator"]}>
        <UserManagementPage />
      </ProtectedRoute>
    ),
  },
  //   // Catch-all route - redirect to home
  //   {
  //     path: "*",
  //     element: <Navigate to="/" replace />,
  //   },
]);
