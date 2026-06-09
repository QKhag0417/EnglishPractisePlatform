import { Upload, X, Check } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";

interface UploadThumbnailCardProps {
  thumbnailPreview: string | null;
  thumbnailSaved: boolean;

  onBrowseClick: () => void;
  onRemove: () => void;
  onSave: () => void;

  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;

  inputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function UploadThumbnailCard({
  thumbnailPreview,
  thumbnailSaved,
  onBrowseClick,
  onRemove,
  onSave,
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
        <div>
          <div className="relative mb-[12px]">
            <img
              src={thumbnailPreview}
              alt="Thumbnail preview"
              className="w-full h-[180px] object-cover rounded-[8px]"
            />
          </div>

          {!thumbnailSaved ? (
            <Button
              onClick={onSave}
              className="w-full bg-[#1977f3] hover:bg-[#1567d3] font-['Inter'] text-[14px]"
              size="sm"
            >
              <Check className="w-[14px] h-[14px] mr-[6px]" />
              Save
            </Button>
          ) : (
            <Button
              onClick={onRemove}
              variant="outline"
              className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-400 font-['Inter'] text-[14px]"
              size="sm"
            >
              <X className="w-[14px] h-[14px] mr-[6px]" />
              Remove
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
