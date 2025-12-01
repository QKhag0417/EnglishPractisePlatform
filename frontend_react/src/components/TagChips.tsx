import { useState, useRef, useEffect } from 'react';

interface TagChipsProps {
  tags: string[];
  colorClass?: string; // e.g., 'bg-blue-100', 'bg-gray-100'
  maxVisible?: number;
  popoverPosition?: 'left' | 'right'; // Controls which side the popover anchors to
}

export function TagChips({ tags, colorClass = 'bg-gray-100', maxVisible = 2, popoverPosition = 'left' }: TagChipsProps) {
  // Cap total tags at 4 to prevent scrolling
  const cappedTags = tags.slice(0, 4);
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current && 
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowPopover(false);
      }
    };

    if (showPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopover]);

  // If there's only 1 tag, show it normally without dropdown
  if (cappedTags.length === 1) {
    return (
      <>
        {cappedTags.map((tag) => (
          <span 
            key={tag}
            className={`px-[12px] py-[4px] ${colorClass} rounded-[6px] font-['Inter'] text-[14px] text-black`}
          >
            {tag}
          </span>
        ))}
      </>
    );
  }

  // If there are 2+ tags, show only the first tag + "+X more" chip
  const visibleTags = cappedTags.slice(0, 1);
  const remainingCount = cappedTags.length - 1;

  return (
    <>
      {visibleTags.map((tag) => (
        <span 
          key={tag}
          className={`px-[12px] py-[4px] ${colorClass} rounded-[6px] font-['Inter'] text-[14px] text-black`}
        >
          {tag}
        </span>
      ))}
      
      {/* +X more chip */}
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => setShowPopover(!showPopover)}
          className="px-[12px] py-[4px] bg-gray-50 border border-gray-300 rounded-[6px] font-['Inter'] text-[14px] text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          +{remainingCount} more
        </button>

        {/* Popover */}
        {showPopover && (
          <div 
            ref={popoverRef}
            className={`absolute top-[calc(100%+8px)] ${popoverPosition === 'right' ? 'right-0' : 'left-0'} bg-white border border-gray-200 rounded-[8px] shadow-lg z-50 min-w-[200px] max-w-[280px] p-[12px]`}
          >
            <div className="flex flex-col gap-[8px]">
              {cappedTags.map((tag) => (
                <span 
                  key={tag}
                  className={`px-[12px] py-[4px] ${colorClass} rounded-[6px] font-['Inter'] text-[14px] text-black inline-block`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
