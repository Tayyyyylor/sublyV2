import React from 'react';
import {
  InputModeOptions,
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
}

const Input = ({
  placeholder,
  value,
  onChangeText,
  inputMode,
  secureTextEntry,
  showPassword,
  togglePassword,
}: InputProps) => {
  return (
    <View>
      <TextInput
        secureTextEntry={(secureTextEntry = showPassword ? false : true)}
        className="bg-[white] p-3 w-full border-2 border-black-500 rounded-[5px] relative"
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
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
    </View>
  );
};

export default Input;
