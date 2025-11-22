import { NavBarLearner, NavBarGuest } from '../components/NavBar';
import { Footer } from '../components/Footer';
import { Page } from '../App';

interface ListeningOverviewPageProps {
  setCurrentPage: (page: Page) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export function ListeningOverviewPage({ setCurrentPage, isLoggedIn, onLogout }: ListeningOverviewPageProps) {
  return (
    <div className="bg-white min-h-screen">
      {isLoggedIn ? (
        <NavBarLearner setCurrentPage={setCurrentPage} onLogout={onLogout} />
      ) : (
        <NavBarGuest setCurrentPage={setCurrentPage} />
      )}

      <div className="pt-[100px] pb-[60px] px-[120px] max-w-[1400px] mx-auto">
        <h1 className="text-[#1e1e1e] mb-[24px]">
          What's in the IELTS Academic Listening paper?
        </h1>

        <p className="text-[#d2691e] mb-[32px]">
          There are four Listening sections and ALL must be completed.
        </p>

        <div className="mb-[32px]">
          <p className="text-[#1e1e1e] mb-[16px]">
            In Section 1, you will hear <strong>a conversation between two people set in an everyday social context</strong> (for example, a conversation about travel arrangements).
          </p>
          <p className="text-[#1e1e1e] mb-[16px]">
            In Section 2, you will hear <strong>a monologue set in an everyday social context</strong> (for example, a speech about local facilities or a talk about arrangements for a meal).
          </p>
          <p className="text-[#1e1e1e] mb-[16px]">
            In Section 3, you will hear <strong>a conversation between up to four people set in an educational or training context</strong> (for example, a university tutor and student discussing an assignment).
          </p>
          <p className="text-[#1e1e1e] mb-[16px]">
            In Section 4, you will hear <strong>a monologue on an academic subject</strong> (for example, a university lecture).
          </p>
        </div>

        <div className="mb-[32px]">
          <p className="text-[#1e1e1e] mb-[16px]">
            Each section is heard only once. You will have time to read the questions before you listen and also time to check your answers. The recording lasts approximately 30 minutes, with 10 minutes to transfer your answers to the answer sheet.
          </p>
        </div>

        <h2 className="text-[#1e1e1e] mb-[20px]">
          Question Types
        </h2>

        <p className="text-[#1e1e1e] mb-[16px]">
          You will answer 40 questions in total. A variety of question types are used, including:
        </p>

        <ul className="list-disc pl-[40px] mb-[32px] space-y-[8px]">
          <li className="text-[#1e1e1e]">Multiple choice</li>
          <li className="text-[#1e1e1e]">Matching</li>
          <li className="text-[#1e1e1e]">Plan/map/diagram labelling</li>
          <li className="text-[#1e1e1e]">Form/note/table/flow-chart/summary completion</li>
          <li className="text-[#1e1e1e]">Sentence completion</li>
        </ul>

        <h2 className="text-[#1e1e1e] mb-[20px]">
          Marking
        </h2>

        <p className="text-[#1e1e1e] mb-[16px]">
          Each question is worth one mark. Scores out of 40 are converted to the IELTS 9-band scale. Scores are reported in whole and half bands.
        </p>
      </div>

      <Footer />
    </div>
  );
}