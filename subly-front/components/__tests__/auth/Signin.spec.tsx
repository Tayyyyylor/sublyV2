jest.mock('expo-font', () => ({
  // isLoaded sera appelé par @expo/vector-icons, on renvoie toujours true
  isLoaded: () => true,
  loadAsync: jest.fn(),
}));

// 2. On moque @expo/vector-icons pour que tous les Icons soient des composants vides
jest.mock('@expo/vector-icons', () => {
  return {
    // Si votre Input importe Ionicons (ou un autre jeu d’icônes), on retourne juste un composant null
    Ionicons: () => null,
    MaterialIcons: () => null,
    createIconSet: () => () => null,
  };
});

// 3. On moque les autres dépendances comme précédemment
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

import * as authService from '@/services/authService';
import * as useAuthHook from '@/context/useAuth';
import { useRouter } from 'expo-router';
import Signin from '@/components/auth/Signin';

jest.mock('@/services/authService');
jest.mock('@/context/useAuth');
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

const alertMock = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('Composant <Signin />', () => {
  let mockSignIn: jest.Mock;
  let mockReplace: jest.Mock;
  let mockLoginUser: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSignIn = jest.fn();
    (useAuthHook.useAuth as jest.Mock).mockReturnValue({ signIn: mockSignIn });

    mockReplace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });

    mockLoginUser = jest.fn();
    (authService.loginUser as jest.Mock) = mockLoginUser;
  });

  it('affiche les champs email, mot de passe et le bouton', () => {
    const { getByPlaceholderText, getByText } = render(<Signin />);
    expect(getByPlaceholderText('email')).toBeTruthy();
    expect(getByPlaceholderText('Mot de passe')).toBeTruthy();
    expect(getByText('Se connecter')).toBeTruthy();
    expect(getByText('Pas encore inscrit ?')).toBeTruthy();
    expect(getByText('Créer un compte')).toBeTruthy();
  });

  it('alert si on clique Se connecter sans remplir', async () => {
    const { getByText } = render(<Signin />);
    fireEvent.press(getByText('Se connecter'));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(
        'Erreur',
        'Tous les champs sont obligatoires.',
      );
    });
    expect(mockLoginUser).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('appelle loginUser et navigue en cas de succès', async () => {
    mockLoginUser.mockResolvedValueOnce({});
    const { getByPlaceholderText, getByText } = render(<Signin />);

    fireEvent.changeText(getByPlaceholderText('email'), 'foo@bar.com');
    fireEvent.changeText(getByPlaceholderText('Mot de passe'), 'pass123');
    fireEvent.press(getByText('Se connecter'));

    await waitFor(() => {
      expect(mockLoginUser).toHaveBeenCalledWith(
        { email: 'foo@bar.com', password: 'pass123' },
        mockSignIn,
      );
      expect(mockReplace).toHaveBeenCalledWith('/(tabs)');
    });
    expect(alertMock).not.toHaveBeenCalled();
  });

  it('alert en cas d’erreur loginUser', async () => {
    mockLoginUser.mockRejectedValueOnce(new Error('échec'));
    const { getByPlaceholderText, getByText } = render(<Signin />);

    fireEvent.changeText(getByPlaceholderText('email'), 'foo@bar.com');
    fireEvent.changeText(getByPlaceholderText('Mot de passe'), 'pass123');
    fireEvent.press(getByText('Se connecter'));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(
        'Erreur',
        'Impossible de se connecter.',
      );
      expect(mockReplace).not.toHaveBeenCalled();
    });
  });

  it('navigate vers signup quand on clique sur le second bouton', () => {
    const { getByText } = render(<Signin />);
    fireEvent.press(getByText('Créer un compte'));
    expect(mockReplace).toHaveBeenCalledWith('/signup');
  });
});
