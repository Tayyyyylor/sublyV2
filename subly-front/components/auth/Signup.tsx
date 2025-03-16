import { Alert, Button, SafeAreaView, Text, View } from 'react-native';
import Input from '../Input';
import { useState } from 'react';
import { registerUser } from '@/services/authService';
import { useRouter } from 'expo-router';

const Signup = () => {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const inputData = [
    { placeholder: 'Prénom', value: username, onChangeText: setUsername },
    { placeholder: 'Email', value: email, onChangeText: setEmail },
    { placeholder: 'Mot de passe', value: password, onChangeText: setPassword },
  ];

  const handleSignup = async () => {
    if (!username || !email || !password) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
      return;
    }

    try {
      const userData = {
        username: username,
        email,
        password,
      };

      await registerUser(userData);
      Alert.alert('Succès', 'Compte créé avec succès !');
      router.push('/');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer le compte.');
    }
  };

  const handleRedirectSignIn = () => {
    router.push('/signin');
  };

  return (
    <SafeAreaView>
      <Text className="text-xl font-bold text-red-600">Inscription</Text>
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
      <Button title="S'inscrire" onPress={handleSignup} />
      <Button
        title="déjà inscrit ? connectez-vous"
        onPress={handleRedirectSignIn}
      />
    </SafeAreaView>
  );
};

export default Signup;
