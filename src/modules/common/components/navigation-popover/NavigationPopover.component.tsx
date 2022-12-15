/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import { FC, Fragment, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

type NavigationPopoverProps = {
  menuTitle: string;
  linksArray: {
    name: string;
    icon: any;
    path: string;
    current?: boolean;
    enabled?: boolean;
    description?: string;
  }[];
};

const NavigationPopover: FC<NavigationPopoverProps> = ({ menuTitle, linksArray }) => {
  let timeout; // NodeJS.Timeout
  const timeoutDuration = 70;

  const buttonRef = useRef<HTMLButtonElement>(null);
  const [openState, setOpenState] = useState(false);

  const toggleMenu = (_open) => {
    // log the current open state in React (toggle open state)
    setOpenState((prevOpenState) => !prevOpenState);
    // toggle the menu by clicking on buttonRef
    buttonRef?.current?.click(); // eslint-disable-line
  };

  // Open the menu after a delay of timeoutDuration
  const onHover = (open, action) => {
    // if the modal is currently closed, we need to open it
    // OR
    // if the modal is currently open, we need to close it
    if ((!open && !openState && action === 'onMouseEnter') || (open && openState && action === 'onMouseLeave')) {
      // clear the old timeout, if any
      clearTimeout(timeout);
      // open the modal after a timeout
      timeout = setTimeout(() => toggleMenu(open), timeoutDuration);
    }
    // else: don't click! 😁
  };

  const handleClick = (open) => {
    setOpenState(!open); // toggle open state in React state
    clearTimeout(timeout); // stop the hover timer if it's running
  };

  const handleClickOutside = (event) => {
    if (buttonRef.current && !buttonRef.current.contains(event.target)) {
      event.stopPropagation();
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });
  return (
    <Popover className="relative">
      {({ open }) => (
        <div onMouseEnter={() => onHover(open, 'onMouseEnter')} onMouseLeave={() => onHover(open, 'onMouseLeave')}>
          <Popover.Button
            ref={buttonRef}
            className={classNames(
              open ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
              'group inline-flex items-center rounded-md',
              'px-3 py-2 rounded-md text-sm font-medium focus:outline-none',
            )}
            onClick={() => handleClick(open)}
          >
            <span>{menuTitle}</span>
            {!open ? (
              <ChevronDownIcon
                className={classNames(
                  'text-gray-400',
                  'ml-2 h-5 w-5 transition duration-150 ease-in-out group-hover:text-gray-500',
                )}
                aria-hidden="true"
              />
            ) : (
              <ChevronUpIcon
                className={classNames(
                  'text-gray-600',
                  'ml-2 h-5 w-5 transition duration-150 ease-in-out group-hover:text-gray-500',
                )}
                aria-hidden="true"
              />
            )}
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-10 pt-3 w-screen max-w-md transform px-2 sm:px-0 lg:max-w-3xl">
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative grid gap-6 bg-primaryDark px-5 py-6 sm:gap-8 sm:p-8 lg:grid-cols-2">
                  {linksArray.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      // onClick={() => setSidebarOpen(false)}
                      className={`${
                        item.enabled === false ? 'pointer-events-none cursor-not-allowed !text-gray-700 opacity-40' : ''
                      } flex justify-start items-center space-x-4 hover:text-white focus:bg-gray-700 focus:text-white hover:bg-primaryLight text-gray-400 rounded px-3 py-2  w-full md:w-52`}
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-primaryLight text-white sm:h-12 sm:w-12">
                        <item.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div className="ml-4">
                        <p className="text-base font-medium text-white">{item.name}</p>
                        <p className="mt-1 text-sm text-gray-300">{item.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </div>
      )}
    </Popover>
  );
};

export default NavigationPopover;
