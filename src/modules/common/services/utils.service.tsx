import { clsx, ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const utils = {
  // eslint-disable-next-line no-promise-executor-return
  sleep: (interval: number) => new Promise((resolve) => setTimeout(resolve, interval)),
  getViewPort: () => {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

    return { vw, vh };
  },
  formatCurrency: (
    value: number,
    currency = 'AED',
    displayStyle: 'standard' | 'scientific' | 'engineering' | 'compact' | undefined = 'standard',
  ) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      notation: displayStyle,
    });

    return formatter.format(value);
  },
};

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export default utils;
