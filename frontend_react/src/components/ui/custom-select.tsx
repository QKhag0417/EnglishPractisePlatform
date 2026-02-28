import * as React from "react";

export interface CustomSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

const CustomSelect = React.forwardRef<HTMLSelectElement, CustomSelectProps>(
  ({ className = "", options, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(props.value || "");
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    React.useEffect(() => {
      if (props.value !== undefined) {
        setSelectedValue(props.value);
      }
    }, [props.value]);

    const handleSelect = (value: string) => {
      setSelectedValue(value);
      setIsOpen(false);
      if (props.onChange) {
        const event = {
          target: { value },
        } as React.ChangeEvent<HTMLSelectElement>;
        props.onChange(event);
      }
    };

    const selectedOption = options.find(opt => opt.value === selectedValue);

    return (
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-[16px] py-[10px] border border-gray-300 rounded-full font-['Inter'] text-[14px] bg-white cursor-pointer text-left flex items-center justify-between ${className}`}
        >
          <span>{selectedOption?.label || options[0]?.label}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          >
            <path fill="#666" d="M6 9L1 4h10z" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-[12px] shadow-lg overflow-hidden">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full px-[16px] py-[10px] text-left font-['Inter'] text-[14px] hover:bg-blue-50 transition-colors ${
                  option.value === selectedValue ? 'bg-blue-50 text-[#1977f3]' : 'text-gray-900'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

CustomSelect.displayName = "CustomSelect";

export { CustomSelect };
