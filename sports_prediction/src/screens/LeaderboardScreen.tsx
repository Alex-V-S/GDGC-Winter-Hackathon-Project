import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme';
import { useAppStore } from '../store/AppContext';
import { GlassCard, CoinBadge, LevelProgressBar } from '../components';
import { isConfigured, supabase } from '../services/supabase';

interface LeaderboardRow {
  id: string;
  username: string;
  fan_iq: number;
  streak: number;
  coins: number;
}

export default function LeaderboardScreen() {
  const { user } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<LeaderboardRow[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!isConfigured) {
        setRows([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id,username,fan_iq,streak,coins')
        .order('fan_iq', { ascending: false })
        .limit(10);

      if (error) {
        console.warn('Failed to fetch leaderboard:', error.message);
        setRows([]);
      } else {
        setRows((data ?? []) as LeaderboardRow[]);
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  return (
    <LinearGradient colors={['#0B0E1A', '#111427']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <Text style={styles.title}>🏆 Leaderboard</Text>

        {/* Your profile card */}
        <GlassCard style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Text style={styles.profileEmoji}>🌟</Text>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.username}</Text>
              <Text style={styles.profileRecord}>
                {user.wins}W – {user.losses}L · 🔥 {user.streak} streak
              </Text>
            </View>
            <CoinBadge coins={user.coins} size="sm" />
          </View>
          <View style={styles.levelWrap}>
            <LevelProgressBar level={user.level} xp={user.xp} xpToNext={user.xpToNext} />
          </View>
        </GlassCard>

        {/* Leaderboard list */}
        {loading ? (
          <ActivityIndicator color={Colors.neonOrange} size="large" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={rows}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => {
              const rank = index + 1;
              const isTop3 = index < 3;
              const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
              const medals = ['🥇', '🥈', '🥉'];

              return (
                <GlassCard style={styles.rowCard}>
                  <View style={styles.row}>
                    <View
                      style={[
                        styles.rankBadge,
                        isTop3 && { backgroundColor: rankColors[index] + '22', borderColor: rankColors[index] },
                      ]}
                    >
                      <Text style={[styles.rankText, isTop3 && { color: rankColors[index] }]}>
                        {rank}
                      </Text>
                    </View>

                    <Text style={styles.avatar}>{isTop3 ? medals[index] : '🏀'}</Text>

                    <View style={styles.info}>
                      <Text style={styles.name}>{item.username}</Text>
                      <Text style={styles.meta}>
                        Fan IQ {item.fan_iq} · 🔥 {item.streak}
                      </Text>
                    </View>

                    <CoinBadge coins={item.coins} size="sm" />
                  </View>
                </GlassCard>
              );
            }}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<Text style={styles.empty}>No leaderboard data yet.</Text>}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    paddingTop: 12,
    paddingBottom: 8,
    letterSpacing: 2,
  },
  profileCard: { marginHorizontal: 20, marginBottom: 16 },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  profileEmoji: { fontSize: 32 },
  profileInfo: { flex: 1 },
  profileName: { color: Colors.textPrimary, fontSize: 16, fontWeight: '700' },
  profileRecord: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  levelWrap: { marginTop: 12 },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  empty: {
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 30,
    fontSize: 13,
  },
  rowCard: { marginBottom: 8, padding: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rankText: { color: Colors.textPrimary, fontSize: 14, fontWeight: '800' },
  avatar: { fontSize: 24 },
  info: { flex: 1 },
  name: { color: Colors.textPrimary, fontSize: 14, fontWeight: '600' },
  meta: { color: Colors.textMuted, fontSize: 11, marginTop: 1 },
});
