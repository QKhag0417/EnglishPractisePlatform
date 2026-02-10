import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Footer } from "../components/Footer";
import { NavBarAdmin } from "../components/NavBarAdmin";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { SkillSelectionModal } from "../components/SkillSelectionModal";
import { useEffect } from "react";
import { API_BASE } from "../env";

import {
  PracticeContentMetadata,
  mockPracticeContentMetadata,
} from "../mocks/practiceContentMetadata.mock";

export function PracticeContentManagementPage() {
  // =========================
  // Auth + navigation actions
  // =========================
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // =========================
  // UI state (filters + modal)
  // =========================
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSkill, setFilterSkill] = useState<string>("all");
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);

  // =========================
  // Data state
  // =========================
  const [contents, setContents] = useState<PracticeContentMetadata[]>([]);

  // =========================
  // Normalizers (API DTO -> UI model)
  // =========================
  const normalizeSkill = (s: unknown): PracticeContentMetadata["skill"] => {
    switch (String(s ?? "").toUpperCase()) {
      case "LISTENING":
        return "Listening";
      case "READING":
        return "Reading";
      case "WRITING":
        return "Writing";
      case "SPEAKING":
        return "Speaking";
      default:
        return "Reading";
    }
  };

  const normalizeStatus = (s: unknown): PracticeContentMetadata["status"] => {
    switch (String(s ?? "").toUpperCase()) {
      case "PUBLISHED":
        return "Published";
      case "DRAFT":
        return "Draft";
      default:
        return "Draft";
    }
  };

  const normalizeUpdatedOn = (v: unknown): string => {
    // If backend is later configured to return ISO string, accept it.
    if (typeof v === "string") return v;

    // Current backend returns LocalDateTime as array:
    // [year, month, day, hour, minute, second, nano]
    if (Array.isArray(v)) {
      const [y, m, d, hh = 0, mm = 0, ss = 0, nano = 0] = v as number[];
      const ms = Math.floor((nano ?? 0) / 1_000_000);
      const date = new Date(y, (m ?? 1) - 1, d ?? 1, hh, mm, ss, ms);
      return date.toISOString();
    }

    return "";
  };

  // =========================
  // Data fetching (load practice content metadata)
  // =========================
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/practice-content/metadata/v2`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
            credentials: "include",
          },
        );

        const json = await res.json();
        const dtos = json?.data;

        if (!Array.isArray(dtos)) return;

        const mapped: PracticeContentMetadata[] = dtos.map((dto: any) => ({
          id: dto.id,
          title: dto.title ?? "",
          skill: normalizeSkill(dto.skill),
          updatedOn: normalizeUpdatedOn(dto.updatedOn),
          questions: Number(dto.questions ?? 0),
          duration: Number(dto.duration ?? 0),
          attempts: Number(dto.attempts ?? 0),
          status: normalizeStatus(dto.status),
        }));

        setContents(mapped);
      } catch (err) {
        console.error("Failed to fetch practice content metadata v2:", err);
      }
    })();
  }, []);

  // =========================
  // Derived view data (filtering)
  // =========================
  const filteredContents = contents.filter((content) => {
    const matchesSearch = content.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesSkill = filterSkill === "all" || content.skill === filterSkill;
    return matchesSearch && matchesSkill;
  });

  // =========================
  // Content actions (delete/edit)
  // =========================
  const handleDelete = (id: string) => {
    setContents(contents.filter((c) => c.id !== id));
  };

  // Navigate to Edit Exercise screen based on the content's skill
  // On click: navigate to corresponding Edit [Skill] Exercise screen (no popup)
  const handleEdit = (content: PracticeContentMetadata) => {
    if (content.skill === "Listening") {
      navigate(`/admin/content/listening/edit/${content.id}`);
    } else if (content.skill === "Reading") {
      navigate(`/admin/content/reading/edit/${content.id}`);
    } else if (content.skill === "Writing") {
      navigate(`/admin/content/writing/edit/${content.id}`);
    } else if (content.skill === "Speaking") {
      navigate(`/admin/content/speaking/edit/${content.id}`);
    }
  };

  // =========================
  // Create-new flow (open modal + select skill)
  // =========================
  const handleAddNew = () => {
    setIsSkillModalOpen(true);
  };

  const handleSkillSelect = (
    skill: "Listening" | "Reading" | "Writing" | "Speaking",
  ) => {
    // Close the modal
    setIsSkillModalOpen(false);

    // Navigate to skill-specific content creation page
    if (skill === "Listening") {
      navigate("/admin/content/listening/add");
    } else if (skill === "Reading") {
      navigate("/admin/content/reading/add");
    } else if (skill === "Writing") {
      navigate("/admin/content/writing/add");
    } else if (skill === "Speaking") {
      navigate("/admin/content/speaking/add");
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <NavBarAdmin onLogout={handleLogout} />

      <div className="flex-1 pt-[100px] pb-[60px] px-[60px]">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between mb-[40px]">
            <h1 className="font-['Inter'] text-[#1977f3] text-[36px]">
              Practice Content Management
            </h1>
            <Button
              onClick={handleAddNew}
              className="bg-[#1977f3] hover:bg-[#1567d3]"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Content
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-[20px] mb-[30px]">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterSkill} onValueChange={setFilterSkill}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skills</SelectItem>
                <SelectItem value="Listening">Listening</SelectItem>
                <SelectItem value="Reading">Reading</SelectItem>
                <SelectItem value="Writing">Writing</SelectItem>
                <SelectItem value="Speaking">Speaking</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content Table */}
          <div className="bg-white border rounded-[12px] overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Skill</TableHead>
                  <TableHead>Updated On</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Attempts</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContents.map((content) => (
                  <TableRow key={content.id}>
                    <TableCell className="font-medium">
                      {content.title}
                    </TableCell>
                    <TableCell>{content.skill}</TableCell>
                    <TableCell>{content.updatedOn}</TableCell>
                    <TableCell>{content.questions}</TableCell>
                    <TableCell>{content.duration} min</TableCell>
                    <TableCell>{content.attempts}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          content.status === "Published" ? "default" : "outline"
                        }
                      >
                        {content.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {/* Edit icon: navigates to Edit [Skill] Exercise screen */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(content)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(content.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Skill Selection Modal */}
      <SkillSelectionModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        onSkillSelect={handleSkillSelect}
      />

      <Footer />
    </div>
  );
}
