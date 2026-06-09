import { useEffect, useMemo, useState } from "react";
import { usePracticeContentApi } from "./usePracticeContentApi";

import {
  normalizeSkill,
  normalizeStatus,
  normalizeUpdatedOn,
} from "../utils/normalizers";
import { PracticeContentMetadata } from "../types";
import { NavigateFunction } from "react-router";

export function usePracticeContentState(navigate: NavigateFunction) {
  const { fetchMetadata, deletePracticeContent } = usePracticeContentApi();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterSkill, setFilterSkill] = useState<string>("all");
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [contents, setContents] = useState<PracticeContentMetadata[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const result = await fetchMetadata();

        if (!result.ok) {
          console.error("API failed:", result.message);
          return;
        }

        const dtos = result.data ?? [];

        const mapped: PracticeContentMetadata[] = dtos.map((dto: any) => ({
          id: dto.id,
          title: dto.title ?? "",
          skill: normalizeSkill(dto.skill),
          updatedOn: normalizeUpdatedOn(dto.updatedOn),

          questions: Number(dto.questionCount ?? 0),
          duration: Number(dto.durationMinutes ?? 0),

          attempts: Number(dto.attemptCount ?? 0),
          status: normalizeStatus(dto.status),
        }));

        setContents(mapped);
      } catch (err) {
        console.error("Failed to fetch metadata:", err);
      }
    })();
  }, []);

  const filteredContents = useMemo(() => {
    return contents.filter((content) => {
      const matchesSearch = content.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesSkill =
        filterSkill === "all" || content.skill === filterSkill;

      return matchesSearch && matchesSkill;
    });
  }, [contents, searchQuery, filterSkill]);

  const handleDelete = async (id: string) => {
    try {
      const result = await deletePracticeContent(id);

      if (!result.ok) {
        console.error("Delete failed:", result.message);
        alert(result.message);
        return;
      }
      setContents((prev) => prev.filter((c) => c.id !== id));

      console.log("Deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Something went wrong while deleting.");
    }
  };

  const handleEdit = (content: PracticeContentMetadata) => {
    navigate(`/content/${content.skill.toLowerCase()}/edit/${content.id}`);
  };

  const handleAddNew = () => {
    setIsSkillModalOpen(true);
  };

  const handleSkillSelect = (
    skill: "Listening" | "Reading" | "Writing" | "Speaking",
  ) => {
    setIsSkillModalOpen(false);

    // DELETE: delete this when Speaking is implemented
    if (skill === "Speaking") {
      return;
    }

    navigate(`/content/${skill.toLowerCase()}/add`);
  };

  return {
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
  };
}
