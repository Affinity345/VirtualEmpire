import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { resolveAssetImage } from '@/utils/assetImages';
import { premium } from '@/utils/premiumTheme';

type Props = {
  code: string;
  imageSlot?: string;
  imageUrl?: string;
  owned?: boolean;
  size?: 'sm' | 'lg';
};

export function AssetVisual({ code, imageSlot, imageUrl, owned, size = 'sm' }: Props) {
  const image = resolveAssetImage({ imageSlot, imageUrl });

  return (
    <View style={[styles.wrap, size === 'lg' && styles.large, owned && styles.owned]}>
      {image.source ? (
        <Image
          source={image.source}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={180}
          cachePolicy="memory-disk"
        />
      ) : null}
      <View style={[styles.overlay, image.source ? styles.imageOverlay : undefined]} />
      <Text style={styles.code}>{code}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 48,
    height: 48,
    borderRadius: premium.radius.sm,
    borderWidth: 1,
    borderColor: premium.colors.line,
    backgroundColor: premium.colors.panelElevated,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  large: {
    width: 92,
    height: 70,
  },
  owned: {
    borderColor: premium.colors.goldBright,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: premium.colors.panelElevated,
  },
  imageOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.34)',
  },
  code: {
    color: premium.colors.goldBright,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
  },
});
