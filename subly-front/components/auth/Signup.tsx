import { useState } from 'react';
import { Alert, SafeAreaView, View } from 'react-native';
import { useRouter } from 'expo-router';

import { registerUser } from '@/services/authService';

import ButtonAuth from './ButtonAuth';
import Input from '../Input';
import Title from '../Title';
import Logo from '../Logo';

const Signup = () => {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    {
      placeholder: 'Confirmer mot de passe',
      value: verifyPassword,
      onChangeText: setVerifyPassword,
      id: 'password',
      secureTextEntry: !showPassword,
      showPassword: showConfirmPassword,
      togglePassword: () => setShowConfirmPassword(!showConfirmPassword),
    },
  ];

  // Validations
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const validateForm = () => {
    let isValid = true;

    setEmailError('');
    setPasswordError('');
    setConfirmError('');

    if (!emailRegex.test(email)) {
      setEmailError('Email invalide');
      isValid = false;
    }

    if (!passwordRegex.test(password)) {
      setPasswordError(
        'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial',
      );
      isValid = false;
    }

    if (password !== verifyPassword) {
      setConfirmError('Les mots de passe ne correspondent pas');
      isValid = false;
    }

    return isValid;
  };

  const handleSignup = async () => {
    const isValid = validateForm();
    if (!isValid) return;

    if (!username || !email || !password || !verifyPassword) {
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
    <SafeAreaView className="flex-1 mt-[100px]">
      <View className="flex-col items-center gap-1 mb-[20px]">
        <Logo />
        <Title label="Inscription" />
      </View>
      <View className="p-10 gap-5">
        {inputData.map((input, index) => (
          <Input
            secureTextEntry={input?.id === 'password' ? true : false}
            placeholder={input.placeholder}
            key={index}
            onChangeText={input.onChangeText}
            value={input.value}
            showPassword={input.showPassword}
            togglePassword={input.togglePassword}
            errorMessage={
              index === 1
                ? emailError
                : index === 2
                  ? passwordError
                  : index === 3
                    ? confirmError
                    : ''
            }
          />
        ))}
      </View>
      <View className="flex-col items-center gap-3 p-10">
        <ButtonAuth
          onPress={handleSignup}
          label="S'inscrire"
          text="Déjà inscrit ?"
          labelSecondButton="Se connecter"
          onPressSecondButton={handleRedirectSignIn}
        />
      </View>
    </SafeAreaView>
  );
};

export default Signup;
