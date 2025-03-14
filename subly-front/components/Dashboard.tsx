import { getAuthToken } from '@/services/userService';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react'
import { ActivityIndicator, SafeAreaView, Text, View } from 'react-native'

const Dashboard = () => {

  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getAuthToken();
      if (!token) {
        router.replace("/signin"); // Rediriger si pas connecté
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  return (
    <SafeAreaView>
        <Text className='text-blue-700'>Bienvenue sur le dashboard</Text>
    </SafeAreaView>
  )
}

export default Dashboard