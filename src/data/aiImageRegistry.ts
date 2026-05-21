import type { ImageSourcePropType } from 'react-native';

export type AiImageCategory =
  | 'businesses'
  | 'cars'
  | 'realEstate'
  | 'luxury'
  | 'collections'
  | 'hero';

export type AiImageEntry = {
  id: string;
  category: AiImageCategory;
  prompt: string;
  localSource?: ImageSourcePropType;
  remoteUrl?: string;
};

export const aiImageRegistry: Record<string, AiImageEntry> = {
  'hero/dashboard': {
    id: 'hero/dashboard',
    category: 'hero',
    prompt:
      'Premium black and gold mobile tycoon game hero background, luxury city skyline, cinematic lighting, realistic, high detail',
  },
  'businesses/private-cafe-1': {
    id: 'businesses/private-cafe-1',
    category: 'businesses',
    prompt:
      'Luxury private cafe interior, black marble, warm gold accents, premium tycoon game asset, realistic mobile card art',
  },
  'realEstate/private-island-1': {
    id: 'realEstate/private-island-1',
    category: 'realEstate',
    prompt:
      'Private island estate at sunset, black and gold luxury branding, realistic premium mobile game asset',
  },
  'cars/bugatti-royal-1': {
    id: 'cars/bugatti-royal-1',
    category: 'cars',
    prompt:
      'Black hypercar with gold reflections in a premium showroom, realistic mobile game card art',
  },
  'luxury/shadow-yacht-1': {
    id: 'luxury/shadow-yacht-1',
    category: 'luxury',
    prompt:
      'Luxury yacht at night with gold ambient light, realistic premium tycoon game asset',
  },
  'collections/old-master-1': {
    id: 'collections/old-master-1',
    category: 'collections',
    prompt:
      'Rare art collection vault, museum lighting, black and gold premium game asset, realistic',
  },
};

export const getAiImage = (slot?: string) => {
  if (!slot) return undefined;
  return aiImageRegistry[slot];
};

export const getAiImageSource = (slot?: string) => getAiImage(slot)?.localSource;

export const getAiImageUrl = (slot?: string) => getAiImage(slot)?.remoteUrl;

export const getAiPrompt = (slot?: string) => getAiImage(slot)?.prompt;
