import { Alert, Button, SafeAreaView, Text, View } from 'react-native';
import Input from '../Input';
import { useState } from 'react';
import { fetchUser } from '@/services/userService';
import { useRouter } from 'expo-router';

const Signin = () => {

  const router = useRouter()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const inputData = [
        { placeholder: "Email", value: email, onChangeText: setEmail },
        { placeholder: "Mot de passe", value: password, onChangeText: setPassword },
      ];

  const handleSignin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires.");
      return;
    }

    try {
      const userData = {
        email,
        password,
      };

      await fetchUser(userData);
      Alert.alert("Succès", "Compte créé avec succès !");
      router.push("/");
    } catch (error) {
      Alert.alert("Erreur", "Impossible de créer le compte.");
    }
  };

  const handleRedirectSignIn = () => {
    router.push("/signup")
  }

  return (
    <SafeAreaView>
        <Text className="text-xl font-bold text-red-600">Connexion</Text>
      <View className="p-2 gap-3">
        {inputData.map((input, index) => (
          <Input placeholder={input.placeholder} key={index} onChangeText={input.onChangeText} value={input.value}/>
        ))}
      </View>
      <Button title="Se connecter" onPress={handleSignin} />
      <Button title="pas encore inscrit ?" onPress={handleRedirectSignIn} />
    </SafeAreaView>
  );
}

export default Signin