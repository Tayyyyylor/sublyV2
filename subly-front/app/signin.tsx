import Signin from '@/components/auth/Signin';
import { useAuth } from '@/context/useAuth';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function SigninScreen() {
  const { user, isLoading } = useAuth();
const router = useRouter();

useEffect(() => {
  if (!isLoading && user) {
    router.replace('/(tabs)');
  }
}, [user, isLoading]);

if (isLoading) {
  return null; 
}

  return (  <Signin /> )
}
