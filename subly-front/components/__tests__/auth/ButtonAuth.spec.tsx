import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ButtonAuth from '../../auth/ButtonAuth';

describe('ButtonAuth', () => {
  it('should display the correct labels and text', () => {
    const mockPress1 = jest.fn();
    const mockPress2 = jest.fn();

    const { getByText } = render(
      <ButtonAuth
        onPress={mockPress1}
        onPressSecondButton={mockPress2}
        label="Se connecter"
        labelSecondButton="Créer un compte"
        text="Pas encore inscrit ?"
      />,
    );

    expect(getByText('Se connecter')).toBeTruthy();

    expect(getByText('Pas encore inscrit ?')).toBeTruthy();

    expect(getByText('Créer un compte')).toBeTruthy();
  });

  it('should call onPress when the primary button is pressed', () => {
    const mockPress1 = jest.fn();
    const mockPress2 = jest.fn();

    const { getByText } = render(
      <ButtonAuth
        onPress={mockPress1}
        onPressSecondButton={mockPress2}
        label="Se connecter"
        labelSecondButton="Créer un compte"
        text="Pas encore inscrit ?"
      />,
    );

    fireEvent.press(getByText('Se connecter'));
    expect(mockPress1).toHaveBeenCalledTimes(1);
    expect(mockPress2).not.toHaveBeenCalled();
  });

  it('should call onPressSecondButton when the secondary button is pressed', () => {
    const mockPress1 = jest.fn();
    const mockPress2 = jest.fn();

    const { getByText } = render(
      <ButtonAuth
        onPress={mockPress1}
        onPressSecondButton={mockPress2}
        label="Se connecter"
        labelSecondButton="Créer un compte"
        text="Pas encore inscrit ?"
      />,
    );

    fireEvent.press(getByText('Créer un compte'));
    expect(mockPress2).toHaveBeenCalledTimes(1);
    expect(mockPress1).not.toHaveBeenCalled();
  });
});
