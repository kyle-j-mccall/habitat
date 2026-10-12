import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../api';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchUser,
  });
}
