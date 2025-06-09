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
  const handleClickConfidentiality = () => {
    router.push('/confidentiality');
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
    <SafeAreaView className="bg-[#121212] h-full flex-column justify-between">
      <View className="flex-column items-center justify-center mt-[20px]">
        {isEditing ? (
          <View className="flex-column items-center justify-center w-full ">
            <Input value={username} onChangeText={setUsername} />
            <Button title="Enregistrer" onPress={handleSave} />
          </View>
        ) : (
          <>
            <Text className="text-white text-[30px] font-bold capitalize mr-2">
              {user?.username}
            </Text>
            {/* <Pressable onPress={handleClickEditName}>
              <AntDesign name="edit" size={20} color="white" />
            </Pressable> */}
          </>
        )}
        <Button title="Se déconnecter" color="red" onPress={signOut} />
      </View>
      <View className="p-4">
        <Pressable
          className="bg-red-500 p-4 rounded-[5px] mt-6"
          onPress={handleDelete}
        >
          <Text className="text-white text-center text-[18px] font-bold">
            Supprimer le compte
          </Text>
        </Pressable>

        <Pressable onPress={handleClickCgu}>
          <Text className="text-white text-center mt-5">
            Conditions générales d'utilisation
          </Text>
        </Pressable>
        <Pressable onPress={handleClickConfidentiality}>
          <Text className="text-white text-center mt-5">
            Politique de confidentialité
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
