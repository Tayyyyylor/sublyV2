jest.mock('expo-font', () => ({
  isLoaded: () => true,
  loadAsync: jest.fn(),
}));

jest.mock('@expo/vector-icons', () => {
  return {
    Ionicons: () => null,
    MaterialIcons: () => null,
    createIconSet: () => () => null,
  };
});

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

  it('should display the correct labels and text and button', () => {
    const { getByPlaceholderText, getByText } = render(<Signin />);
    expect(getByPlaceholderText('email')).toBeTruthy();
    expect(getByPlaceholderText('Mot de passe')).toBeTruthy();
    expect(getByText('Se connecter')).toBeTruthy();
    expect(getByText('Pas encore inscrit ?')).toBeTruthy();
    expect(getByText('Créer un compte')).toBeTruthy();
  });

  it('should call alert if the user clicks on the "Se connecter" button without filling in the fields', async () => {
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

  it('should call loginUser and navigate to the dashboard if the user fills in the fields and clicks on the "Se connecter" button', async () => {
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

  it('should call alert if the user fills in the fields and clicks on the "Se connecter" button and the loginUser fails', async () => {
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

  it('should navigate to the signup page if the user clicks on the "Créer un compte" button', () => {
    const { getByText } = render(<Signin />);
    fireEvent.press(getByText('Créer un compte'));
    expect(mockReplace).toHaveBeenCalledWith('/signup');
  });
});
