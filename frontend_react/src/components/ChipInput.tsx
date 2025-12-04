import { useState, useRef, KeyboardEvent, forwardRef, useImperativeHandle } from 'react';
import { X } from 'lucide-react';

interface ChipInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

export interface ChipInputRef {
  focus: () => void;
}

export const ChipInput = forwardRef<ChipInputRef, ChipInputProps>(({ 
  value, 
  onChange, 
  placeholder = "Add tag...", 
  maxTags = 4 
}, ref) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    }
  }));

  const handleAddTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && value.length < maxTags && !value.includes(trimmedValue)) {
      onChange([...value, trimmedValue]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const isAtMaxTags = value.length >= maxTags;

  return (
    <div>
      <div className="min-h-[40px] px-[12px] py-[8px] bg-white border border-gray-300 rounded-[8px] flex flex-wrap items-center gap-[8px]">
        {/* Existing tags */}
        {value.map((tag) => (
          <div
            key={tag}
            className="inline-flex items-center gap-[6px] px-[10px] py-[4px] bg-gray-100 hover:bg-gray-200 rounded-[6px] font-['Inter'] text-[14px] text-gray-900 transition-colors"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="flex items-center justify-center hover:text-gray-700 transition-colors"
            >
              <X className="w-[14px] h-[14px]" />
            </button>
          </div>
        ))}

        {/* Input chip */}
        {!isAtMaxTags && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleAddTag}
            placeholder={value.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] outline-none bg-transparent font-['Inter'] text-[14px] text-gray-900 placeholder:text-gray-400"
          />
        )}
      </div>

      {/* Helper text when at max */}
      {isAtMaxTags && (
        <p className="mt-[6px] font-['Inter'] text-[12px] text-gray-500">
          {maxTags}/{maxTags} tags selected.
        </p>
      )}
    </div>
  );
});

ChipInput.displayName = 'ChipInput';
