import { Button } from "../../../components/ui/button";
import { Plus, Check, X, Image } from "lucide-react";
import { API_BASE } from "../../../env";

interface UploadedImage {
  id: string;
  file?: File;
  preview: string;
  url?: string;
  saved: boolean;
}

interface Props {
  multiImageInputRef: React.RefObject<HTMLInputElement>;
  uploadedImages: UploadedImage[];
  handleMultiImageChange: any;
  handleSaveImage: (id: string) => void;
  handleRemoveImage: (id: string) => void;
  handleCopyUrl: (url: string) => void;
}

export function SupportingImagesBlock({
  multiImageInputRef,
  uploadedImages,
  handleMultiImageChange,
  handleSaveImage,
  handleRemoveImage,
  handleCopyUrl,
}: Props) {
  return (
    <div className="bg-white rounded-[12px] p-[32px] shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-[20px]">
        <div>
          <h3 className="font-['Inter'] font-semibold text-[18px] text-gray-900">
            Supporting Images
          </h3>
          <p className="font-['Inter'] text-[12px] text-gray-500 mt-[4px]">
            Upload images to reference in questions (diagrams, charts, etc.)
          </p>
        </div>
        <Button
          onClick={() => multiImageInputRef.current?.click()}
          size="sm"
          className="bg-[#1977f3] hover:bg-[#1567d3]"
        >
          <Plus className="w-[16px] h-[16px] mr-[6px]" />
          Add Images
        </Button>
      </div>

      <input
        type="file"
        multiple
        accept=".jpg,.jpeg,.png"
        ref={multiImageInputRef}
        onChange={handleMultiImageChange}
        className="hidden"
      />

      {uploadedImages.length > 0 ? (
        <div className="grid grid-cols-2 gap-[16px]">
          {uploadedImages.map((image) => (
            <div
              key={image.id}
              className="border border-gray-200 rounded-[8px] overflow-hidden"
            >
              <div className="relative">
                <img
                  src={image.preview}
                  alt="Uploaded"
                  className="w-full h-[140px] object-cover"
                />
              </div>
              {/* Image URL Display */}
              {image.saved && image.url && (
                <div className="px-[12px] py-[8px] bg-gray-50 border-t border-gray-200">
                  <p className="font-['Inter'] text-[10px] text-gray-500 mb-[4px]">
                    Image URL:
                  </p>
                  <div className="flex items-center gap-[4px]">
                    <input
                      type="text"
                      value={image.url}
                      readOnly
                      className="flex-1 px-[8px] py-[4px] bg-white border border-gray-200 rounded-[4px] font-['Inter'] text-[11px] text-gray-700"
                    />
                    <button
                      onClick={() => handleCopyUrl(image.url || "")}
                      className="p-[4px] hover:bg-gray-200 rounded-[4px] transition-colors"
                      title="Copy URL"
                    >
                      <svg
                        className="w-[14px] h-[14px] text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              <div className="px-[12px] py-[10px] border-t border-gray-200">
                {!image.saved ? (
                  <Button
                    onClick={() => handleSaveImage(image.id)}
                    className="w-full bg-[#1977f3] hover:bg-[#1567d3] font-['Inter'] text-[12px] h-[32px]"
                  >
                    <Check className="w-[12px] h-[12px] mr-[6px]" />
                    Save
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => handleRemoveImage(image.id)}
                      variant="outline"
                      className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-400 font-['Inter'] text-[12px] h-[32px]"
                    >
                      <X className="w-[12px] h-[12px] mr-[6px]" />
                      Remove
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-[8px] p-[32px] text-center">
          <Image className="w-[48px] h-[48px] text-gray-400 mx-auto mb-[12px]" />
          <p className="font-['Inter'] text-[14px] text-gray-700 mb-[4px]">
            No images uploaded
          </p>
          <p className="font-['Inter'] text-[12px] text-gray-500">
            Click "Add Images" to upload supporting images
          </p>
        </div>
      )}
    </div>
  );
}
