import { Alert, SafeAreaView, Text, View } from 'react-native';
import Input from '../Input';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { loginUser } from '@/services/authService';
import { useAuth } from '@/context/useAuth';
import ButtonAuth from './ButtonAuth';

const Signin = () => {
  const router = useRouter();
  const { signIn } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const inputData = [
    { placeholder: 'username', value: username, onChangeText: setUsername },
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
      <Text className="text-xl font-bold text-black-600 text-center">
        Connexion
      </Text>
      <View className="p-2 gap-3 mb-5">
        {inputData.map((input, index) => {
          console.log('input', input);
          return (
            <Input
              secureTextEntry={input?.id === 'password' ? true : false}
              placeholder={input.placeholder}
              key={index}
              onChangeText={input.onChangeText}
              value={input.value}
              showPassword={input.showPassword}
              togglePassword={input.togglePassword}
            />
          );
        })}
      </View>
      <View className="flex-col items-center gap-3">
        <ButtonAuth label="Se connecter" onPress={handleLogin} />

        <ButtonAuth
          label="pas encore inscrit ?"
          onPress={handleRedirectSignUp}
          isBlack={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default Signin;
