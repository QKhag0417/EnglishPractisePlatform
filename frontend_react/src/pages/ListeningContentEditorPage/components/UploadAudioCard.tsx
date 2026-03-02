import { Upload, X } from "lucide-react";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";

interface UploadAudioCardProps {
  audioPreview: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onRemove: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export function UploadAudioCard({
  audioPreview,
  onFileChange,
  onDrop,
  onDragOver,
  onRemove,
  inputRef,
}: UploadAudioCardProps) {
  return (
    <div className="bg-white rounded-[12px] p-[24px] shadow-sm border border-gray-200">
      <Label className="font-['Inter'] font-semibold text-[16px] text-gray-900 mb-[16px] block">
        Upload Audio
      </Label>

      {!audioPreview ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-[8px] p-[32px] text-center hover:border-[#1977f3] hover:bg-blue-50/30 transition-colors cursor-pointer"
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <Upload className="w-[48px] h-[48px] text-gray-400 mx-auto mb-[12px]" />
          <p className="font-['Inter'] text-[14px] text-gray-700 mb-[4px]">
            Drop file or browse
          </p>
          <p className="font-['Inter'] text-[12px] text-gray-500">
            Formats: .mp3, .wav
            <br />
            Max file size: 25 MB
          </p>

          <input
            type="file"
            ref={inputRef}
            onChange={onFileChange}
            className="hidden"
            accept=".mp3, .wav"
          />

          <Button
            onClick={() => inputRef.current?.click()}
            className="mt-[12px] bg-[#1977f3] hover:bg-[#1567d3] font-['Inter']"
          >
            Browse
          </Button>
        </div>
      ) : (
        <div>
          <div className="bg-gray-100 rounded-[8px] p-[16px] mb-[12px]">
            <audio src={audioPreview} controls className="w-full" />
          </div>

          <button
            onClick={onRemove}
            className="w-full font-['Inter'] text-[14px] text-red-600 hover:text-red-700 transition-colors"
          >
            Remove audio
          </button>
        </div>
      )}
    </div>
  );
}