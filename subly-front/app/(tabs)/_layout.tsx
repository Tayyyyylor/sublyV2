import { Redirect, Tabs } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/useAuth';
import '../../global.css';

export default function TabLayout() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/signin" />;
  }

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'orange', headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
      <Tabs.Screen name="stats" options={{ title: 'Stats' }} />
    </Tabs>
  );
}
