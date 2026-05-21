import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { EmpireButton } from '@/components/empire/EmpireButton';
import { formatMoney } from '@/utils/format';
import { PremiumCard } from '@/components/empire/PremiumCard';
import { SectionHeader } from '@/components/empire/SectionHeader';
import { premium } from '@/utils/premiumTheme';
import { EmpireAction } from '@/game/reducer';
import { MarketAsset } from '@/game/types';

type Props = {
  market: MarketAsset[];
  cash: number;
  dispatch: React.Dispatch<EmpireAction>;
};

export function TradingScreen({ market, cash, dispatch }: Props) {
  const marketValue = market.reduce((sum, asset) => sum + asset.owned * asset.price, 0);
  const invested = market.reduce((sum, asset) => sum + asset.invested, 0);
  const realizedProfit = market.reduce((sum, asset) => sum + asset.realizedProfit, 0);
  const unrealizedProfit = marketValue - invested;
  const portfolioReturn = invested > 0 ? (unrealizedProfit / invested) * 100 : 0;
  const exposure = market.reduce((sum, asset) => sum + asset.owned, 0);
  const bullishCount = market.filter((asset) => asset.price >= asset.dayOpen).length;
  const sentiment = bullishCount >= Math.ceil(market.length * 0.6) ? 'Haussier' : bullishCount <= 1 ? 'Defensif' : 'Neutre';
  const memeCoins = market.filter((asset) => isMemeCoin(asset.id));
  const classicAssets = market.filter((asset) => !isMemeCoin(asset.id));

  return (
    <View style={styles.gap}>
      <SectionHeader
        title="Trading desk"
        subtitle="Prix mid, spread bid/ask, momentum et volume simulent un marche plus vivant."
      />
      <PremiumCard style={styles.deskCard}>
        <View style={styles.deskRow}>
          <DeskMetric label="Sentiment" value={sentiment} />
          <DeskMetric label="Exposition" value={exposure.toString()} />
          <DeskMetric label="Valeur" value={formatTradeMoney(marketValue)} />
        </View>
        <View style={styles.portfolioRow}>
          <PortfolioMetric label="Investi" value={formatTradeMoney(invested)} />
          <PortfolioMetric
            label="P/L latent"
            value={formatSignedTradeMoney(unrealizedProfit)}
            positive={unrealizedProfit >= 0}
          />
          <PortfolioMetric
            label="P/L realise"
            value={formatSignedTradeMoney(realizedProfit)}
            positive={realizedProfit >= 0}
          />
          <PortfolioMetric
            label="Rendement"
            value={`${portfolioReturn >= 0 ? '+' : ''}${portfolioReturn.toFixed(2)}%`}
            positive={portfolioReturn >= 0}
          />
        </View>
      </PremiumCard>
      <Text style={styles.sectionLabel}>Meme coins</Text>
      {memeCoins.map((asset) => (
        <MarketRow key={asset.id} asset={asset} cash={cash} dispatch={dispatch} />
      ))}
      <Text style={styles.sectionLabel}>Marches classiques</Text>
      {classicAssets.map((asset) => (
        <MarketRow key={asset.id} asset={asset} cash={cash} dispatch={dispatch} />
      ))}
    </View>
  );
}

function MarketRow({
  asset,
  cash,
  dispatch,
}: {
  asset: MarketAsset;
  cash: number;
  dispatch: React.Dispatch<EmpireAction>;
}) {
        const up = asset.price >= asset.previousPrice;
        const dayChange = ((asset.price - asset.dayOpen) / asset.dayOpen) * 100;
        const bidPrice = normalizeTradePrice(asset.price * (1 - asset.spread));
        const askPrice = normalizeTradePrice(asset.price * (1 + asset.spread));
        const momentumLabel = asset.momentum > 0.01 ? 'Achat fort' : asset.momentum < -0.01 ? 'Pression vente' : 'Range';
        const meme = isMemeCoin(asset.id);
        const positionValue = asset.owned * asset.price;
        const unrealized = positionValue - asset.invested;
        const positionReturn = asset.invested > 0 ? (unrealized / asset.invested) * 100 : 0;

        return (
          <PremiumCard style={meme && styles.memeCard}>
            <View style={styles.top}>
              <View>
                <Text style={styles.symbol}>{asset.symbol}</Text>
                <Text style={styles.name}>{asset.name}</Text>
                <Text style={styles.type}>
                  {meme ? 'Meme coin' : asset.type} - Risque {asset.risk}
                </Text>
              </View>
              <View style={styles.priceBox}>
                <Text style={styles.price}>€ {formatTradePrice(asset.price)}</Text>
                <Text style={up ? styles.up : styles.down}>
                  {dayChange >= 0 ? '+' : ''}{dayChange.toFixed(2)}%
                </Text>
              </View>
            </View>
            <View style={styles.marketGrid}>
              <MarketCell label="Bid" value={`€ ${formatTradePrice(bidPrice)}`} />
              <MarketCell label="Ask" value={`€ ${formatTradePrice(askPrice)}`} />
              <MarketCell label="Volume" value={formatMoney(asset.volume)} />
              <MarketCell label="Signal" value={momentumLabel} />
              <MarketCell label="Prix moyen" value={asset.owned > 0 ? `€ ${formatTradePrice(asset.averageCost)}` : '-'} />
              <MarketCell
                label="P/L position"
                value={
                  asset.owned > 0 ? `${formatSignedTradeMoney(unrealized)} (${positionReturn.toFixed(1)}%)` : '-'
                }
                tone={unrealized >= 0 ? 'up' : 'down'}
              />
            </View>
            <Text style={styles.meta}>
              Possede : {asset.owned} - Investi : {formatTradeMoney(asset.invested)} - Realise : {formatTradeMoney(asset.realizedProfit)}
            </Text>
            <View style={styles.actions}>
              <EmpireButton
                label={`Acheter € ${formatTradePrice(askPrice)}`}
                disabled={cash < askPrice}
                onPress={() => dispatch({ type: 'buyMarket', id: asset.id })}
              />
              <EmpireButton
                label={`Vendre € ${formatTradePrice(bidPrice)}`}
                tone="dark"
                disabled={asset.owned <= 0}
                onPress={() => dispatch({ type: 'sellMarket', id: asset.id })}
              />
            </View>
          </PremiumCard>
        );
}

const isMemeCoin = (id: string) =>
  ['doge', 'shiba', 'pepe', 'floki', 'bonk', 'wif', 'meme', 'cat'].some((prefix) =>
    id === prefix || id.startsWith(`${prefix}-`),
  );

const normalizeTradePrice = (value: number) => {
  if (value < 0.000001) return 0.000001;
  if (value < 1) return Number(value.toPrecision(4));
  return Math.round(value);
};

const formatTradePrice = (value: number) => {
  if (value === 0) return '0';
  const absoluteValue = Math.abs(value);
  if (absoluteValue < 0.0001) return value.toFixed(6);
  if (absoluteValue < 1) return value.toFixed(4);
  return formatMoney(value);
};

const formatTradeMoney = (value: number) => `€ ${formatTradePrice(value)}`;

const formatSignedTradeMoney = (value: number) =>
  `${value >= 0 ? '+' : '-'}€ ${formatTradePrice(Math.abs(value))}`;

function DeskMetric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.deskMetric}>
      <Text style={styles.cellLabel}>{label}</Text>
      <Text style={styles.cellValue}>{value}</Text>
    </View>
  );
}

function PortfolioMetric({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <View style={styles.portfolioMetric}>
      <Text style={styles.cellLabel}>{label}</Text>
      <Text
        style={[
          styles.cellValue,
          positive === true && styles.positiveText,
          positive === false && styles.negativeText,
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

function MarketCell({ label, value, tone }: { label: string; value: string; tone?: 'up' | 'down' }) {
  return (
    <View style={styles.marketCell}>
      <Text style={styles.cellLabel}>{label}</Text>
      <Text
        style={[
          styles.cellValue,
          tone === 'up' && styles.positiveText,
          tone === 'down' && styles.negativeText,
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  gap: {
    gap: 12,
  },
  deskCard: {
    backgroundColor: premium.colors.panelElevated,
  },
  deskRow: {
    flexDirection: 'row',
    gap: 8,
  },
  portfolioRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  portfolioMetric: {
    flexBasis: '47%',
    flexGrow: 1,
    borderWidth: 1,
    borderColor: premium.colors.line,
    borderRadius: premium.radius.sm,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.16)',
  },
  deskMetric: {
    flex: 1,
    borderWidth: 1,
    borderColor: premium.colors.line,
    borderRadius: premium.radius.sm,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  sectionLabel: {
    color: premium.colors.goldBright,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 8,
    textTransform: 'uppercase',
  },
  memeCard: {
    borderColor: 'rgba(244, 210, 122, 0.42)',
    backgroundColor: 'rgba(215, 179, 90, 0.07)',
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  symbol: {
    color: premium.colors.goldBright,
    fontSize: 20,
    fontWeight: '900',
  },
  name: {
    color: premium.colors.text,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 4,
  },
  type: {
    color: premium.colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
  priceBox: {
    alignItems: 'flex-end',
  },
  price: {
    color: premium.colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  up: {
    color: premium.colors.success,
    fontWeight: '800',
    marginTop: 4,
  },
  down: {
    color: premium.colors.danger,
    fontWeight: '800',
    marginTop: 4,
  },
  marketGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  marketCell: {
    flexBasis: '47%',
    flexGrow: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: premium.radius.sm,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.025)',
  },
  cellLabel: {
    color: premium.colors.muted,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  cellValue: {
    color: premium.colors.text,
    fontSize: 13,
    fontWeight: '900',
    marginTop: 5,
  },
  positiveText: {
    color: premium.colors.success,
  },
  negativeText: {
    color: premium.colors.danger,
  },
  meta: {
    color: premium.colors.muted,
    fontSize: 13,
    marginTop: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
});
