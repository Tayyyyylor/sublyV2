// jest.setup.js
import 'react-native-gesture-handler/jestSetup';

// Mock pour les icônes
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
  FontAwesome: 'FontAwesome',
  MaterialIcons: 'MaterialIcons',
  MaterialCommunityIcons: 'MaterialCommunityIcons',
  Entypo: 'Entypo',
  Feather: 'Feather',
}));

// Mock pour expo-font
jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn().mockReturnValue(true),
  useFonts: jest.fn().mockReturnValue([true]),
  Font: {
    isLoaded: jest.fn().mockReturnValue(true),
  },
}));

// Mock pour expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock pour les composants natifs
jest.mock('react-native/Libraries/Components/Pressable/Pressable', () => {
  const { View } = require('react-native');
  return View;
});

jest.mock('react-native/Libraries/Components/SafeAreaView/SafeAreaView', () => {
  const { View } = require('react-native');
  return View;
});

// Mock pour les polices natives
jest.mock('expo-font/src/memory', () => ({
  loadedNativeFonts: new Map(),
}));
