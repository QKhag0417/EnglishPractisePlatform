import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface Props {
  onAddNew: () => void;
}

export function PracticeContentHeader({ onAddNew }: Props) {
  return (
    <div className="flex items-center justify-between mb-[24px]">
      <div>
        <h1 className="font-['Inter'] text-[#1977f3] text-[36px]">
          Practice Content Management
        </h1>
        <p className="text-gray-600 text-[16px]">
          Manage practice content for learners
        </p>
      </div>

      <Button onClick={onAddNew} className="bg-[#1977f3] hover:bg-[#1567d3]">
        <Plus className="w-5 h-5 mr-2" />
        Add New Content
      </Button>
    </div>
  );
}
