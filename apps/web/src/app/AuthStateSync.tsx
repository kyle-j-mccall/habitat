import { useQueryClient } from '@tanstack/react-query';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useEffect } from 'react';

export function AuthStateSync({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    return onAuthStateChanged(auth, () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    });
  }, [queryClient]);

  return <>{children}</>;
}
