import React from 'react';
import { Modal, Pressable, SafeAreaView, Text, View } from 'react-native';

interface DefaultModalProps {
  onPressConfirm: () => void;
  label: string;
  onPressCancel: () => void;
}

const DefaultModal = ({
  onPressConfirm,
  label,
  onPressCancel,
}: DefaultModalProps) => {
  return (
    <Modal animationType="slide" transparent={true} visible={true}>
      <SafeAreaView className="flex-1 items-center justify-center bg-black/50">
        <View className="bg-white p-6 rounded-2xl w-[80%] items-center">
          <Text className="text-lg font-bold mb-4 text-center">{label}</Text>
          <View className="flex-col gap-3">
            <Pressable
              onPress={onPressConfirm}
              className="bg-red-500 px-4 py-2 rounded-full"
            >
              <Text className="text-white font-bold">Confirmer</Text>
            </Pressable>
            <Pressable
              onPress={onPressCancel}
              className="bg-black px-4 py-2 rounded-full"
            >
              <Text className="text-white font-bold text-center">Annuler</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default DefaultModal;
