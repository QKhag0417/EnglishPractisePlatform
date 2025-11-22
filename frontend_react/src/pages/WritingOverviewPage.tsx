import { NavBarLearner, NavBarGuest } from '../components/NavBar';
import { Footer } from '../components/Footer';
import { Page } from '../App';

interface WritingOverviewPageProps {
  setCurrentPage: (page: Page) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export function WritingOverviewPage({ setCurrentPage, isLoggedIn, onLogout }: WritingOverviewPageProps) {
  return (
    <div className="bg-white min-h-screen">
      {isLoggedIn ? (
        <NavBarLearner setCurrentPage={setCurrentPage} onLogout={onLogout} />
      ) : (
        <NavBarGuest setCurrentPage={setCurrentPage} />
      )}

      <div className="pt-[100px] pb-[60px] px-[120px] max-w-[1400px] mx-auto">
        <h1 className="text-[#1e1e1e] mb-[24px]">
          What's in the IELTS Academic Writing paper?
        </h1>

        <p className="text-[#d2691e] mb-[32px]">
          There are two Writing tasks and BOTH must be completed.
        </p>

        <div className="mb-[32px]">
          <p className="text-[#1e1e1e] mb-[16px]">
            In Task 1, you have to <strong>describe some visual information in your own words</strong> (a graph, table, chart or diagram). You need to write at least 150 words in about 20 minutes.
          </p>
          <p className="text-[#1e1e1e] mb-[16px]">
            In Task 2, you are given <strong>a point of view, argument or problem which you need to discuss</strong>. You need to write at least 250 words in about 40 minutes.
          </p>
        </div>

        <div className="mb-[32px]">
          <p className="text-[#1e1e1e] mb-[16px]">
            You must write your answers using full sentences. You must not write your answers as notes or bullet points. You must write your answers on the answer sheet. You are allowed to write notes on the question paper, but these will not be seen by the examiner.
          </p>
        </div>

        <h2 className="text-[#1e1e1e] mb-[20px]">
          Marking
        </h2>

        <p className="text-[#1e1e1e] mb-[16px]">
          Certificated IELTS examiners assess your performance on each Writing task. There are four assessment criteria (things which the examiner thinks about when deciding what score to give you):
        </p>

        <ul className="list-disc pl-[40px] mb-[32px] space-y-[8px]">
          <li className="text-[#1e1e1e]">Task achievement/response</li>
          <li className="text-[#1e1e1e]">Coherence and cohesion</li>
          <li className="text-[#1e1e1e]">Lexical resource</li>
          <li className="text-[#1e1e1e]">Grammatical range and accuracy.</li>
        </ul>

        <p className="text-[#1e1e1e] mb-[16px]">
          <strong className="italic">Task achievement</strong> (in Task 1) and <strong className="italic">Task response</strong> (in Task 2) assess how accurately, appropriately and relevantly your response covers the task requirements, using the minimum of 150 words for Task 1 and 250 words for Task 2.
        </p>
      </div>

      <Footer />
    </div>
  );
}