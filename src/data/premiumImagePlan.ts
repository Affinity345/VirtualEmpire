import { aiImageRegistry } from '@/data/aiImageRegistry';

export const premiumImagePlan = Object.values(aiImageRegistry).map((entry) => ({
  slot: entry.id,
  category: entry.category,
  prompt: entry.prompt,
  ready: Boolean(entry.localSource ?? entry.remoteUrl),
}));
