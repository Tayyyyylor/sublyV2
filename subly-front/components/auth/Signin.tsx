import { Alert, Button, SafeAreaView, Text, View } from 'react-native';
import Input from '../Input';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { loginUser } from '@/services/authService';
import { useAuth } from '@/context/useAuth';

const Signin = () => {
  const router = useRouter();
  const { signIn } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const inputData = [
    { placeholder: 'username', value: username, onChangeText: setUsername },
    { placeholder: 'Mot de passe', value: password, onChangeText: setPassword },
  ];

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
      return;
    }

    try {
      const userData = {
        username,
        password,
      };
      await loginUser(userData, signIn);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de se connecter.');
    }
  };

  const handleRedirectSignUp = () => {
    router.replace('/signup');
  };

  return (
    <SafeAreaView>
      <Text className="text-xl font-bold text-red-600">Connexion</Text>
      <View className="p-2 gap-3">
        {inputData.map((input, index) => (
          <Input
            placeholder={input.placeholder}
            key={index}
            onChangeText={input.onChangeText}
            value={input.value}
          />
        ))}
      </View>
      <Button title="Se connecter" onPress={handleLogin} />
      <Button title="pas encore inscrit ?" onPress={handleRedirectSignUp} />
    </SafeAreaView>
  );
};

export default Signin;
