import { Stack } from 'expo-router';
import { SessionProvider } from '@/context/useAuth';

export default function RootLayout() {
  return (
    <SessionProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SessionProvider>
  );
}
