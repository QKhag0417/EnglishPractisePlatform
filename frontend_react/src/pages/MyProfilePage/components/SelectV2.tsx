import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { clsx, type ClassValue } from "clsx";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import type { Key } from "react";
import { twMerge } from "tailwind-merge";

export type SelectOption<TValue extends Key = string> = {
  value: TValue;
  label: string;
};

type SelectV2Props<TValue extends Key = string> = {
  value: TValue;
  onChange: (value: TValue) => void;
  options: SelectOption<TValue>[];
  placeholder?: string;

  // slots
  className?: string;
  triggerClassName?: string;
  dropdownClassName?: string;
  optionClassName?: string;
  iconClassName?: string;
};

function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * @deprecated Use SelectV2 from TutorDashboardPage/components instead.
 */
export function SelectV2<TValue extends Key = string>({
  value,
  onChange,
  options,
  placeholder = "Select",
  className = "w-full",
  triggerClassName,
  dropdownClassName,
  optionClassName,
  iconClassName,
}: SelectV2Props<TValue>) {
  const selected = options.find((option) => option.value === value);

  return (
    <div className={className}>
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <ListboxButton
            className={cx(
              "border-input bg-input-background text-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm whitespace-nowrap outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 font-['Inter']",
              triggerClassName,
            )}
          >
            <span className="truncate">{selected?.label ?? placeholder}</span>
            <ChevronDownIcon
              className={cx("size-4 shrink-0 opacity-50", iconClassName)}
            />
          </ListboxButton>

          <ListboxOptions
            modal={false}
            className={cx(
              "bg-popover text-popover-foreground absolute top-full left-0 z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border p-1 shadow-md empty:invisible",
              dropdownClassName,
            )}
          >
            {options.map((option) => (
              <ListboxOption
                key={option.value}
                value={option.value}
                className={cx(
                  "group relative flex w-full cursor-pointer items-center rounded-sm py-1.5 pr-8 pl-3 text-sm select-none outline-none data-focus:bg-accent data-focus:text-accent-foreground",
                  optionClassName,
                )}
              >
                <span className="truncate">{option.label}</span>
                <CheckIcon className="invisible absolute right-2 size-4 group-data-selected:visible" />
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}
