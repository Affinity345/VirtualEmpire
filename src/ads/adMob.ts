import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { AdRewardType, AdRewards, EmpireStats } from '@/game/types';

export const REWARDED_AD_COOLDOWN_SECONDS = 90;
export const REWARDED_AD_DAILY_LIMIT = 12;

type RewardedAdResult = {
  completed: boolean;
  message: string;
  source: 'admob' | 'fallback';
};

type MobileAdsModule = typeof import('react-native-google-mobile-ads');

let mobileAdsPromise: Promise<MobileAdsModule | undefined> | undefined;
let initialized = false;

export const getRewardedAdRewardCash = (reward: AdRewardType, stats: EmpireStats) => {
  if (reward === 'cash') return Math.max(25000, Math.floor(stats.totalIncome * 180));
  if (reward === 'skipTime') return Math.max(50000, Math.floor(stats.totalIncome * 600));
  return 0;
};

export const getAdCooldownRemaining = (adRewards: AdRewards, now = Date.now()) => {
  if (!adRewards.lastRewardedAdAt) return 0;
  const elapsed = Math.floor((now - adRewards.lastRewardedAdAt) / 1000);
  return Math.max(0, adRewards.rewardedAdCooldownSeconds - elapsed);
};

export const getRewardedAdsWatchedToday = (adRewards: AdRewards) =>
  adRewards.rewardedAdDay === getDayKey() ? adRewards.rewardedAdDailyCount : 0;

export const getRewardedAdBlockReason = (adRewards: AdRewards, now = Date.now()) => {
  const cooldown = getAdCooldownRemaining(adRewards, now);
  if (cooldown > 0) return `Cooldown ${cooldown}s`;
  if (getRewardedAdsWatchedToday(adRewards) >= adRewards.rewardedAdDailyLimit) {
    return 'Limite journaliere atteinte';
  }
  return undefined;
};

export const initializeAdMob = async () => {
  const module = await loadMobileAdsModule();
  if (!module || initialized) return;
  await module.default().initialize();
  initialized = true;
};

export const showRewardedAd = async (): Promise<RewardedAdResult> => {
  const module = await loadMobileAdsModule();

  if (!module) {
    return {
      completed: true,
      message: 'Pub bientôt disponible : reward alpha accordée',
      source: 'fallback',
    };
  }

  await initializeAdMob();

  return new Promise((resolve) => {
    const rewarded = module.RewardedAd.createForAdRequest(module.TestIds.REWARDED, {
      requestNonPersonalizedAdsOnly: true,
    });
    let earnedReward = false;

    const unsubscribeEarned = rewarded.addAdEventListener(
      module.RewardedAdEventType.EARNED_REWARD,
      () => {
        earnedReward = true;
      },
    );
    const unsubscribeLoaded = rewarded.addAdEventListener(module.AdEventType.LOADED, () => {
      rewarded.show();
    });
    const unsubscribeClosed = rewarded.addAdEventListener(module.AdEventType.CLOSED, () => {
      unsubscribeEarned();
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
      resolve({
        completed: earnedReward,
        message: earnedReward ? 'Reward validee' : 'Pub fermee avant la fin',
        source: 'admob',
      });
    });
    const unsubscribeError = rewarded.addAdEventListener(module.AdEventType.ERROR, () => {
      unsubscribeEarned();
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
      resolve({
        completed: false,
        message: 'Pub indisponible',
        source: 'admob',
      });
    });

    rewarded.load();
  });
};

export const isNativeAdMobAvailable = () =>
  Platform.OS !== 'web' && Constants.appOwnership !== 'expo';

const loadMobileAdsModule = async () => {
  if (!isNativeAdMobAvailable()) return undefined;
  mobileAdsPromise ??= import('react-native-google-mobile-ads').catch(() => undefined);
  return mobileAdsPromise;
};

const getDayKey = () => new Date().toISOString().slice(0, 10);
