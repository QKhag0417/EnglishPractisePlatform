import { PracticeContentHeader } from "./components/PracticeContentHeader";
import { PracticeContentFilter } from "./components/PracticeContentFilter";
import { PracticeContentTable } from "./components/PracticeContentTable";
import { Footer } from "../../components/Footer";
import { useNavigate } from "react-router";
import { usePracticeContentState } from "./hooks/usePracticeContentState";
import { SkillSelectionModal } from "../../components/SkillSelectionModal";
import { NavBarUnified } from "../../components/NavBarUnified";
import { StatisticsCards } from "./components/StatisticsCards";

export function PracticeContentManagementPage() {
  const navigate = useNavigate();

  const {
    searchQuery,
    setSearchQuery,
    filterSkill,
    setFilterSkill,
    filteredContents,
    handleDelete,
    handleEdit,
    handleAddNew,
    isSkillModalOpen,
    setIsSkillModalOpen,
    handleSkillSelect,
  } = usePracticeContentState(navigate);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <NavBarUnified />

      <div className="flex-1 pt-[100px] pb-[60px] px-[60px]">
        <div className="max-w-[1400px] mx-auto">
          <PracticeContentHeader onAddNew={handleAddNew} />

          <StatisticsCards contents={filteredContents} />

          <PracticeContentFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterSkill={filterSkill}
            setFilterSkill={setFilterSkill}
          />

          <PracticeContentTable
            contents={filteredContents}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <SkillSelectionModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        onSkillSelect={handleSkillSelect}
      />

      <Footer />
    </div>
  );
}
