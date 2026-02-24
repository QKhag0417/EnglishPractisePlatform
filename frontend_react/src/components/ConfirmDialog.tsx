import { Button } from './ui/button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onClose,
  confirmText = 'Delete',
  cancelText = 'Cancel',
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Dialog */}
        <div 
          className="bg-white rounded-[12px] p-[32px] max-w-[480px] w-full mx-[20px] shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Title */}
          <h2 className="font-['Inter'] text-[20px] font-semibold text-gray-900 mb-[12px]">
            {title}
          </h2>

          {/* Message */}
          <p className="font-['Inter'] text-[14px] text-gray-600 mb-[24px]">
            {message}
          </p>

          {/* Buttons */}
          <div className="flex gap-[12px] justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="font-['Inter'] h-[40px] px-[24px]"
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              className="bg-red-600 hover:bg-red-700 font-['Inter'] h-[40px] px-[24px]"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}