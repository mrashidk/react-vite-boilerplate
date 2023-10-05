/* eslint-disable react/require-default-props */
import { FC, Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import { SelectOption } from '@common/types/common.type';
import { twMerge } from 'tailwind-merge';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

type SelectProps = {
  options: SelectOption[];
  value?: number | string;
  defaultValue?: number | string;
  onChange?: (value: number | string) => void;
  className?: string;
  optionClassName?: string;
  filterIndicator?: boolean;
};

const Select: FC<SelectProps> = ({
  options,
  value,
  defaultValue,
  onChange,
  className,
  optionClassName,
  filterIndicator = false,
}) => {
  const [selected, setSelected] = useState<SelectOption>();

  useEffect(() => {
    setSelected(options.find((option) => option.value === value));
  }, [value]);

  useEffect(() => {
    if (defaultValue !== undefined) setSelected(options.find((option) => option.value === defaultValue));
  }, [defaultValue]);

  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <div>
            <Menu.Button
              className={twMerge(
                'inline-flex w-full justify-center gap-x-1.5 truncate rounded-md bg-white px-3 py-2 text-sm font-semibold capitalize text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
                className,
              )}
            >
              {selected?.label}
              {open ? (
                <ChevronUpIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
              ) : (
                <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
              )}
            </Menu.Button>
            {filterIndicator && selected && (
              <span className="absolute left-0.5 top-0.5 z-20 h-2.5 w-2.5 rounded-full bg-[#8645FE] neon-purple" />
            )}
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute left-0 z-20 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="flex flex-col gap-2 p-3">
                {options.map((option) => (
                  <Menu.Item key={option.value}>
                    {({ active }) => (
                      <button
                        type="button"
                        className={classNames(
                          active ? 'bg-gray-200 text-gray-900' : 'text-gray-700',
                          selected?.value === option.value ? 'bg-gray-200 text-gray-900' : 'text-gray-700',
                          'flex w-full cursor-pointer items-center justify-between rounded-md px-4 py-2 text-left text-sm font-semibold',
                          optionClassName,
                        )}
                        onClick={() => {
                          setSelected(option);
                          if (onChange) onChange(option.value);
                        }}
                      >
                        {option.label}
                        <CheckIcon
                          className={classNames(
                            selected?.value === option.value ? 'text-gray-900' : 'text-transparent',
                            'ml-3 h-4 w-4',
                          )}
                          aria-hidden="true"
                        />
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default Select;
