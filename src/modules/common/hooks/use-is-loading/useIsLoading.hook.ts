import { create } from 'zustand';

interface IsLoadingStore {
  isLoading: boolean;
  content?: JSX.Element;
  className?: string;
}

interface IsLoadingState {
  isLoadingStore: IsLoadingStore;
  setIsLoading: (isLoadingStore: boolean | IsLoadingStore) => void;
}

const useIsLoading = create<IsLoadingState>((set) => ({
  isLoadingStore: {
    isLoading: false,
  },
  setIsLoading: (isLoadingStore: boolean | IsLoadingStore) => {
    if (typeof isLoadingStore === 'boolean')
      return set((_state) => ({ isLoadingStore: { isLoading: isLoadingStore } }));
    return set((_state) => ({ isLoadingStore }));
  },
}));

export default useIsLoading;
