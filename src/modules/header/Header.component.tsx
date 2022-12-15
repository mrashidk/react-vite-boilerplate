/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Link, useNavigate } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { AppstoreOutlined } from '@ant-design/icons';
import { BeakerIcon, CubeTransparentIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import { Fragment, useEffect, useState } from 'react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import session, { UserSession } from '../../config/session/session.config';
import { NavigationPopover } from '../common/components';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Header = () => {
  const [currentUser, setCurrentUser] = useState<UserSession>();
  const navigate = useNavigate();

  const [links] = useState([
    {
      name: 'Dashboard',
      icon: AppstoreOutlined,
      path: '/',
      collapsed: false,
      current: false,
      enabled: true,
      public: false,
    },
    {
      name: 'Test',
      icon: AppstoreOutlined,
      path: '#',
      collapsed: false,
      current: false,
      enabled: true,
      children: [
        {
          name: 'Test 1',
          icon: CubeTransparentIcon,
          path: '/test',
          enabled: true,
        },
        {
          name: 'Test 2',
          icon: BeakerIcon,
          path: '/test',
          current: false,
          enabled: false,
        },
      ],
    },
  ]);

  const publicLinks = links.filter((link) => link.public !== false);

  const validateSession = async () => {
    const user = await session.verifySession(false);
    if (typeof user !== 'boolean') return setCurrentUser(user);
    // if (user === false) navigate('/');
    return null;
  };

  const localStorageListenerForSession = () => {
    window.addEventListener('storage', (event) => {
      if (event.key === 'logOut') {
        setTimeout(() => {
          console.log('currentUser', currentUser);
          setCurrentUser(undefined);
          navigate('/');
        }, 100);
      }

      if (event.key === 'logIn') {
        setTimeout(async () => {
          const user = await session.getCurrentSession();
          setCurrentUser(user);
          if (user) navigate(user.defaultRoute);
          else session.verifySession();
        }, 100);
      }
    });
  };

  const logOut = () => {
    session.destroySession();
    navigate('/');
  };

  useEffect(() => {
    if (validateSession() !== null) localStorageListenerForSession();
  }, []);

  return (
    <Disclosure as="nav" className="bg-primaryDark z-20 bg-opacity-95">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-fill px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="cursor-pointer block h-8 w-auto lg:hidden"
                    src="vite.svg"
                    onClick={() => navigate('/')}
                    alt=""
                  />
                  <img
                    className="cursor-pointer hidden h-8 w-auto lg:block"
                    src="vite.svg"
                    onClick={() => navigate('/')}
                    alt=""
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {(currentUser ? links : publicLinks).map((item) =>
                      item.children ? (
                        <NavigationPopover key={item.name} menuTitle={item.name} linksArray={item.children} />
                      ) : (
                        <Link
                          key={item.name}
                          to={item.path}
                          className={classNames(
                            item.current
                              ? 'bg-gray-900 text-white'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                            item.enabled ? '' : 'opacity-50 cursor-not-allowed',
                            'px-3 py-2 rounded-md text-sm font-medium',
                          )}
                          aria-current={item.current ? 'page' : undefined}
                        >
                          {item.name}
                        </Link>
                      ),
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 flex">
                {currentUser ? (
                  <div className="flex items-center">
                    <button type="button" className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white">
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="flex rounded-full bg-gray-800 text-sm">
                          <span className="sr-only">Open user menu</span>
                          <img className="h-8 w-8 rounded-full" src="assets/avatar.png" alt="" />
                        </Menu.Button>
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
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-primary py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-text hover:bg-primaryLight hover:text-text',
                                )}
                              >
                                Your Profile
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-text hover:bg-primaryLight hover:text-text',
                                )}
                              >
                                Settings
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-text hover:bg-primaryLight hover:text-text',
                                )}
                                onClick={() => logOut()}
                              >
                                Sign out
                              </a>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="fixed flex flex-col bg-gray-800 w-fill space-y-1 px-2 pt-2 pb-3">
              {(currentUser ? links : publicLinks).map((item) =>
                !item.children || !item.enabled ? (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={classNames(
                      item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      item.enabled ? '' : 'opacity-50 cursor-not-allowed pointer-events-none',
                      'px-3 py-2 rounded-md text-sm font-medium',
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <Disclosure>
                    {({ open: _disclosureOpen }) => (
                      <>
                        <Disclosure.Button className="flex w-full justify-between rounded-lg px-[0.75rem] py-2 text-left text-sm font-medium focus-visible:ring-opacity-75">
                          <span>{item.name}</span>
                          <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-white`} />
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-4 py-2 text-sm text-gray-500 flex flex-col">
                          {item.children.map((childItem) => (
                            <Link
                              key={childItem.name}
                              to={childItem.path}
                              className={classNames(
                                childItem.current
                                  ? 'bg-gray-900 text-white'
                                  : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                childItem.enabled ? '' : 'opacity-50 cursor-not-allowed pointer-events-none',
                                'px-3 py-2 rounded-md text-sm font-medium',
                              )}
                              aria-current={childItem.current ? 'page' : undefined}
                            >
                              {childItem.name}
                            </Link>
                          ))}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ),
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
