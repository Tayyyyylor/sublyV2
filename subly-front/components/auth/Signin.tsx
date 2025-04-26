import { Alert, SafeAreaView, Text, View } from 'react-native';
import Input from '../Input';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { loginUser } from '@/services/authService';
import { useAuth } from '@/context/useAuth';
import ButtonAuth from './ButtonAuth';
import Title from '../Title';

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
    <SafeAreaView>
      <Title label="Connexion" />
      <View className="p-2 gap-3 mb-5">
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
