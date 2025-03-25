import { useAuth } from '@/context/useAuth';
import React from 'react';
import { Button, SafeAreaView, Text } from 'react-native';

const Settings = () => {
  const { signOut } = useAuth();

  return (
    <SafeAreaView>
      <Text>Settings</Text>

      <Button title="Se déconnecter" color="red" onPress={signOut} />
    </SafeAreaView>
  );
};

export default Settings;
