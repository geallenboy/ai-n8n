'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ 
  children 
}: { 
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerk();
  const router = useRouter();

  const signOut = async () => {
    await clerkSignOut();
    router.push('/');
    router.refresh();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading: !isLoaded, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
