import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AssetVisual } from '@/components/empire/AssetVisual';
import { EmpireButton } from '@/components/empire/EmpireButton';
import { formatMoney } from '@/utils/format';
import { PremiumCard } from '@/components/empire/PremiumCard';
import { SectionHeader } from '@/components/empire/SectionHeader';
import { premium } from '@/utils/premiumTheme';
import { EmpireAction } from '@/game/reducer';
import { OwnableAsset } from '@/game/types';

type Props = {
  cars: OwnableAsset[];
  luxury: OwnableAsset[];
  cash: number;
  dispatch: React.Dispatch<EmpireAction>;
};

export function GarageScreen({ cars, luxury, cash, dispatch }: Props) {
  const ownedCars = cars.filter((car) => car.owned);
  const ownedLuxury = luxury.filter((item) => item.owned);
  const garageValue = [...ownedCars, ...ownedLuxury].reduce((sum, item) => sum + item.price, 0);
  const flagship = ownedCars.at(-1) ?? ownedLuxury.at(-1) ?? cars[0] ?? luxury[0];

  return (
    <View style={styles.gap}>
      <SectionHeader
        title="Garage & coffre premium"
        subtitle="Stocke tes voitures, jets, yachts et objets luxe dans un espace unique de collection."
      />

      <PremiumCard style={styles.hero}>
        <View style={styles.heroTop}>
          <AssetVisual
            code={flagship.icon}
            imageSlot={flagship.imageSlot}
            imageUrl={flagship.imageUrl}
            owned={flagship.owned}
            size="lg"
          />
          <View style={styles.heroInfo}>
            <Text style={styles.heroLabel}>Piece maitresse</Text>
            <Text style={styles.heroTitle}>{flagship.name}</Text>
            <Text style={styles.heroMeta}>
              {flagship.category === 'cars' ? 'Showroom automobile' : 'Coffre luxe'}
            </Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <GarageStat label="Voitures" value={`${ownedCars.length}/${cars.length}`} />
          <GarageStat label="Luxe stocke" value={`${ownedLuxury.length}/${luxury.length}`} />
        </View>
        <View style={styles.statsRow}>
          <GarageStat label="Capacite" value={`${ownedCars.length + ownedLuxury.length}/${cars.length + luxury.length}`} />
          <GarageStat label="Valeur stockee" value={`€ ${formatMoney(garageValue)}`} />
        </View>
      </PremiumCard>

      <Text style={styles.sectionLabel}>Showroom voitures</Text>
      {cars.map((car, index) => (
        <GarageItem
          key={car.id}
          item={car}
          index={index}
          category="cars"
          cash={cash}
          dispatch={dispatch}
        />
      ))}

      <Text style={styles.sectionLabel}>Coffre luxe</Text>
      {luxury.map((item, index) => (
        <GarageItem
          key={item.id}
          item={item}
          index={index}
          category="luxury"
          cash={cash}
          dispatch={dispatch}
        />
      ))}
    </View>
  );
}

function GarageItem({
  item,
  index,
  category,
  cash,
  dispatch,
}: {
  item: OwnableAsset;
  index: number;
  category: 'cars' | 'luxury';
  cash: number;
  dispatch: React.Dispatch<EmpireAction>;
}) {
  const disabled = item.owned || cash < item.price;
  const rarity = index >= 96 ? 'Mythique' : index >= 48 ? 'Empire' : index >= 20 ? 'Elite' : 'Signature';
  const primarySpec = category === 'cars' ? `Performance ${86 + (index % 24) * 3}` : `Prestige ${88 + (index % 24) * 2}`;
  const secondarySpec = category === 'cars' ? `Prestige ${78 + (index % 24) * 4}` : `Securite coffre ${92 + (index % 12)}`;
  const ownedLabel = category === 'cars' ? 'Dans ton garage' : 'Dans ton coffre';

  return (
    <PremiumCard style={styles.carCard}>
      <View style={styles.carTop}>
        <View style={styles.visualPlate}>
          <AssetVisual
            code={item.icon}
            imageSlot={item.imageSlot}
            imageUrl={item.imageUrl}
            owned={item.owned}
            size="lg"
          />
          <Text style={styles.slot}>{item.imageSlot}</Text>
        </View>
        <View style={styles.carInfo}>
          <Text style={styles.carName}>{item.name}</Text>
          <Text style={styles.meta}>{item.tier} - {rarity}</Text>
          <View style={styles.specRow}>
            <Text style={styles.spec}>{primarySpec}</Text>
            <Text style={styles.spec}>{secondarySpec}</Text>
          </View>
        </View>
      </View>

      <View style={styles.buyRow}>
        <Text style={item.owned ? styles.owned : styles.price}>
          {item.owned ? ownedLabel : `€ ${formatMoney(item.price)}`}
        </Text>
        <EmpireButton
          label={item.owned ? 'Stocke' : 'Acheter'}
          tone={item.owned ? 'dark' : 'gold'}
          disabled={disabled}
          onPress={() => dispatch({ type: 'buyOwnable', category, id: item.id })}
        />
      </View>
    </PremiumCard>
  );
}

function GarageStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.garageStat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  gap: {
    gap: 12,
  },
  hero: {
    backgroundColor: premium.colors.panelElevated,
  },
  heroTop: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  heroInfo: {
    flex: 1,
  },
  heroLabel: {
    color: premium.colors.goldBright,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: premium.colors.text,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 5,
  },
  heroMeta: {
    color: premium.colors.muted,
    fontSize: 12,
    marginTop: 6,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  garageStat: {
    flex: 1,
    borderWidth: 1,
    borderColor: premium.colors.line,
    borderRadius: premium.radius.sm,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  statLabel: {
    color: premium.colors.muted,
    fontSize: 11,
    fontWeight: '800',
  },
  statValue: {
    color: premium.colors.goldBright,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 6,
  },
  sectionLabel: {
    color: premium.colors.goldBright,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 10,
    textTransform: 'uppercase',
  },
  carCard: {
    gap: 14,
  },
  carTop: {
    flexDirection: 'row',
    gap: 12,
  },
  visualPlate: {
    width: 112,
    minHeight: 106,
    borderRadius: premium.radius.sm,
    borderWidth: 1,
    borderColor: premium.colors.line,
    backgroundColor: '#090909',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  slot: {
    color: premium.colors.muted,
    fontSize: 9,
    marginTop: 8,
    textAlign: 'center',
  },
  carInfo: {
    flex: 1,
    minWidth: 0,
  },
  carName: {
    color: premium.colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  meta: {
    color: premium.colors.muted,
    fontSize: 12,
    marginTop: 5,
  },
  specRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  spec: {
    color: premium.colors.champagne,
    borderWidth: 1,
    borderColor: premium.colors.line,
    borderRadius: premium.radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 5,
    fontSize: 11,
    fontWeight: '800',
    overflow: 'hidden',
  },
  buyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  price: {
    color: premium.colors.goldBright,
    fontSize: 16,
    fontWeight: '900',
  },
  owned: {
    color: premium.colors.success,
    fontSize: 14,
    fontWeight: '900',
  },
});
