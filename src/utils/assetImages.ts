import type { ImageSourcePropType } from 'react-native';

import { getAiImageSource, getAiImageUrl } from '@/data/aiImageRegistry';

export type ResolvedAssetImage = {
  source?: ImageSourcePropType | { uri: string };
  isLocal: boolean;
};

export const resolveAssetImage = ({
  imageSlot,
  imageUrl,
}: {
  imageSlot?: string;
  imageUrl?: string;
}): ResolvedAssetImage => {
  const localSource = getAiImageSource(imageSlot);

  if (localSource) {
    return {
      source: localSource,
      isLocal: true,
    };
  }

  const registeredUrl = getAiImageUrl(imageSlot);

  if (registeredUrl) {
    return {
      source: { uri: registeredUrl },
      isLocal: false,
    };
  }

  if (imageUrl) {
    return {
      source: { uri: imageUrl },
      isLocal: false,
    };
  }

  return {
    source: undefined,
    isLocal: false,
  };
};
