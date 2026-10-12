import { useCurrentUser } from '@/lib/queries/useCurrentUser';
import { Navigate } from 'react-router-dom';

export function RedirectIfSignedIn({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isPending, data: currentUser } = useCurrentUser();
  if (isPending) {
    return <p className="p-6 text-muted-foreground">Loading…</p>;
  }
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
