import React, { useEffect, useState } from 'react';
import {
  Animated,
  Button,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
interface EventOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}
const EventOverlay = ({ isVisible, onClose }: EventOverlayProps) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(0));
  const [selectedFrequency, setSelectedFrequency] = useState();
  const [date, setDate] = useState(new Date(1598051730000));

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  useEffect(() => {
    if (isVisible) {
      // Animation d'entrée
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Réinitialisation quand invisible
      fadeAnim.setValue(0);
      slideAnim.setValue(0);
    }
  }, [isVisible]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0], // Départ depuis le bas (500) jusqu'à position finale (0)
  });

  const handleClose = () => {
    // Animation de sortie
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose(); // Appelé après la fin de l'animation
    });
  };

  if (!isVisible) return null;

  const handleSubmit = () => {};

  return (
    <Animated.View className="absolute inset-0" style={{ opacity: fadeAnim }}>
      {/* Fond semi-transparent cliquable */}
      <TouchableWithoutFeedback onPress={handleClose}>
        <View className="flex-1 bg-black bg-opacity-50" />
      </TouchableWithoutFeedback>

      {/* Contenu du modal */}
      <Animated.View
        className="absolute bottom-0 w-full bg-red-900 rounded-t-3xl p-6"
        style={{
          transform: [{ translateY }],
          maxHeight: '80%', // Limite à 80% de la hauteur
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <SafeAreaView>
            <TextInput
              className="text-white bg-red-800 p-4 mb-4 rounded-lg text-base"
              placeholder="Titre de l'événement"
              placeholderTextColor="#ddd"
            />
            <TextInput
              inputMode="numeric"
              className="text-white bg-red-800 p-4 rounded-lg text-base"
              placeholder="Montant"
              placeholderTextColor="#ddd"
            />
            <Picker
              selectedValue={selectedFrequency}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedFrequency(itemValue)
              }
            >
              <Picker.Item label="Une fois" value="one" />
              <Picker.Item label="Hebdomadaire" value="hebdo" />
              <Picker.Item label="Mensuel" value="monthly" />
              <Picker.Item label="Trimestriel" value="trimestriel" />
              <Picker.Item label="Annuel" value="yearly" />
            </Picker>
            <View className="flex justify-center items-center">
              <Text className="text-white font-bold text-[18px] mb-[20px]">
                Date de début
              </Text>
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                is24Hour={true}
                onChange={onChange}
              />
            </View>

            <Button title="Add" onPress={handleSubmit} />
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Animated.View>
    </Animated.View>
  );
};

export default EventOverlay;
