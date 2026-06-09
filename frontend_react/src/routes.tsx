import { createBrowserRouter, Navigate } from "react-router";
import { HomePage } from "./pages/HomePage/HomePage";
import { BrowsePage } from "./pages/BrowsePage/BrowsePage";
import { ListeningOverviewPage } from "./pages/ListeningOverviewPage";
import { TestPage } from "./pages/TestPage/TestPage";
import { ReadingOverviewPage } from "./pages/ReadingOverviewPage";
import { WritingOverviewPage } from "./pages/WritingOverviewPage";
import { SpeakingOverviewPage } from "./pages/SpeakingOverviewPage";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { RegisterPage } from "./pages/RegisterPage/RegisterPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { AuthPromptPage } from "./pages/AuthPromptPage";
import { PracticeContentManagementPage } from "./pages/PracticeContentManagementPage/PracticeContentManagementPage.tsx";
import { UserManagementPage } from "./pages/UserManagementPage/UserManagementPage";
import { ListeningContentEditorPage } from "./pages/ListeningContentEditorPage/ListeningContentEditorPage.tsx";
import { ReadingContentEditorPage } from "./pages/ReadingContentEditorPage/ReadingContentEditorPage.tsx";
import { WritingContentEditorPage } from "./pages/WritingContentEditorPage/WritingContentEditorPage.tsx";
import { MyProfilePage } from "./pages/MyProfilePage/MyProfilePage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { TestResultPage } from "./pages/TestResultPage/TestResultPage";
import { IntroductionPage } from "./pages/IntroductionPage/IntroductionPage.tsx";
import { TutorDashboardPage } from "./pages/TutorDashboardPage/TutorDashboardPage.tsx";
import OAuth2Callback from "./pages/OAuth2Callback/OAuth2Callback.tsx";
import StudyPlanPage from "./pages/StudyPlanPage/StudyPlanPage.tsx";

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
    path: "/oauth2/callback",
    Component: OAuth2Callback,
  },
  {
    path: "/forgot-password",
    Component: ForgotPasswordPage,
  },
  {
    path: "/auth-prompt",
    Component: AuthPromptPage,
  },
  // User profile routes
  {
    path: "/my-profile/:section?",
    Component: MyProfilePage,
  },
  {
    path: "/study-plan",
    Component: StudyPlanPage,
  },
  // Learner routes
  {
    path: "/:skill/browse",
    Component: BrowsePage,
  },
  {
    path: "/listening/overview",
    Component: ListeningOverviewPage,
  },
  {
    path: "/reading/overview",
    Component: ReadingOverviewPage,
  },
  {
    path: "/writing/overview",
    Component: WritingOverviewPage,
  },
  {
    path: "/speaking/overview",
    Component: SpeakingOverviewPage,
  },
  {
    path: "/:skill/introduction/:exerciseId",
    Component: IntroductionPage,
  },
  {
    path: "/:skill/test/:exerciseId",
    Component: TestPage,
  },
  {
    path: "/test/result/:submissionId",
    Component: TestResultPage,
  },
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
    path: "/content-management",
    Component: PracticeContentManagementPage,
  },
  {
    path: "/content/listening/add",
    Component: ListeningContentEditorPage,
  },
  {
    path: "/content/listening/edit/:exerciseId",
    Component: ListeningContentEditorPage,
  },
  {
    path: "/content/reading/add",
    Component: ReadingContentEditorPage,
  },
  {
    path: "/content/reading/edit/:exerciseId",
    Component: ReadingContentEditorPage,
  },
  {
    path: "/content/writing/add",
    Component: WritingContentEditorPage,
  },
  {
    path: "/content/writing/edit/:exerciseId",
    Component: WritingContentEditorPage,
  },
  //   {
  //     path: "/content/speaking/add",
  //     element: (
  //       <ProtectedRoute allowedRoles={["administrator"]}>
  //         <SpeakingContentEditorPage />
  //       </ProtectedRoute>
  //     ),
  //   },
  //   {
  //     path: "/content/speaking/edit/:exerciseId",
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
  // Tutor routes
  {
    path: "/tutor/dashboard",
    Component: TutorDashboardPage,
  },
  // Catch-all route - redirect to home
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
