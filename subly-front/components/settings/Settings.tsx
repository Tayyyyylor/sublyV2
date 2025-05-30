import { useAuth } from '@/context/useAuth';
import React from 'react';
import { Button, Pressable, SafeAreaView, Text } from 'react-native';

const Settings = () => {
  const { signOut } = useAuth();

  return (
    <SafeAreaView className="bg-[#121212] h-full">
      <Text className="text-white text-2xl font-bold text-center">Profil</Text>

      <Button title="Se déconnecter" color="red" onPress={signOut} />
      <Pressable className="bg-orange-500 p-3 rounded-md ">
        <Text className="text-white text-center">
          Supprimer toutes les données
        </Text>
      </Pressable>
      <Pressable className="bg-red-500 p-3 rounded-md mt-3">
        <Text className="text-white text-center">Supprimer le compte</Text>
      </Pressable>

      <Text className="text-white text-center">
        Conditions et termes d'utilisation
      </Text>
    </SafeAreaView>
  );
};

export default Settings;
