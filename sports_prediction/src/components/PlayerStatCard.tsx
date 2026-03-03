import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme';
import { NBAPlayer } from '../types/index';
import GlassCard from './GlassCard';

interface PlayerStatCardProps {
  player: NBAPlayer;
  compact?: boolean;
}

export default function PlayerStatCard({ player, compact = false }: PlayerStatCardProps) {
  if (compact) {
    return (
      <GlassCard style={styles.compactCard}>
        <Text style={styles.compactName}>
          #{player.number} {player.name}
        </Text>
        <View style={styles.compactStats}>
          <StatPill label="PPG" value={player.ppg} />
          <StatPill label="RPG" value={player.rpg} />
          <StatPill label="APG" value={player.apg} />
        </View>
      </GlassCard>
    );
  }

  return (
    <GlassCard style={styles.card} gradient>
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{player.name}</Text>
          <Text style={styles.subtitle}>
            #{player.number} · {player.team} · {player.position}
          </Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <StatBox label="PPG" value={player.ppg} accent />
        <StatBox label="RPG" value={player.rpg} />
        <StatBox label="APG" value={player.apg} />
        <StatBox label="FG%" value={player.fgPct} />
        <StatBox label="3P%" value={player.threePct} />
        <StatBox label="PROJ" value={player.projection} accent />
      </View>
    </GlassCard>
  );
}

function StatBox({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, accent && { color: Colors.neonOrange }]}>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillValue}>{value}</Text>
      <Text style={styles.pillLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  compactCard: {
    marginBottom: 10,
    padding: 12,
  },
  header: {
    marginBottom: 16,
  },
  name: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statBox: {
    width: '30%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  statValue: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
  },
  compactName: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  compactStats: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59,130,246,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  pillValue: {
    color: Colors.electricBlue,
    fontSize: 13,
    fontWeight: '700',
  },
  pillLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
});
