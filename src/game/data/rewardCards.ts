export type RewardRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type RewardCard = {
  id: string;
  icon: string;
  rarity: RewardRarity;
  category: string;
};

export const RARITY_META: Record<RewardRarity, { label: string; color: number; weight: number }> = {
  common: { label: '일반', color: 0xffc56f, weight: 52 },
  rare: { label: '희귀', color: 0x8fd3ff, weight: 30 },
  epic: { label: '영웅', color: 0xd7a5ff, weight: 14 },
  legendary: { label: '전설', color: 0xffe06f, weight: 4 }
};

export const REWARD_CARDS: RewardCard[] = [
  { id: '피곤함 카드', icon: '😴', rarity: 'common', category: '상태' },
  { id: '럭키 카드', icon: '🍀', rarity: 'rare', category: '행운' },
  { id: '큐브 카드', icon: '🧊', rarity: 'rare', category: '모양' },
  { id: '방패 카드', icon: '🛡️', rarity: 'common', category: '보호' },
  { id: '동물 친구 카드', icon: '🐾', rarity: 'common', category: '동물' },
  { id: '카드마을 주민증', icon: '🏘️', rarity: 'epic', category: '마을' },
  { id: '마법봉 카드', icon: '🪄', rarity: 'epic', category: '마법' },
  { id: '별가루 카드', icon: '🌟', rarity: 'legendary', category: '마법' },
  { id: '맛있는 시장 카드', icon: '🍰', rarity: 'common', category: '음식' },
  { id: '도구 가게 카드', icon: '🔑', rarity: 'rare', category: '도구' },
  { id: '반짝 쇼 카드', icon: '✨', rarity: 'epic', category: '마법' },
  { id: '카드 타워 카드', icon: '🏰', rarity: 'legendary', category: '장소' },
  { id: '무지개 정원 카드', icon: '🌈', rarity: 'rare', category: '자연' },
  { id: '공방 장인 카드', icon: '🛠️', rarity: 'epic', category: '도구' },
  { id: '달빛 방패단 카드', icon: '🌙', rarity: 'epic', category: '보호' },
  { id: '왕관 퍼레이드 카드', icon: '👑', rarity: 'legendary', category: '축제' },
  { id: '고양이 상점 카드', icon: '🐱', rarity: 'rare', category: '마을' },
  { id: '카드 정원사 카드', icon: '🌷', rarity: 'common', category: '자연' }

];

export function pickRewardCard(stars: number, combo: number, random = Math.random): RewardCard {
  const luckBoost = Math.min(12, stars * 2 + Math.floor(combo / 3));
  const weighted = REWARD_CARDS.flatMap((card) => {
    const meta = RARITY_META[card.rarity];
    const bonus = card.rarity === 'legendary' ? luckBoost : card.rarity === 'epic' ? Math.floor(luckBoost / 2) : 0;
    return Array.from({ length: Math.max(1, meta.weight + bonus) }, () => card);
  });
  return weighted[Math.floor(random() * weighted.length)] ?? REWARD_CARDS[0];
}
