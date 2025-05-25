import { Stack } from 'expo-router';
import { SessionProvider } from '@/context/useAuth';
import '../global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, View, StyleSheet } from 'react-native';

export default function RootLayout() {
  return (
    <SessionProvider>
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
    </SessionProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
});
