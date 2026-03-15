import { NavBarLearner } from "../../components/NavBar";
import { Footer } from "../../components/Footer";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { useParams } from "react-router-dom";

import {
  formatTime,
  indexByOrderIndex,
  mapPracticeSkill,
  formatLocalDateTime,
} from "./utils";
import { useEffect } from "react";
import {
  useGetPracticeContentAnswers,
  useGetPracticeSubmission,
  useGetPracticeSubmissionAnswers,
  useGetPracticeContent,
  useGetUserData,
} from "./hooks";
import { CheckCircle, Clock, Key, Target, TrendingUp } from "lucide-react";
import { ListeningReadingResultScreen } from "./components/ListeningReadingResultScreen.tsx";
import { WritingResultScreen } from "./components/WritingResultScreen.tsx";

export function TestResultPage() {
  // =========================
  // Submission id from URL
  // =========================

  const { submissionId } = useParams();

  // =========================
  // Get practice submission data
  // =========================

  const getPracticeSubmission = useGetPracticeSubmission(submissionId || "");

  useEffect(() => {
    if (!submissionId) return;
    getPracticeSubmission.get();
  }, [submissionId, getPracticeSubmission.get]);

  // =========================
  // Get exercise data
  // =========================

  const practiceContentId = getPracticeSubmission.submission?.practiceContentId;

  const getPracticeContent = useGetPracticeContent(practiceContentId || "");

  useEffect(() => {
    if (!practiceContentId) return;
    getPracticeContent.get();
  }, [practiceContentId, getPracticeContent.get]);

  const skill = getPracticeContent.practiceContent?.skill;

  // =========================
  // Listening/Reading
  // =========================

  if (skill === "LISTENING" || skill === "READING") {
    return <ListeningReadingResultScreen submissionId={submissionId!} />;
  } else if (skill === "WRITING") {
    return <WritingResultScreen submissionId={submissionId!} />;
  } else if (skill === "SPEAKING") {
    // return <SpeakingResultScreen submissionId={submissionId!} />;
  }
}
