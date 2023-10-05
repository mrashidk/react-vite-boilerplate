/* eslint-disable react/require-default-props */
import { cn } from '@common/services/utils.service';
import { FC } from 'react';

type TagProps = {
  label: string;
  color: string;
  className?: string;
};

const Tag: FC<TagProps> = ({ label, color, className }) => {
  return (
    <div
      className={cn('mr-2 w-fit rounded bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800', className)}
      style={{ backgroundColor: color, color: 'white' }}
    >
      {label}
    </div>
  );
};

export default Tag;
