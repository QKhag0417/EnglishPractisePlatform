import { Button } from "../../../components/ui/button";

interface EditorHeaderProps {
  isEditMode: boolean;
  status: "Draft" | "Published";
  onStatusChange: (value: "Draft" | "Published") => void;
  onCancel: () => void;
  onSaveExit: () => void;
  disableCancel?: boolean;
}

export function EditorHeader({
  isEditMode,
  status,
  onStatusChange,
  onCancel,
  onSaveExit,
  disableCancel,
}: EditorHeaderProps) {
  return (
    <div className="pt-[80px] pb-[20px] px-[60px] bg-white border-b border-gray-200">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="font-['Inter'] text-[32px] text-gray-900">
            {isEditMode ? "Edit Listening Exercise" : "Add Listening Exercise"}
          </h1>

          <div className="flex items-center gap-[12px]">
            {/* Draft / Published toggle */}
            <div className="flex gap-[8px] bg-gray-100 rounded-[8px] p-[4px]">
              <button
                onClick={() => onStatusChange("Draft")}
                className={`px-[16px] py-[6px] rounded-[6px] font-['Inter'] font-medium text-[14px] transition-colors ${
                  status === "Draft"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Draft
              </button>

              <button
                onClick={() => onStatusChange("Published")}
                className={`px-[16px] py-[6px] rounded-[6px] font-['Inter'] font-medium text-[14px] transition-colors ${
                  status === "Published"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Published
              </button>
            </div>

            <Button
              onClick={onCancel}
              disabled={disableCancel}
              variant="outline"
              className="font-['Inter'] text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              Cancel
            </Button>

            <Button
              onClick={onSaveExit}
              className="bg-[#1977f3] hover:bg-[#1567d3] font-['Inter']"
            >
              Save & Exit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
