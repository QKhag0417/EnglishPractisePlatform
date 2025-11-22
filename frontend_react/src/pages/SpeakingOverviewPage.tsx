import { NavBarLearner, NavBarGuest } from '../components/NavBar';
import { Footer } from '../components/Footer';
import { Page } from '../App';

interface SpeakingOverviewPageProps {
  setCurrentPage: (page: Page) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export function SpeakingOverviewPage({ setCurrentPage, isLoggedIn, onLogout }: SpeakingOverviewPageProps) {
  return (
    <div className="bg-white min-h-screen">
      {isLoggedIn ? (
        <NavBarLearner setCurrentPage={setCurrentPage} onLogout={onLogout} />
      ) : (
        <NavBarGuest setCurrentPage={setCurrentPage} />
      )}

      <div className="pt-[100px] pb-[60px] px-[120px] max-w-[1400px] mx-auto">
        <h1 className="text-[#1e1e1e] mb-[24px]">
          What's in the IELTS Academic Speaking test?
        </h1>

        <p className="text-[#d2691e] mb-[32px]">
          There are three Speaking parts and ALL must be completed in 11-14 minutes.
        </p>

        <div className="mb-[32px]">
          <p className="text-[#1e1e1e] mb-[16px]">
            In Part 1 (Introduction and interview), the examiner will <strong>ask you general questions about yourself and a range of familiar topics</strong>, such as home, family, work, studies and interests. This part lasts 4-5 minutes.
          </p>
          <p className="text-[#1e1e1e] mb-[16px]">
            In Part 2 (Long turn), you will be given a card which asks you to <strong>talk about a particular topic</strong>. You will have one minute to prepare before speaking for up to two minutes. The examiner will then ask one or two questions on the same topic. This part lasts 3-4 minutes.
          </p>
          <p className="text-[#1e1e1e] mb-[16px]">
            In Part 3 (Discussion), you will be asked <strong>further questions about the topic in Part 2</strong>. These will give you the opportunity to discuss more abstract ideas and issues. This part lasts 4-5 minutes.
          </p>
        </div>

        <div className="mb-[32px]">
          <p className="text-[#1e1e1e] mb-[16px]">
            The Speaking test is the same for both Academic and General Training tests. Your speaking performance is assessed by certificated IELTS examiners. The test is recorded.
          </p>
        </div>

        <h2 className="text-[#1e1e1e] mb-[20px]">
          Marking
        </h2>

        <p className="text-[#1e1e1e] mb-[16px]">
          Certificated IELTS examiners assess your performance using four assessment criteria:
        </p>

        <ul className="list-disc pl-[40px] mb-[32px] space-y-[8px]">
          <li className="text-[#1e1e1e]">Fluency and coherence</li>
          <li className="text-[#1e1e1e]">Lexical resource</li>
          <li className="text-[#1e1e1e]">Grammatical range and accuracy</li>
          <li className="text-[#1e1e1e]">Pronunciation</li>
        </ul>

        <p className="text-[#1e1e1e] mb-[16px]">
          Each criterion contributes 25% to your overall Speaking band score. Scores are reported in whole and half bands.
        </p>
      </div>

      <Footer />
    </div>
  );
}