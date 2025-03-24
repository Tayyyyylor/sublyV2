import { useAuth } from '@/context/useAuth';
import { SafeAreaView, Text } from 'react-native';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <SafeAreaView className=''>
      <Text>Date</Text>
      <Text className="text-blue-700 text-[30px] text-center">
        Hello {user?.username} ! Bienvenue !
      </Text>
      <Text>Dépense prévue ce jour : X €</Text>
      <Text>Solde fin du mois : </Text>
      <Text>Calendar</Text>
      <Text>Liste des dépenses de la journées</Text>

    </SafeAreaView>
  );
};

export default Dashboard;
