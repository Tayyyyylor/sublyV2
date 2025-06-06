import { useAuth } from '@/context/useAuth';
import { deleteUser } from '@/services/authService';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Button,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import Input from '../Input';
import { UserType } from '@/types/global';
import { updateUserName } from '@/services/userService';

const Settings = () => {
  const { signOut, user, signIn } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState<UserType['username']>(
    user?.username as string,
  );

  console.log('user', user);

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

  const handleClickCgu = () => {
    router.push('/cgu');
  };
  const handleClickEditName = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await updateUserName(user?.id as string, {
        username,
      });
      if (response.access_token) {
        signIn(response.access_token);
      }
      setIsEditing(false);
      Alert.alert('Succès', 'Nom modifié avec succès !');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier le nom.');
    }
  };
  return (
    <SafeAreaView className="bg-[#121212] h-full">
      <Text className="text-white text-2xl font-bold text-center">Profil</Text>

      <Text className="text-white text-[16px] text-center"> Infos</Text>

      <View className="flex-row items-center justify-center">
        {isEditing ? (
          <View className="flex-column items-center justify-center w-full">
            <Input value={username} onChangeText={setUsername} />
            <Button title="Enregistrer" onPress={handleSave} />
          </View>
        ) : (
          <>
            <Text className="text-white text-[20px] font-bold capitalize mr-2">
              {user?.username}
            </Text>
            <Pressable onPress={handleClickEditName}>
              <AntDesign name="edit" size={20} color="white" />
            </Pressable>
          </>
        )}
      </View>
      <Button title="Se déconnecter" color="red" onPress={signOut} />
      <Pressable
        className="bg-red-500 p-4 rounded-[5px] mt-6"
        onPress={handleDelete}
      >
        <Text className="text-white text-center text-[18px] font-bold">
          Supprimer le compte
        </Text>
      </Pressable>

      <Pressable onPress={handleClickCgu}>
        <Text className="text-white text-center">
          Conditions et termes d'utilisation
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Settings;
