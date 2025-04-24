import { getAllEvent } from '@/services/eventService';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, SafeAreaView, Text, View } from 'react-native';

const Stats = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const resp = await getAllEvent();
        setEvents(resp);
      } catch (error) {
        Alert.alert('Erreur', 'Impossible de se connecter.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  console.log('events', events);
  return (
    <SafeAreaView>
      {/* {isLoading ? (
        <Text>Chargement...</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="mb-3">
              <Text>Nom: {item.name}</Text>
              <Text>Montant: {item.amount}</Text>
              <Text>Fréquence: {item.frequency}</Text>
            </View>
          )}
        />
      )} */}
    </SafeAreaView>
  );
};

export default Stats;
