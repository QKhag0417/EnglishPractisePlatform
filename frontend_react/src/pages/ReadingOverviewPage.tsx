import { NavBarLearner, NavBarGuest } from '../components/NavBar';
import { Footer } from '../components/Footer';
import { Page } from '../App';

interface ReadingOverviewPageProps {
  setCurrentPage: (page: Page) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export function ReadingOverviewPage({ setCurrentPage, isLoggedIn, onLogout }: ReadingOverviewPageProps) {
  return (
    <div className="bg-white min-h-screen">
      {isLoggedIn ? (
        <NavBarLearner setCurrentPage={setCurrentPage} onLogout={onLogout} />
      ) : (
        <NavBarGuest setCurrentPage={setCurrentPage} />
      )}

      <div className="pt-[100px] pb-[60px] px-[120px] max-w-[1400px] mx-auto">
        <h1 className="text-[#1e1e1e] mb-[24px]">
          What's in the IELTS Academic Reading paper?
        </h1>

        <p className="text-[#d2691e] mb-[32px]">
          There are three Reading passages and ALL must be completed in 60 minutes.
        </p>

        <div className="mb-[32px]">
          <p className="text-[#1e1e1e] mb-[16px]">
            The Reading test consists of <strong>40 questions</strong>, designed to test a wide range of reading skills. These include reading for gist, reading for main ideas, reading for detail, skimming, understanding logical argument and recognising writers' opinions, attitudes and purpose.
          </p>
          <p className="text-[#1e1e1e] mb-[16px]">
            The IELTS Academic Reading test contains three long texts which range from the descriptive and factual to the discursive and analytical. These are taken from books, journals, magazines and newspapers. They have been selected for a non-specialist audience but are appropriate for people entering university courses or seeking professional registration.
          </p>
        </div>

        <h2 className="text-[#1e1e1e] mb-[20px]">
          Question Types
        </h2>

        <p className="text-[#1e1e1e] mb-[16px]">
          A variety of question types are used, including:
        </p>

        <ul className="list-disc pl-[40px] mb-[32px] space-y-[8px]">
          <li className="text-[#1e1e1e]">Multiple choice</li>
          <li className="text-[#1e1e1e]">Identifying information (True/False/Not Given)</li>
          <li className="text-[#1e1e1e]">Identifying writer's views/claims (Yes/No/Not Given)</li>
          <li className="text-[#1e1e1e]">Matching information</li>
          <li className="text-[#1e1e1e]">Matching headings</li>
          <li className="text-[#1e1e1e]">Matching features</li>
          <li className="text-[#1e1e1e]">Matching sentence endings</li>
          <li className="text-[#1e1e1e]">Sentence completion</li>
          <li className="text-[#1e1e1e]">Summary/note/table/flow-chart completion</li>
          <li className="text-[#1e1e1e]">Diagram label completion</li>
          <li className="text-[#1e1e1e]">Short-answer questions</li>
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