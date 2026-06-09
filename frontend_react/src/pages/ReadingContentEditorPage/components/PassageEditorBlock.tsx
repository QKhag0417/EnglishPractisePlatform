import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";

interface Props {
  passageText: string;
  setPassageText: (value: string) => void;
}

export function PassageEditorBlock({ passageText, setPassageText }: Props) {
  return (
    <div className="bg-white rounded-[12px] p-[32px] shadow-sm border border-gray-200">
      <Label className="font-['Inter'] font-semibold text-[16px] text-gray-900 mb-[16px] block">
        Passage Text
      </Label>

      {/* Passage Text */}
      <div>
        <Textarea
          value={passageText}
          onChange={(e) => setPassageText(e.target.value)}
          placeholder="Type or paste the passage text here..."
          className="min-h-[120px] border border-gray-300 rounded-[8px] resize-none font-['Inter'] bg-white
          focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
    </div>
  );
}
