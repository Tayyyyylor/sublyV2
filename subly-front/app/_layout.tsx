import { Redirect, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css';
import { ActivityIndicator, View } from 'react-native';
import { SessionProvider, useSession } from '@/context/useAuth';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { session, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Rend obligatoirement un Navigator en premier.
  return <Stack />;
}

function RootLayout() {
  const { session, isLoading } = useSession();

  if (isLoading) return null;

  return session ? null : <Redirect href="/signin" />;
}

export default function AppLayout() {
  return (
    <SessionProvider>
      <RootLayoutNav />
      <RootLayout />
    </SessionProvider>
  );
}
