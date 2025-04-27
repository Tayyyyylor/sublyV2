import { Stack } from 'expo-router';
import { SessionProvider } from '@/context/useAuth';
import '../global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SessionProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
    </SessionProvider>
  );
}
