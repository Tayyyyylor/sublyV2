import Cat from '@/components/Cat';
import Input from '@/components/Input';
import { SafeAreaView, Text, View } from 'react-native';

export default function HomeScreen() {
  const inputData = [
    {
      placeholder: 'prenom',
    },
    {
      placeholder: 'nom',
    },
    {
      placeholder: 'email',
    },
    {
      placeholder: 'password',
    },
  ];
  return (
    <SafeAreaView>
      <Cat />
      <View className="p-2 gap-3">
        {inputData.map((input, index) => (
          <Input placeholder={input.placeholder} key={index} />
        ))}
      </View>
    </SafeAreaView>
  );
}
