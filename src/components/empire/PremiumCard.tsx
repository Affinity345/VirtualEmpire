import React from 'react';
import { Pressable, StyleSheet, View, ViewProps } from 'react-native';

import { premium } from '@/utils/premiumTheme';

type Props = ViewProps & {
  onPress?: () => void;
  disabled?: boolean;
};

export function PremiumCard({ children, onPress, disabled, style, ...props }: Props) {
  const content = (
    <View {...props} style={[styles.card, disabled && styles.disabled, style]}>
      {children}
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => pressed && styles.pressed}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: premium.radius.md,
    borderWidth: 1,
    borderColor: premium.colors.line,
    backgroundColor: premium.colors.panel,
    padding: 15,
    shadowColor: premium.colors.gold,
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  disabled: {
    opacity: 0.54,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
});
