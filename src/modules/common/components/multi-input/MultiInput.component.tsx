/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unused-prop-types */
import { cn } from '@common/services/utils.service';
import { MagnifyingGlassIcon, XCircleIcon } from '@heroicons/react/20/solid';
import { FC, useEffect, useState } from 'react';

type MultiInputProps = {
  placeholder?: string;
  onChange?: (value: (number | string)[]) => void;
  className?: string;
  tagClassName?: string;
  defaultSelected?: string[];
};

const MultiInput: FC<MultiInputProps> = ({ placeholder = '', onChange, className, tagClassName, defaultSelected }) => {
  const [input, setInput] = useState('');
  const [tags, setTags] = useState<string[]>(defaultSelected || []);
  const [isKeyReleased, setIsKeyReleased] = useState(false);

  const onInputChange = (e) => {
    const { value } = e.target;
    setInput(value);
  };

  const deleteTag = (index) => {
    setTags((prevState) => prevState.filter((_tag, i) => i !== index));
  };

  const onKeyDown = (e) => {
    const { key } = e;
    const trimmedInput = input.trim();

    if (key === 'Enter' && trimmedInput.length && !tags.includes(trimmedInput)) {
      e.preventDefault();
      setTags((prevState) => [...prevState, trimmedInput]);
      setInput('');
    }

    if (key === 'Backspace' && !input.length && tags.length && isKeyReleased) {
      const tagsCopy = [...tags];
      const poppedTag = tagsCopy.pop();
      e.preventDefault();
      setTags(tagsCopy);
      setInput(poppedTag || '');
    }

    setIsKeyReleased(false);
  };

  const onKeyUp = () => {
    setIsKeyReleased(true);
  };

  useEffect(() => {
    if (onChange) onChange(tags);
  }, [tags]);

  useEffect(() => {
    if (defaultSelected) {
      setTags(defaultSelected);
    }
  }, []);

  return (
    <div
      className={cn(
        'scroll-hidden flex h-12 w-full max-w-full items-center gap-1 overflow-auto rounded-full border border-gray-300 bg-white px-2 py-2.5 shadow outline-none focus:border-primary focus:ring-primary',
        className,
      )}
    >
      <div className="flex h-full items-center">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>
      {tags.map((tag, index) => (
        <div key={tag} className="flex items-center gap-1">
          <div
            className={cn(
              'flex w-min items-center gap-1 whitespace-nowrap rounded-full border border-solid bg-gradient-to-r from-[#8645FE]/80 to-[#6529D3]/80 px-1.5 text-white',
              tagClassName,
            )}
          >
            {tag}
            <button type="button" onClick={() => deleteTag(index)}>
              <XCircleIcon className="h-4 w-4" />
            </button>
          </div>
          {index !== tags.length - 1 && ' & '}
        </div>
      ))}
      <input
        className="w-full min-w-[6rem] bg-white outline-none"
        value={input}
        placeholder={placeholder || 'Enter a tag'}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onChange={onInputChange}
      />
    </div>
  );
};

export default MultiInput;
