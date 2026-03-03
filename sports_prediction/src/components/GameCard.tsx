import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../theme';
import { NBAGame } from '../types/index';
import GlassCard from './GlassCard';

interface GameCardProps {
  game: NBAGame;
  onPress: () => void;
}

export default function GameCard({ game, onPress }: GameCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <GlassCard style={styles.card} gradient>
        {/* Status badge */}
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusBadge,
              game.status === 'live' && styles.statusLive,
            ]}
          >
            <Text style={styles.statusText}>
              {game.status === 'live' ? '🔴 LIVE' : game.date}
            </Text>
          </View>
          <Text style={styles.time}>{game.time}</Text>
        </View>

        {/* Teams matchup */}
        <View style={styles.matchup}>
          <View style={styles.teamCol}>
            <Text style={styles.teamLogo}>{game.homeTeam.logo}</Text>
            <Text style={styles.teamAbbr}>{game.homeTeam.abbr}</Text>
            <Text style={styles.teamName}>{game.homeTeam.city}</Text>
          </View>

          <View style={styles.vsCol}>
            <Text style={styles.vsText}>VS</Text>
            <View style={styles.oddsRow}>
              <Text style={styles.odds}>{game.homeOdds > 0 ? '+' : ''}{game.homeOdds}</Text>
              <Text style={styles.oddsSep}>|</Text>
              <Text style={styles.odds}>{game.awayOdds > 0 ? '+' : ''}{game.awayOdds}</Text>
            </View>
          </View>

          <View style={styles.teamCol}>
            <Text style={styles.teamLogo}>{game.awayTeam.logo}</Text>
            <Text style={styles.teamAbbr}>{game.awayTeam.abbr}</Text>
            <Text style={styles.teamName}>{game.awayTeam.city}</Text>
          </View>
        </View>

        {/* Arena */}
        <Text style={styles.arena}>📍 {game.arena}</Text>

        {/* Quick stats preview */}
        <View style={styles.previewRow}>
          {game.topPlayers.slice(0, 2).map((p: any) => (
            <Text key={p.id} style={styles.previewText}>
              {p.name.split(' ').pop()} {p.ppg} PPG
            </Text>
          ))}
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    backgroundColor: 'rgba(59,130,246,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusLive: {
    backgroundColor: 'rgba(239,68,68,0.2)',
  },
  statusText: {
    color: Colors.electricBlue,
    fontSize: 12,
    fontWeight: '600',
  },
  time: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  matchup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  teamCol: {
    alignItems: 'center',
    flex: 1,
  },
  teamLogo: {
    fontSize: 36,
    marginBottom: 4,
  },
  teamAbbr: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 2,
  },
  teamName: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  vsCol: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  vsText: {
    color: Colors.neonOrange,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 3,
  },
  oddsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  odds: {
    color: Colors.textSecondary,
    fontSize: 11,
  },
  oddsSep: {
    color: Colors.textMuted,
    marginHorizontal: 4,
    fontSize: 11,
  },
  arena: {
    color: Colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 8,
  },
  previewText: {
    color: Colors.electricBlue,
    fontSize: 11,
    fontWeight: '600',
  },
});
