import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { ReactNode } from 'react';

type ErrorProps = {
  title: string | ReactNode;
  onBackPress: () => void;
  showBackButton?: boolean;
  imageSize?: string;
};

const Error = ({ title, onBackPress, showBackButton, imageSize }: ErrorProps) => {
  return (
    <div className="flex h-full flex-col justify-center">
      <img src="/icon.png" alt="" className={`${imageSize || 'h-28'} mx-auto opacity-50 grayscale`} />
      <div className="text-center font-medium text-black opacity-50">{title}</div>
      {showBackButton && (
        <button type="button" className="flex items-center justify-center hover:text-primary" onClick={onBackPress}>
          <ChevronLeftIcon height={16} className="mr-0.5" />
          <div>Go Back</div>
        </button>
      )}
    </div>
  );
};

Error.defaultProps = {
  showBackButton: false,
  imageSize: 'h-28',
};

export default Error;
