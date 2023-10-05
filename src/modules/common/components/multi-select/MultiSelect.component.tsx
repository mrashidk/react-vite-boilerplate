/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/require-default-props */
import { FC, useEffect, useState } from 'react';
import { SelectOption } from '@common/types/common.type';
import { Popover, Transition } from '@headlessui/react';
import { ChevronUpIcon, ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { cn } from '@common/services/utils.service';

type MultiSelectProps = {
  placeholder?: string;
  options: SelectOption[];
  onChange?: (value: (number | string)[]) => void;
  className?: string;
  placement?: 'right' | 'left';
  searchable?: boolean;
  defaultSelected?: SelectOption[];
  defaultValues?: (string | number)[];
  filterIndicator?: boolean;
};

const MultiSelect: FC<MultiSelectProps> = ({
  options,
  placeholder,
  onChange,
  className,
  placement = 'left',
  searchable,
  defaultSelected,
  defaultValues,
  filterIndicator = false,
}) => {
  const [selected, setSelected] = useState<SelectOption[]>([]);
  const [searchText, setSearchText] = useState('');
  const updatedPlaceholder = placeholder || 'Selections';

  const placementClass = placement === 'left' ? 'left-0' : 'right-0';

  const onSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const selectedOption = options.find((option) => String(option.value) === e.target.value);
      if (selectedOption) setSelected((prev) => [...prev, selectedOption]);
    } else {
      setSelected((prev) => prev.filter((option) => String(option.value) !== e.target.value));
    }
  };

  const filteredOptions =
    searchText && searchable
      ? options.filter((option) => option.label.toLowerCase().includes(searchText.toLowerCase()))
      : options;

  const selectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelected(searchText && searchable ? filteredOptions : options);
    else setSelected([]);
  };

  const setDefaultValues = async () => {
    const selectedOptions = [] as SelectOption[];
    if (defaultValues) {
      defaultValues.forEach((value) => {
        const findOptions = options.find((option) => option.value === value);
        if (findOptions) {
          selectedOptions.push(findOptions);
        }
      });
      setSelected([...selectedOptions]);
    }
  };

  useEffect(() => {
    if (onChange) {
      onChange(selected.map((option) => option.value));
    }
  }, [selected]);

  useEffect(() => {
    if (defaultSelected) {
      setSelected(defaultSelected);
    }
  }, [defaultSelected]);

  useEffect(() => {
    if (defaultValues?.length) {
      setDefaultValues();
    }
  }, []);

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={cn(
              'relative flex w-full min-w-[8rem] justify-between gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
              className,
            )}
          >
            {selected?.length === 0 && <span>{updatedPlaceholder}</span>}
            {selected?.length === 1 && <span className="truncate capitalize">{selected[0].label}</span>}
            {selected?.length > 1 && (
              <span>
                {selected.length === options.length
                  ? `All ${updatedPlaceholder}`
                  : `${selected.length} ${updatedPlaceholder}`}
              </span>
            )}
            {open ? (
              <ChevronUpIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
            ) : (
              <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
            )}
            {filterIndicator && selected.length > 0 && (
              <span className="absolute left-0.5 top-0.5  h-2.5 w-2.5 rounded-full bg-[#8645FE] neon-purple" />
            )}
          </Popover.Button>

          <Transition
            className={cn('absolute z-20', placementClass)}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Popover.Panel className="mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="flex flex-col gap-2 overflow-y-auto px-5 py-4">
                {searchable && (
                  <div className="relative mb-2">
                    <input
                      type="text"
                      className="w-full rounded-md border-gray-300 bg-white px-1 py-1 text-sm shadow"
                      placeholder={placeholder ? `Search ${placeholder}` : 'Search here...'}
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                    <div className="absolute right-0 top-0 flex h-full items-center pr-3">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                )}
                <div className="flex justify-between">
                  <div className="relative flex items-start pb-2">
                    <div className="flex h-6 items-center">
                      <input
                        id="select-all"
                        name="select-all"
                        type="checkbox"
                        className="form-checkbox h-4 w-4 rounded border-gray-300 text-primary focus:ring-0"
                        onChange={selectAll}
                        checked={selected?.length === options.length}
                      />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                      <label htmlFor="select-all" className="cursor-pointer font-medium text-gray-900">
                        <div>Select All</div>
                      </label>
                    </div>
                  </div>
                  {selected?.length !== 0 && <div className="pr-2">{selected?.length}</div>}
                </div>
                <hr className="py-1" />
                <div className="max-h-[40vh] overflow-y-auto">
                  {filteredOptions.map((option) => (
                    <div key={option.value} className="relative flex items-start">
                      <div className="flex h-6 items-center">
                        <input
                          id={option.label}
                          name={option.label}
                          value={option.value}
                          type="checkbox"
                          className="form-checkbox h-4 w-4 rounded border-gray-300 text-primary focus:ring-0 active:ring-0"
                          checked={!!selected?.find((selectedOption) => selectedOption.value === option.value)}
                          onChange={onSelection}
                        />
                      </div>
                      <div className="ml-3 text-sm leading-6">
                        <label htmlFor={option.label} className="cursor-pointer font-medium capitalize text-gray-900">
                          {option.label}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default MultiSelect;
