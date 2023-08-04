import { create } from 'zustand';

export type TTheme = 'blue-theme' | 'red-theme';

interface ThemeStoreState {
  theme: TTheme;
  setTheme: (theme: TTheme) => void;
}

const useThemeStore = create<ThemeStoreState>((set) => ({
  theme: 'blue-theme',
  setTheme: (theme: TTheme) => set({ theme }),
}));

export default useThemeStore;
