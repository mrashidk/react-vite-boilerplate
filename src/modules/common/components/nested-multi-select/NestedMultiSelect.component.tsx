/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/require-default-props */
import { FC, useEffect, useState } from 'react';
import { NestedSelectOption, NestedSelectedOption } from '@common/types/common.type';
import { Popover, Disclosure, Transition } from '@headlessui/react';
import { twMerge } from 'tailwind-merge';
import { ChevronUpIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

type TFlatOptions = {
  parent: {
    children: undefined;
    label: string;
    value: string | number;
    description?: string | undefined;
  };
  label: string;
  value: string | number;
  description?: string | undefined;
  children?: NestedSelectOption[] | undefined;
};

type NestedMultiSelectProps = {
  placeholder?: string;
  options: NestedSelectOption[];
  onChange?: (value: NestedSelectedOption[]) => void;
  className?: string;
  placement?: 'right' | 'left';
  type?: 'popover' | 'disclosure';
  btnContent?: JSX.Element;
  searchFilter?: string;
};

const NestedMultiSelect: FC<NestedMultiSelectProps> = ({
  options,
  placeholder,
  onChange,
  className,
  placement = 'left',
  type = 'popover',
  btnContent = null,
  searchFilter,
}) => {
  const [selectedParent, setSelectedParent] = useState<NestedSelectOption | null>(null);
  const [selected, setSelected] = useState<NestedSelectedOption[]>([]);
  const updatedPlaceholder = placeholder || 'Selections';
  const flatOptions = options.flatMap(
    (option) => option.children?.map((child) => ({ ...child, parent: { ...option, children: undefined } })) || [],
  );
  const filteredOptions: TFlatOptions[] = searchFilter
    ? flatOptions.filter((option) => option.label.toLowerCase().includes(searchFilter?.toLowerCase()))
    : flatOptions;

  const placementClass = placement === 'left' ? 'left-0' : 'right-0';

  const SelectType = type === 'popover' ? Popover : Disclosure;

  const onSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const selectedOption = flatOptions.find((option) => String(option.value) === e.target.value);
      if (selectedOption) setSelected((prev) => [...prev, selectedOption]);
    } else {
      setSelected((prev) => prev.filter((option) => String(option.value) !== e.target.value));
    }
  };

  const selectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelected(flatOptions);
    else setSelected([]);
  };

  const selectAllChildren = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedOption = options.find((option) => String(option.value) === e.target.value);
    if (e.target.checked) {
      setSelected((prev) => [
        ...new Set([
          ...prev,
          ...(selectedOption?.children?.map((child) => ({
            ...child,
            parent: { ...selectedOption, children: undefined },
          })) || []),
        ]),
      ]);
    } else {
      setSelected((prev) =>
        prev.filter((option) => !selectedOption?.children?.find((child) => child.value === option.value)),
      );
    }
  };

  useEffect(() => {
    if (onChange) {
      onChange(selected);
    }
  }, [selected]);

  return (
    <SelectType className="relative">
      {({ open }) => (
        <>
          {btnContent ? (
            <SelectType.Button>{btnContent}</SelectType.Button>
          ) : (
            <SelectType.Button
              className={twMerge(
                'flex w-full justify-between min-w-[8rem] gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
                className,
              )}
            >
              {selected?.length === 0 && <span>{updatedPlaceholder}</span>}
              {selected?.length === 1 && <span>{selected[0].label}</span>}
              {selected?.length > 1 && (
                <span>
                  {selected.length === flatOptions.length
                    ? `All ${updatedPlaceholder}`
                    : `${selected.length} ${updatedPlaceholder}`}
                </span>
              )}
              {open ? (
                <ChevronUpIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
              ) : (
                <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
              )}
            </SelectType.Button>
          )}

          <Transition
            className={twMerge(type === 'popover' ? 'absolute z-20' : '', placementClass)}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <SelectType.Panel className="mt-2 w-max origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none h-max">
              <div className="flex flex-col gap-2 py-4 px-5">
                <div className="flex justify-between">
                  <div className="relative flex items-start pb-2">
                    <div className="flex h-6 items-center">
                      <input
                        id="select-all"
                        name="select-all"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-0 form-checkbox"
                        onChange={selectAll}
                        checked={selected?.length === flatOptions.length}
                      />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                      <label htmlFor="select-all" className="font-medium text-gray-900 cursor-pointer">
                        <div>Select All</div>
                      </label>
                    </div>
                  </div>
                  {selected?.length !== 0 && <div className="pr-2">{selected?.length}</div>}
                </div>
                <hr className="py-1" />
                <div className={`grid ${selectedParent ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
                  <div className="flex flex-col gap-1 border-r pr-1">
                    {options
                      .filter((option) =>
                        filteredOptions.find((fOption: TFlatOptions) => fOption.parent.value === option.value),
                      )
                      .map((option) => (
                        <button
                          type="button"
                          key={option.value}
                          className={twMerge(
                            'relative flex justify-between items-center w-44 p-1 rounded-md',
                            selectedParent?.value === option.value ? 'bg-gray-100' : '',
                          )}
                          onClick={() => setSelectedParent(option)}
                        >
                          <div className="flex">
                            <div className="flex h-6 items-center">
                              <input
                                id={option.label}
                                name={option.label}
                                value={option.value}
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-0 active:ring-0 form-checkbox"
                                checked={option.children?.every((child) =>
                                  selected?.find((o) => o.value === child.value),
                                )}
                                onChange={selectAllChildren}
                              />
                            </div>
                            <div className="ml-3 text-sm leading-6">
                              <label
                                htmlFor={option.label}
                                className="font-medium text-gray-900 cursor-pointer capitalize"
                              >
                                {option.label}
                                {option.description && (
                                  <div className="text-xs text-gray-500">{option.description}</div>
                                )}
                              </label>
                            </div>
                          </div>
                          <div>
                            <ChevronRightIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                        </button>
                      ))}
                  </div>
                  {selectedParent && (
                    <div className="flex flex-col gap-3">
                      {selectedParent?.children
                        ?.filter((option) =>
                          filteredOptions.find((fOption: TFlatOptions) => fOption.value === option.value),
                        )
                        .map((option) => (
                          <div key={option.value} className="relative flex items-start p-1">
                            <div className="flex h-6 items-center">
                              <input
                                id={option.label}
                                name={option.label}
                                value={option.value}
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-0 active:ring-0 form-checkbox"
                                checked={!!selected?.find((selectedOption) => selectedOption.value === option.value)}
                                onChange={onSelection}
                              />
                            </div>
                            <div className="ml-3 text-sm leading-6 flex flex-col">
                              <label
                                htmlFor={option.label}
                                className="font-medium text-gray-900 cursor-pointer capitalize"
                              >
                                {option.label}
                                {option.description && (
                                  <div className="text-xs text-gray-500">{option.description}</div>
                                )}
                              </label>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </SelectType.Panel>
          </Transition>
        </>
      )}
    </SelectType>
  );
};

export default NestedMultiSelect;
