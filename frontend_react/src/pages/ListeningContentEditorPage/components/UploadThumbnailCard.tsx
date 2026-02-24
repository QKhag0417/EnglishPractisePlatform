import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface UploadThumbnailCardProps {
  thumbnailPreview: string | null;
  onBrowseClick: () => void;
  onRemove: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function UploadThumbnailCard({
  thumbnailPreview,
  onBrowseClick,
  onRemove,
  onDrop,
  onDragOver,
  inputRef,
  onFileChange,
}: UploadThumbnailCardProps) {
  return (
    <div className="bg-white rounded-[12px] p-[24px] shadow-sm border border-gray-200">
      <Label className="font-['Inter'] font-semibold text-[16px] text-gray-900 mb-[16px] block">
        Upload Thumbnail
      </Label>

      {!thumbnailPreview ? (
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
            Formats: .jpg, .png
            <br />
            Max file size: 25 MB
          </p>

          <input
            type="file"
            ref={inputRef}
            onChange={onFileChange}
            className="hidden"
            accept=".jpg, .png"
          />

          <Button
            onClick={onBrowseClick}
            className="mt-[12px] bg-[#1977f3] hover:bg-[#1567d3] font-['Inter']"
          >
            Browse
          </Button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={thumbnailPreview}
            alt="Thumbnail preview"
            className="w-full h-[180px] object-cover rounded-[8px]"
          />

          <button
            onClick={onRemove}
            className="absolute top-[8px] right-[8px] bg-white rounded-full p-[6px] shadow-md hover:bg-gray-100 transition-colors"
          >
            <X className="w-[16px] h-[16px] text-gray-700" />
          </button>
        </div>
      )}
    </div>
  );
}