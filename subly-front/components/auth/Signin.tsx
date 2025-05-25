import { useState } from 'react';
import { Alert, SafeAreaView, View } from 'react-native';
import { useRouter } from 'expo-router';

import { loginUser } from '@/services/authService';
import { useAuth } from '@/context/useAuth';

import ButtonAuth from './ButtonAuth';
import Title from '../Title';
import Input from '../Input';
import Logo from '../Logo';

const Signin = () => {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const inputData = [
    { placeholder: 'email', value: email, onChangeText: setEmail },
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
    if (!email || !password) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
      return;
    }

    try {
      const userData = {
        email,
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
    <SafeAreaView className="flex-1 mt-[100px]">
      <View className="flex-col items-center gap-1 mb-[20px]">
        <Logo />
        <Title label="Connexion" />
      </View>
      <View className="p-10 gap-5 ">
        {inputData.map((input, index) => {
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
      <View className="flex-col items-center gap-3 p-10">
        <ButtonAuth
          label="Se connecter"
          onPress={handleLogin}
          text="Pas encore inscrit ?"
          labelSecondButton="Créer un compte"
          onPressSecondButton={handleRedirectSignUp}
        />
      </View>
    </SafeAreaView>
  );
};

export default Signin;
