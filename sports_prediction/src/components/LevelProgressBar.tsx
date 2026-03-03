import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme';

interface LevelProgressBarProps {
  level: number;
  xp: number;
  xpToNext: number;
}

export default function LevelProgressBar({ level, xp, xpToNext }: LevelProgressBarProps) {
  const progress = xp / xpToNext;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.level}>LVL {level}</Text>
        <Text style={styles.xpText}>
          {xp}/{xpToNext} XP
        </Text>
      </View>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${Math.min(progress * 100, 100)}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  level: {
    color: Colors.neonOrange,
    fontWeight: '800',
    fontSize: 14,
  },
  xpText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  barBackground: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.neonOrange,
    borderRadius: 4,
  },
});
