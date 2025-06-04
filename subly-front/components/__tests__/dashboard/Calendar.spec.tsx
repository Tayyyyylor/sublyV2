// components/__tests__/dashboard/Calendar.spec.tsx

// 1. On moque react-native-calendars pour intercepter les props
jest.mock('react-native-calendars', () => {
  const React = require('react');
  return {
    Calendar: (props: any) => {
      return <__CalendarMock {...props} />;
    },
    LocaleConfig: {
      locales: {} as Record<string, any>,
      defaultLocale: 'en',
    },
  };
});

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { LocaleConfig } from 'react-native-calendars';
import { Text, TouchableOpacity } from 'react-native';
import CalendarComponent from '@/components/dashboard/Calendar';

// Mock interne qui affiche les props et simule les press
const __CalendarMock = ({
  onDayPress,
  onMonthChange,
  markedDates,
  theme,
}: any) => {
  return (
    <React.Fragment>
      <React.Fragment>
        {/* Simule un jour « 2025-05-20 » */}
        <TouchableOpacity
          testID="DAY_BUTTON"
          onPress={() => onDayPress({ dateString: '2025-05-20' })}
        >
          <Text>2025-05-20</Text>
        </TouchableOpacity>

        {/* Simule un changement de mois */}
        <TouchableOpacity
          testID="MONTH_CHANGE_BUTTON"
          onPress={() =>
            onMonthChange && onMonthChange({ dateString: '2025-06-01' })
          }
        >
          <Text>Change Month</Text>
        </TouchableOpacity>

        {/* Expose markedDates et theme pour vérification */}
        <Text testID="MARKED_DATES">{JSON.stringify(markedDates)}</Text>
        <Text testID="THEME">{JSON.stringify(theme)}</Text>
      </React.Fragment>
    </React.Fragment>
  );
};

describe('<CalendarComponent />', () => {
  it('configure bien le local « fr » et transmet le theme+markedDates', () => {
    expect(LocaleConfig.locales['fr']).toBeUndefined();

    const fakeMarked = {
      '2025-05-20': { selected: true, marked: true },
    };

    const { getByTestId } = render(
      <CalendarComponent
        onDayPress={jest.fn()}
        markedDates={fakeMarked}
        onMonthChange={jest.fn()}
      />,
    );

    // Vérifie que la locale a été configurée
    expect(LocaleConfig.locales['fr']).toBeDefined();
    expect(LocaleConfig.defaultLocale).toBe('fr');

    // Vérifie le markedDates transmis
    const markedText = getByTestId('MARKED_DATES').props.children;
    expect(JSON.parse(markedText)).toEqual(fakeMarked);

    // Vérifie une clé de theme
    const theme = JSON.parse(getByTestId('THEME').props.children);
    expect(theme.calendarBackground).toBe('#121212');
    expect(theme.todayTextColor).toBe('#FBBF24');
  });

  it('appelle onDayPress avec l’objet complet { dateString: … }', () => {
    const onDayPress = jest.fn();
    const { getByTestId } = render(
      <CalendarComponent onDayPress={onDayPress} markedDates={{}} />,
    );

    fireEvent.press(getByTestId('DAY_BUTTON'));

    // ATTENTION : onDayPress est appelé avec l’objet { dateString: '2025-05-20' }
    expect(onDayPress).toHaveBeenCalledWith({ dateString: '2025-05-20' });
  });

  it('appelle onMonthChange avec l’objet Date correspondant', () => {
    const onMonthChange = jest.fn();
    const { getByTestId } = render(
      <CalendarComponent
        onDayPress={jest.fn()}
        markedDates={{}}
        onMonthChange={onMonthChange}
      />,
    );

    fireEvent.press(getByTestId('MONTH_CHANGE_BUTTON'));

    expect(onMonthChange).toHaveBeenCalledTimes(1);
    const calledArg = onMonthChange.mock.calls[0][0];
    expect(calledArg instanceof Date).toBe(true);
    expect(calledArg.toISOString().startsWith('2025-06-01')).toBe(true);
  });
});
