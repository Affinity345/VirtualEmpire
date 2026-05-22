import React from 'react';
import { Pressable, StyleSheet, Text, Vibration } from 'react-native';

import { premium } from '@/utils/premiumTheme';

type Props = {
  label: string;
  tone?: 'gold' | 'dark' | 'danger';
  disabled?: boolean;
  onPress: () => void;
};

export function EmpireButton({ label, tone = 'gold', disabled, onPress }: Props) {
  const press = () => {
    Vibration.vibrate(18);
    onPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={press}
      style={({ pressed }) => [
        styles.button,
        tone === 'dark' && styles.dark,
        tone === 'danger' && styles.danger,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}>
      <Text style={[styles.label, tone === 'gold' && styles.goldLabel]} numberOfLines={1} adjustsFontSizeToFit>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    borderRadius: premium.radius.sm,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: premium.colors.gold,
    borderWidth: 1,
    borderColor: premium.colors.goldBright,
    shadowColor: premium.colors.gold,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  dark: {
    borderColor: premium.colors.line,
    backgroundColor: premium.colors.panelSoft,
  },
  danger: {
    borderColor: 'rgba(248, 113, 113, 0.42)',
    backgroundColor: 'rgba(127, 29, 29, 0.72)',
  },
  label: {
    color: premium.colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  goldLabel: {
    color: '#110D05',
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
});
