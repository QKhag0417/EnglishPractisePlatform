import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";

interface Props {
  passageText: string;
  setPassageText: (value: string) => void;
}

export function PassageEditorBlock({
  passageText,
  setPassageText,
}: Props) {
  return (
    <div className="bg-white rounded-[12px] p-[32px] shadow-sm border border-gray-200">
      <Label className="font-['Inter'] font-semibold text-[16px] text-gray-900 mb-[16px] block">
        Passage
      </Label>


      {/* Passage Text */}
      <div>
        <Label className="font-['Inter'] font-medium text-[14px] text-gray-700 mb-[8px] block">
          Passage Text
        </Label>
        <Textarea
          value={passageText}
          onChange={(e) => setPassageText(e.target.value)}
          placeholder="Type or paste the passage text here..."
          className="min-h-[300px] resize-none font-['Inter']"
        />
      </div>
    </div>
  );
}