import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { premium } from '@/utils/premiumTheme';

type Props = {
  title: string;
  subtitle?: string;
};

export function SectionHeader({ title, subtitle }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.titleRow}>
        <View style={styles.rule} />
        <Text style={styles.title}>{title}</Text>
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rule: {
    width: 4,
    height: 22,
    borderRadius: 999,
    backgroundColor: premium.colors.goldBright,
  },
  title: {
    color: premium.colors.text,
    fontSize: 23,
    fontWeight: '900',
    letterSpacing: 0,
  },
  subtitle: {
    color: premium.colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 5,
  },
});
