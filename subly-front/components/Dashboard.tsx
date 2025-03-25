import { useAuth } from '@/context/useAuth';
import { SafeAreaView, Text } from 'react-native';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();

  const date = format(new Date(), 'dd/MM/yyyy');

  return (
    <SafeAreaView className="">
      <Text className="font-bold pl-3 mb-[10px]">{date}</Text>
      <Text className="text-blue-700 text-[30px] text-center font-bold">
        Hello {user?.username} ! Bienvenue !
      </Text>
      <Text className="text-pink-500 text-[20px] text-center mt-2 font-bold">
        Dépense prévue ce jour : X €
      </Text>
      <Text className="text-grey-600 text-center mt-2">
        Solde fin du mois :{' '}
      </Text>
      <Text className="p-20 text-center">Calendar</Text>
      <Text className="">Liste des dépenses de la journée</Text>
    </SafeAreaView>
  );
};

export default Dashboard;
