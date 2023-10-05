import { TCurrentUser } from '@common/types';
import { create } from 'zustand';

interface CurrentUserState {
  currentUser?: TCurrentUser | null;
  setCurrentUser: (currentUser: TCurrentUser | undefined) => void;
}

const useCurrentUser = create<CurrentUserState>((set) => {
  const existingUser = localStorage.getItem('currentUser');
  return {
    currentUser: existingUser ? JSON.parse(existingUser || '{}') : null,
    setCurrentUser: (currentUser: TCurrentUser | undefined) => set((_state) => ({ currentUser })),
  };
});

window.addEventListener('currentUserUpdated', (event: any) => {
  const eventData = event.detail;
  if (JSON.stringify(eventData) === JSON.stringify(useCurrentUser.getState().currentUser)) return;
  useCurrentUser.setState({ currentUser: eventData });
});

export default useCurrentUser;
