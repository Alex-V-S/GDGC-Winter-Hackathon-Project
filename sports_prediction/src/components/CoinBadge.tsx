import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme';

interface CoinBadgeProps {
  coins: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function CoinBadge({ coins, size = 'md' }: CoinBadgeProps) {
  const fontSize = size === 'sm' ? 12 : size === 'lg' ? 20 : 16;

  return (
    <View style={[styles.badge, size === 'lg' && styles.badgeLg]}>
      <Text style={[styles.icon, { fontSize }]}>🪙</Text>
      <Text style={[styles.text, { fontSize }]}>{coins.toLocaleString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 43, 0.15)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 43, 0.3)',
  },
  badgeLg: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    color: Colors.neonOrange,
    fontWeight: '700',
  },
});
