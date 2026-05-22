import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { isNativeAdMobAvailable } from '@/ads/adMob';
import { premium } from '@/utils/premiumTheme';

type BannerComponent = React.ComponentType<{
  unitId: string;
  size: string;
  requestOptions?: {
    requestNonPersonalizedAdsOnly?: boolean;
  };
}>;

type Props = {
  hidden?: boolean;
};

export function AdMobBanner({ hidden }: Props) {
  const [BannerAd, setBannerAd] = useState<BannerComponent | undefined>();
  const [bannerSize, setBannerSize] = useState<string>('BANNER');
  const [unitId, setUnitId] = useState<string>('test-banner');

  useEffect(() => {
    if (hidden || !isNativeAdMobAvailable()) return;

    import('react-native-google-mobile-ads')
      .then((module) => {
        setBannerAd(() => module.BannerAd);
        setBannerSize(module.BannerAdSize.ANCHORED_ADAPTIVE_BANNER);
        setUnitId(module.TestIds.BANNER);
      })
      .catch(() => {
        setBannerAd(undefined);
      });
  }, [hidden]);

  if (hidden) return null;

  return (
    <View style={styles.shell} pointerEvents="box-none">
      {BannerAd ? (
        <BannerAd
          unitId={unitId}
          size={bannerSize}
          requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        />
      ) : (
        <Text style={styles.placeholder}>Pub bientôt disponible</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    minHeight: 34,
    borderTopWidth: 1,
    borderTopColor: premium.colors.line,
    backgroundColor: 'rgba(5,5,4,0.96)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  placeholder: {
    color: premium.colors.muted,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});
