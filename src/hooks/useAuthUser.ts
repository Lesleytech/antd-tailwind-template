import { useAppSelector } from '~/hooks/useAppSelector';

export function useAuthUser() {
  return useAppSelector((state) => state.auth.currentUser);
}
