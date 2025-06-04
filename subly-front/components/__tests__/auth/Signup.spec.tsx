// __tests__/auth/Signup.spec.tsx

// 1. Mock expo-font pour éviter l’erreur loadedNativeFonts.forEach
jest.mock('expo-font', () => ({
  isLoaded: () => true,
  loadAsync: jest.fn(),
}));

// 2. Mock @expo/vector-icons pour que les Icon ne cassent pas le rendu
jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
  MaterialIcons: () => null,
  createIconSet: () => () => null,
}));

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import Signup from '../../auth/Signup';

import * as authService from '@/services/authService';
import { useRouter } from 'expo-router';

jest.mock('@/services/authService');
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

const alertMock = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('Composant <Signup />', () => {
  let mockRegisterUser: jest.Mock;
  let mockPush: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // on mocke registerUser
    mockRegisterUser = jest.fn();
    (authService.registerUser as jest.Mock) = mockRegisterUser;

    // on mocke useRouter().push
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('affiche tous les champs et le bouton', () => {
    const { getByPlaceholderText, getByText } = render(<Signup />);

    expect(getByPlaceholderText('Prénom')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Mot de passe')).toBeTruthy();
    expect(getByPlaceholderText('Confirmer mot de passe')).toBeTruthy();
    expect(getByText("S'inscrire")).toBeTruthy();
    expect(getByText('Déjà inscrit ?')).toBeTruthy();
    expect(getByText('Se connecter')).toBeTruthy();
  });

  it('nʼappelle pas registerUser si lʼemail est invalide', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<Signup />);

    // on saisit un email invalide
    fireEvent.changeText(getByPlaceholderText('Prénom'), 'John');
    fireEvent.changeText(getByPlaceholderText('Email'), 'invalid-email');
    fireEvent.changeText(getByPlaceholderText('Mot de passe'), 'Password1!');
    fireEvent.changeText(
      getByPlaceholderText('Confirmer mot de passe'),
      'Password1!',
    );

    fireEvent.press(getByText("S'inscrire"));

    await waitFor(() => {
      // l'erreur d'email doit apparaître dans le Input
      expect(queryByText('Email invalide')).toBeTruthy();
    });
    expect(mockRegisterUser).not.toHaveBeenCalled();
  });

  it('nʼappelle pas registerUser si le mot de passe ne respecte pas le pattern', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<Signup />);

    fireEvent.changeText(getByPlaceholderText('Prénom'), 'John');
    fireEvent.changeText(getByPlaceholderText('Email'), 'john@example.com');
    // mot de passe sans majuscule ni caractère spécial
    fireEvent.changeText(getByPlaceholderText('Mot de passe'), 'password');
    fireEvent.changeText(
      getByPlaceholderText('Confirmer mot de passe'),
      'password',
    );

    fireEvent.press(getByText("S'inscrire"));

    await waitFor(() => {
      expect(
        queryByText(
          'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial',
        ),
      ).toBeTruthy();
    });
    expect(mockRegisterUser).not.toHaveBeenCalled();
  });

  it('nʼappelle pas registerUser si les mots de passe ne correspondent pas', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<Signup />);

    fireEvent.changeText(getByPlaceholderText('Prénom'), 'John');
    fireEvent.changeText(getByPlaceholderText('Email'), 'john@example.com');
    fireEvent.changeText(getByPlaceholderText('Mot de passe'), 'Password1!');
    fireEvent.changeText(
      getByPlaceholderText('Confirmer mot de passe'),
      'Password2?',
    );

    fireEvent.press(getByText("S'inscrire"));

    await waitFor(() => {
      expect(
        queryByText('Les mots de passe ne correspondent pas'),
      ).toBeTruthy();
    });
    expect(mockRegisterUser).not.toHaveBeenCalled();
  });

  it("affiche une erreur d'email lorsque tous les champs sont vides", async () => {
    const { getByText, queryByText } = render(<Signup />);

    // Comme validateForm() est appelé en premier, l'erreur "Email invalide" sera la première levée
    fireEvent.press(getByText("S'inscrire"));

    await waitFor(() => {
      expect(queryByText('Email invalide')).toBeTruthy();
    });
    expect(mockRegisterUser).not.toHaveBeenCalled();
    // L'alert n'est pas appelé ici, car on n'atteint pas le `Alert.alert('Tous les champs sont obligatoires')`
    expect(alertMock).not.toHaveBeenCalledWith(
      'Erreur',
      'Tous les champs sont obligatoires.',
    );
  });

  it('appelle registerUser et navigue en cas de succès', async () => {
    mockRegisterUser.mockResolvedValueOnce({});

    const { getByPlaceholderText, getByText } = render(<Signup />);

    fireEvent.changeText(getByPlaceholderText('Prénom'), 'John');
    fireEvent.changeText(getByPlaceholderText('Email'), 'john@example.com');
    fireEvent.changeText(getByPlaceholderText('Mot de passe'), 'Password1!');
    fireEvent.changeText(
      getByPlaceholderText('Confirmer mot de passe'),
      'Password1!',
    );

    fireEvent.press(getByText("S'inscrire"));

    await waitFor(() => {
      // on vérifie lʼappel au service
      expect(mockRegisterUser).toHaveBeenCalledWith({
        username: 'John',
        email: 'john@example.com',
        password: 'Password1!',
      });
    });

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(
        'Succès',
        'Compte créé avec succès !',
      );
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('alert en cas d’erreur registerUser', async () => {
    mockRegisterUser.mockRejectedValueOnce(new Error('échec'));

    const { getByPlaceholderText, getByText } = render(<Signup />);

    fireEvent.changeText(getByPlaceholderText('Prénom'), 'John');
    fireEvent.changeText(getByPlaceholderText('Email'), 'john@example.com');
    fireEvent.changeText(getByPlaceholderText('Mot de passe'), 'Password1!');
    fireEvent.changeText(
      getByPlaceholderText('Confirmer mot de passe'),
      'Password1!',
    );

    fireEvent.press(getByText("S'inscrire"));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(
        'Erreur',
        'Impossible de créer le compte.',
      );
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('navigate vers signin quand on clique sur le second bouton', () => {
    const { getByText } = render(<Signup />);
    fireEvent.press(getByText('Se connecter'));
    expect(mockPush).toHaveBeenCalledWith('/signin');
  });
});
