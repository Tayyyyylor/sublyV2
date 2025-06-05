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
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  inputMode?: InputModeOptions | undefined;
  secureTextEntry?: boolean;
  showPassword?: boolean;
  togglePassword?: () => void;
  errorMessage?: string;
  onBlur?: () => void;
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
        className={`bg-[#242323] p-4 w-full border-b-2 border-gray-400 rounded-[5px] relative ${errorMessage ? 'border-red-500' : 'border-gray-100'} text-white`}
        placeholder={placeholder}
        value={value}
        placeholderTextColor="white"
        onChangeText={onChangeText}
        textContentType="oneTimeCode"
        inputMode={inputMode}
        keyboardAppearance="dark"
      />
      {togglePassword && (
        <TouchableOpacity
          onPress={togglePassword}
          className="absolute top-4 right-2"
        >
          <Ionicons
            name={showPassword ? 'eye' : 'eye-off'}
            size={20}
            color="white"
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
