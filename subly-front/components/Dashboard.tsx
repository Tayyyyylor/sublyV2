import { useAuth } from '@/context/useAuth';
import { SafeAreaView, Text } from 'react-native';

const Dashboard = () => {
  const { user } = useAuth();

  console.log('user', user);

  return (
    <SafeAreaView>
      <Text className="text-blue-700 text-[40px]">
        Bienvenue {user?.username} sur le dashboard{' '}
      </Text>
    </SafeAreaView>
  );
};

export default Dashboard;
