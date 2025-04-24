import {
  Alert,
  Button,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Input from '../Input';
import { useState } from 'react';
import { registerUser } from '@/services/authService';
import { useRouter } from 'expo-router';
import ButtonAuth from './ButtonAuth';

const Signup = () => {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const inputData = [
    { placeholder: 'Prénom', value: username, onChangeText: setUsername },
    { placeholder: 'Email', value: email, onChangeText: setEmail },
    {
      placeholder: 'Mot de passe',
      value: password,
      onChangeText: setPassword,
      id: 'password',
      secureTextEntry: !showPassword,
      showPassword,
      togglePassword: () => setShowPassword(!showPassword),
    },
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
      <Text className="text-xl font-bold text-black-600 text-center">
        Inscription
      </Text>
      <View className="p-2 gap-5 mb-5">
        {inputData.map((input, index) => (
          <Input
            secureTextEntry={input?.id === 'password' ? true : false}
            placeholder={input.placeholder}
            key={index}
            onChangeText={input.onChangeText}
            value={input.value}
            showPassword={input.showPassword}
            togglePassword={input.togglePassword}
          />
        ))}
      </View>
      <View className="flex-col items-center gap-3">
        <ButtonAuth onPress={handleSignup} label="S'inscrire" />
        <ButtonAuth
          onPress={handleRedirectSignIn}
          label="déjà inscrit ? connectez-vous"
          isBlack={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default Signup;
