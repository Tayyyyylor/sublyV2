import React from 'react';
import {
  InputModeOptions,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  inputMode?: InputModeOptions | undefined;
  secureTextEntry?: boolean;
  showPassword?: boolean;
  togglePassword?: () => void;
  errorMessage?: string;
}

const Input = ({
  placeholder,
  value,
  onChangeText,
  inputMode,
  secureTextEntry = false,
  showPassword,
  togglePassword,
  errorMessage,
}: InputProps) => {
  return (
    <View>
      <TextInput
        secureTextEntry={secureTextEntry ? !showPassword : false}
        className={`bg-[white] p-3 w-full border-2 rounded-[5px] relative ${errorMessage ? 'border-red-500' : 'border-black-500'}`}
        placeholder={placeholder}
        value={value}
        placeholderTextColor="gray"
        onChangeText={onChangeText}
        textContentType="oneTimeCode"
        inputMode={inputMode}
      />
      {togglePassword && (
        <TouchableOpacity
          onPress={togglePassword}
          className="absolute top-3 right-2"
        >
          <Ionicons
            name={showPassword ? 'eye' : 'eye-off'}
            size={20}
            color="black"
          />
        </TouchableOpacity>
      )}
      {errorMessage && (
        <Text className="text-red-500 text-xs mt-1">{errorMessage}</Text>
      )}
    </View>
  );
};

export default Input;
