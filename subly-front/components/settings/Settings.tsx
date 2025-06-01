import { useAuth } from '@/context/useAuth';
import { deleteUser } from '@/services/authService';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Button, Pressable, SafeAreaView, Text } from 'react-native';

const Settings = () => {
  const { signOut, user } = useAuth();

  const handleDelete = () => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous vraiment supprimer votre compte ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUser(user?.id as string);
              signOut();
              Alert.alert('Succès', 'Utilisateur supprimé avec succès !');
              router.push('/signin');
            } catch (error) {
              Alert.alert('Erreur', "Impossible de supprimer l'utilisateur.");
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView className="bg-[#121212] h-full">
      <Text className="text-white text-2xl font-bold text-center">Profil</Text>

      <Button title="Se déconnecter" color="red" onPress={signOut} />
      <Pressable
        className="bg-red-500 p-3 rounded-md mt-3"
        onPress={handleDelete}
      >
        <Text className="text-white text-center">Supprimer le compte</Text>
      </Pressable>

      <Text className="text-white text-center">
        Conditions et termes d'utilisation
      </Text>
    </SafeAreaView>
  );
};

export default Settings;
