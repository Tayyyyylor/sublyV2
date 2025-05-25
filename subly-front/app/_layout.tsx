import { Stack } from 'expo-router';
import { SessionProvider } from '@/context/useAuth';
import '../global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, View, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function RootLayout() {
  const queryClient = new QueryClient();

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <View style={styles.container}>
            <StatusBar
              barStyle="light-content"
              backgroundColor={styles.container.backgroundColor}
            />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: {
                  backgroundColor: styles.container.backgroundColor,
                },
              }}
            />
          </View>
        </SafeAreaProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
});
