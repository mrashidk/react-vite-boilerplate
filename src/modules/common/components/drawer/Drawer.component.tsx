/* eslint-disable react/require-default-props */
import { Fragment, useState, forwardRef, useImperativeHandle } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@utils';

export type DrawerHandle = {
  toggleDrawer: (data: { content: React.ReactNode; title: string | undefined }) => void;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type DrawerProps = {};

const Drawer = forwardRef<DrawerHandle, DrawerProps>((_props, ref) => {
  const [title, setTitle] = useState<string | undefined>();
  const [content, setContent] = useState<React.ReactNode>(null);
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    toggleDrawer: (data) => {
      if (!data) {
        setOpen(false);
        return;
      }
      setTitle(data.title);
      setContent(data.content);
      setOpen((prev) => !prev);
    },
  }));

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="purple-theme relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                  <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div
                        className={cn('flex items-start justify-between', {
                          'absolute right-8 top-6 justify-end': !title,
                        })}
                      >
                        {title && (
                          <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                            {title}
                          </Dialog.Title>
                        )}
                        <div className="z-50 ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">{content}</div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
});

Drawer.displayName = 'Drawer';

export default Drawer;
