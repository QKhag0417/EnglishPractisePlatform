import { createBrowserRouter, Navigate } from "react-router";
import { HomePage } from "./pages/HomePage";
import { MockTestPage } from "./pages/MockTestPage";
import { ListeningPage } from "./pages/ListeningPage";
import { ListeningOverviewPage } from "./pages/ListeningOverviewPage";
import { ListeningTestPage } from "./pages/ListeningTestPage";
import { ReadingPage } from "./pages/ReadingPage";
import { ReadingOverviewPage } from "./pages/ReadingOverviewPage";
// import { ReadingTestPage } from "./pages/ReadingTestPage";
import { WritingPage } from "./pages/WritingPage";
import { WritingOverviewPage } from "./pages/WritingOverviewPage";
import { SpeakingPage } from "./pages/SpeakingPage";
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
  //   {
  //     path: "/forgot-password",
  //     Component: ForgotPasswordPage,
  //   },
  //   {
  //     path: "/auth-prompt",
  //     Component: AuthPromptPage,
  //   },
  //   // Mock test route
  //   {
  //     path: "/mocktest",
  //     Component: MockTestPage,
  //   },
  //   // Listening routes
  //   {
  //     path: "/listening",
  //     Component: ListeningPage,
  //   },
  {
    path: "/listening/overview",
    Component: ListeningOverviewPage,
  },
  //   {
  //     path: "/listening/test/:exerciseId",
  //     Component: ListeningTestPage,
  //   },
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
  //   // Evaluation test route
  //   {
  //     path: "/evaluation-test",
  //     Component: EvaluationTestPage,
  //   },
  //   // Admin routes - Practice Content Management
  //   {
  //     path: "/admin/content-management",
  //     element: (
  //       <ProtectedRoute allowedRoles={["administrator"]}>
  //         <PracticeContentManagementPage />
  //       </ProtectedRoute>
  //     ),
  //   },
  //   {
  //     path: "/admin/content/listening/add",
  //     element: (
  //       <ProtectedRoute allowedRoles={["administrator"]}>
  //         <ListeningContentEditorPage />
  //       </ProtectedRoute>
  //     ),
  //   },
  //   {
  //     path: "/admin/content/listening/edit/:exerciseId",
  //     element: (
  //       <ProtectedRoute allowedRoles={["administrator"]}>
  //         <ListeningContentEditorPage />
  //       </ProtectedRoute>
  //     ),
  //   },
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
  //   {
  //     path: "/admin/users",
  //     element: (
  //       <ProtectedRoute allowedRoles={["administrator"]}>
  //         <UserManagementPage />
  //       </ProtectedRoute>
  //     ),
  //   },
  //   // Catch-all route - redirect to home
  //   {
  //     path: "*",
  //     element: <Navigate to="/" replace />,
  //   },
]);
