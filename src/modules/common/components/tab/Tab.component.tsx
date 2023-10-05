/* eslint-disable react/require-default-props */
import { FC, useState } from 'react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

type TItem = {
  key: string;
  name: string;
  content?: React.ReactNode;
  disabled?: boolean;
};

type TabProps = {
  items: TItem[];
  activeKey?: string;
  onTabChange?: (key: string) => void;
};

const Tab: FC<TabProps> = ({ items, activeKey, onTabChange }) => {
  const [selected, setSelected] = useState(
    activeKey ? items.find((item) => item.key === activeKey) || items[0] : items[0],
  );

  return (
    <div>
      <div className="hidden sm:block">
        <div className="">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {items.map((tab) => (
              <button
                type="button"
                key={tab.name}
                onClick={() => {
                  setSelected(tab);
                  if (onTabChange) onTabChange(tab.key);
                }}
                className={classNames(
                  selected.name === tab.name
                    ? 'border-primaryLight text-primary'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'whitespace-nowrap border-b-2 px-1 py-2 text-sm font-medium',
                  tab.disabled ? 'pointer-events-none opacity-50' : 'cursor-pointer',
                )}
                aria-current={selected.name === tab.name ? 'page' : undefined}
                disabled={tab.disabled}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
        {selected.content && selected.content}
      </div>
    </div>
  );
};

export default Tab;
